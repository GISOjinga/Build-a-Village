import { Entity, World } from "@rbxts/jecs";
import { deepEquals } from "@rbxts/object-utils";
import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { useEvent, useThrottle } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { getAnimation } from "shared/systems/animator/loadAnimations";
import { addComponent, createEntity, getEntity, printJecs, printTS, removeComponent, warnJecs, warnTS } from "shared/utils/functions/jecsHelpFunctions";
import { particlesEmit, particlesToggle } from "shared/utils/functions/particlesFunctions";
import { ActiveVillagers, Added, Body, CanQuery, Changed, Data, MaxedOut, ModelDebugger, Player, ProduceAll, ReplicatedComponent, systemQueue, TakeFromVillager, TargetEntity, Villager, VillagerAnimator, VillagerCooldown } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";





// function to togggle transparency
const toggleTransparency = (_instance: Instance, visible: boolean, customInvis: number = 1) => {
    const instance: BasePart | Decal = _instance as BasePart | Decal;

    // if the instance is a BasePart or Decal then
    if (instance.IsA("BasePart") || instance.IsA("Decal")) {
        const realTransparency = instance.GetAttribute<number>("Transparency")
        const trueTransparency = realTransparency !== undefined ? realTransparency : instance.Transparency;

        // set up
        instance.SetAttribute("Transparency", trueTransparency);
        instance.Transparency = visible ? trueTransparency : customInvis;
        if (instance.IsA("BasePart")) instance.CollisionGroup = visible ? "Default" : "NoCollision";
    }
}

type VillagerProgressState = { isBeingBuilt: boolean, hasMaxedResources: boolean, currentInProgressPhase: number, resources: Array<ProduceVariant>, produce: ProduceNames }
const villageModelStates = new Map<Instance, VillagerProgressState>();

type CachedPartList = Instance[];
type InProgressCache = { phase: number; parts: CachedPartList };
interface VillagerPartCache {
    resourcesGroup: CachedPartList;
    progressFull: CachedPartList;
    stationParts: CachedPartList;
    npc: CachedPartList;
    accessories: CachedPartList;
    inProgress: InProgressCache[];
    resourceModels: { model: Model; parts: CachedPartList }[];
}

const villagerPartCaches = new Map<VillagerModel, VillagerPartCache>();

type GroupVisibility = { visible: boolean; invis: number };
type GroupVisibilityMap = Record<string, GroupVisibility>;
const groupVisibilityCache = new Map<VillagerModel, GroupVisibilityMap>();

function cacheVillagerParts(villagerModel: VillagerModel): VillagerPartCache {
    let cache = villagerPartCaches.get(villagerModel);
    if (!cache) {
        const station = villagerModel.WaitForChild("Station")
        const parts = station.WaitForChild("Parts");
        cache = {
            resourcesGroup: station.WaitForChild("Parts").WaitForChild("Resources").GetDescendants(),
            progressFull: parts.WaitForChild("ProgressFull").GetDescendants(),
            stationParts: parts.WaitForChild("StationParts").GetDescendants(),
            npc: villagerModel.WaitForChild("Npc").GetDescendants(),
            accessories: villagerModel.WaitForChild("Accessories").GetDescendants(),
            inProgress: parts.WaitForChild("InProgress").GetChildren().map((child) => ({
                phase: tonumber(child.Name) || 1,
                parts: child.GetDescendants(),
            })),
            resourceModels: parts.WaitForChild("Resources").GetChildren<Model>().map((model) => ({
                model,
                parts: model.GetDescendants(),
            })),
        };
        villagerPartCaches.set(villagerModel, cache);
    }
    return cache;
}

function applyGroupVisibility(villagerModel: VillagerModel, group: string, parts: CachedPartList, visible: boolean, invis?: number) {
    let cache = groupVisibilityCache.get(villagerModel);
    if (!cache) {
        cache = {};
        groupVisibilityCache.set(villagerModel, cache);
    }
    const current = cache[group];
    if (!current || current.visible !== visible || current.invis !== invis) {
        parts.forEach((child) => toggleTransparency(child, visible, invis));
        cache[group] = { visible, invis: invis !== undefined ? invis : 1 };
    }
}

// change village model state
function updateVillagerState(villagerModel: VillagerModel, newState: VillagerProgressState) {
    if (!villageModelStates.has(villagerModel) || !deepEquals(villageModelStates.get(villagerModel)!, newState)) {
        const parts = cacheVillagerParts(villagerModel);

        parts.inProgress.forEach((cache) => applyGroupVisibility(villagerModel, `inProgress_${cache.phase}`, cache.parts, false));
        applyGroupVisibility(villagerModel, "progressFull", parts.progressFull, false);
        applyGroupVisibility(villagerModel, "stationParts", parts.stationParts, false);
        applyGroupVisibility(villagerModel, "npc", parts.npc, false);
        applyGroupVisibility(villagerModel, "accessories", parts.accessories, false);

        // if maxed then
        if (newState.isBeingBuilt) {
            applyGroupVisibility(villagerModel, "progressFull", parts.progressFull, false, .5);
            applyGroupVisibility(villagerModel, "stationParts", parts.stationParts, false, .5);
            applyGroupVisibility(villagerModel, "resourcesGroup", parts.resourcesGroup, false, .5);

        } else {
            applyGroupVisibility(villagerModel, "npc", parts.npc, true);
            applyGroupVisibility(villagerModel, "accessories", parts.accessories, true);
            applyGroupVisibility(villagerModel, "stationParts", parts.stationParts, true);

            if (newState.hasMaxedResources) {
                applyGroupVisibility(villagerModel, "progressFull", parts.progressFull, true);
                applyGroupVisibility(villagerModel, "resourcesGroup", parts.resourcesGroup, true);
            } else {
                // toggles the in progress parts
                parts.inProgress.forEach(({ phase, parts: phaseParts }) => {
                    const visible = phase <= newState.currentInProgressPhase;
                    applyGroupVisibility(villagerModel, `inProgress_${phase}`, phaseParts, visible);
                });
            }

            // toggles the station parts
            parts.resourceModels.forEach(({ parts: resParts, model: resourceModel }) => {
                const groupName = `resource_${resourceModel.Name}`;
                const modelIndex = (tonumber(resourceModel.Name) || 0) - 1; // Assuming model names are numeric strings
                const resourcePartParticles = resourceModel.FindFirstChild<Part>("__ResourceParticles__");
                const variant = newState.resources[modelIndex];

                resourceModel.SetAttribute("Ready", variant ? true : false);
                resourceModel.SetAttribute("ProduceName", newState.produce);
                resourceModel.SetAttribute("Variant", variant);
                if (resourcePartParticles) particlesToggle(resourcePartParticles, false);
                if (modelIndex > -1 && resourcePartParticles && variant) {
                    const particleAttachment = resourcePartParticles.FindFirstChild<ParticleEmitter>(variant);
                    if (particleAttachment) particlesToggle(particleAttachment, variant === "Gold" || variant === "Rainbow");
                    applyGroupVisibility(villagerModel, groupName, resParts, true);
                } else {
                    applyGroupVisibility(villagerModel, groupName, resParts, false);
                }
            })
        }



        // where the transparancey changes
        villageModelStates.set(villagerModel, newState);
    }
}



export default (world: World) => {
    const camera = Workspace.Camera;
    const delta = systemQueue.getDeltaTime()
    // when villager is added but not fully built then
    for (const [_, { villagerModel }] of world.query(Added(Villager))) Promise.try(() => {
        villagerModel.Destroying.Connect(() => {
            villageModelStates.delete(villagerModel);
            villagerPartCaches.delete(villagerModel);
            groupVisibilityCache.delete(villagerModel);
        })

        // loops through all the resource models and add their attachments
        villagerModel.Station.Parts.Resources.GetChildren<Model>().forEach((model) => {
            const resourcePartParticles = model.FindFirstChild<Part>("__ResourceParticles__") || new Instance("Part")
            const goldAttachment = paths.Assets.Particles.Gold.Clone()
            const rainbowAttachment = paths.Assets.Particles.Rainbow.Clone()

            // sets up the part
            resourcePartParticles.Name = "__ResourceParticles__"
            resourcePartParticles.Size = Vector3.zero
            resourcePartParticles.CFrame = model.GetPivot();
            resourcePartParticles.Anchored = true;
            resourcePartParticles.CanCollide = false;
            resourcePartParticles.Transparency = 1;
            resourcePartParticles.CanQuery = false;
            resourcePartParticles.Parent = model;

            // set up particles
            goldAttachment.Parent = resourcePartParticles;
            rainbowAttachment.Parent = resourcePartParticles;
            goldAttachment.Position = Vector3.zero;
            rainbowAttachment.Position = Vector3.zero;
            particlesToggle(goldAttachment, false);
            particlesToggle(rainbowAttachment, false);
        })
        cacheVillagerParts(villagerModel);
    }).catch((err) => warnJecs($line, "Villager", "Error setting up villager model particles", err));

    // when vilalger animator gets added
    for (const [_, villagerEntity, animator] of world.query(TargetEntity, Added(VillagerAnimator))) Promise.try(() => {
        const villagerComp = world.get(villagerEntity, Villager);

        // if the villager component exists then
        if (villagerComp) {
            const { villagerData, villagerModel } = villagerComp;
            const villagerAnimationFolder = paths.Assets.Animations.Villager.FindFirstChild(villagerData.Name)
            const productionAnimation = villagerAnimationFolder?.FindFirstChild<Animation>("Production")
            const productionTrack = productionAnimation && getAnimation(animator, productionAnimation)
            const sleepTrack = getAnimation(animator, paths.Assets.Animations.Villager.Sleep)

            // plays the idle animation
            if (productionTrack && sleepTrack) {
                productionTrack.GetMarkerReachedSignal("impact").Connect(() => particlesEmit(villagerModel.Station.Particles))
            }
        }
    }).catch((err) => warnJecs($line, "Villager", "Error setting up villager animator", err));

    // loops through all villagers without cooldown
    for (const [villagerEntity] of world.query(Villager).without(VillagerCooldown)) addComponent(villagerEntity as Entity, VillagerCooldown, .1);

    // loops through all villagers with cooldown and counts down the count down and remove it when it reaches 0
    for (const [villagerEntity, cooldown] of world.query(VillagerCooldown)) {
        if (cooldown > 0) {
            addComponent(villagerEntity as Entity, VillagerCooldown, cooldown - delta);
        } else {
            removeComponent(villagerEntity as Entity, VillagerCooldown);
        }
    }


    // watches for changes
    for (const [villagerClientEntity, villagerInfo, animator] of world.query(Villager, VillagerAnimator).with(CanQuery(Villager)).without(VillagerCooldown)) Promise.try(() => {
        const villagerEntity = world.get(villagerClientEntity, ReplicatedComponent);
        const { villagerData, villagerModel } = villagerInfo;
        const villagerAnimationFolder = paths.Assets.Animations.Villager.FindFirstChild(villagerData.Name)
        const sleepTrack = getAnimation(animator, paths.Assets.Animations.Villager.Sleep)
        const productionAnimation = villagerAnimationFolder?.FindFirstChild<Animation>("Production")
        const productionTrack = productionAnimation && getAnimation(animator, productionAnimation)

        // if the villager is not being built and the camera is too far away then
        // if the villager is not being built and the camera is too far away then
        if ((camera.CFrame.Position.sub(villagerModel.GetPivot().Position)).Magnitude > 200) {
            sleepTrack?.Stop(.1);
            productionTrack?.Stop(.1);
            return
        };
        // const oldChange = changedVillager.old
        // const newChange = changedVillager.new
        // const villagerInfo = newChange || oldChange;

        // if one of the changes
        if (villagerEntity) {
            const progress = villagerData.Progress
            const progression = progress.Progression
            const buildingTimes = progress.Building
            const isBeingBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) > os.time();
            const resources = progression.Resources
            const totalResourcesSoFar = resources.size()
            const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();
            const hasMaxedResources = totalResourcesSoFar >= maxResources;
            const maxInProgressPhases = villagerModel.Station.Parts.InProgress.GetChildren().size();
            const totalTimeSinceLastResource = os.time() - progression.Time.StartTime;
            const requiredTimePerResource = progression.Time.RequiredTimePerResource
            const inProgressPercentile = totalTimeSinceLastResource / requiredTimePerResource
            const currentInProgressPhase = math.floor(math.max(1, maxInProgressPhases * inProgressPercentile));
            const requiredResource = progress.Required
            const forceSleep = (maxResources === totalResourcesSoFar) || (requiredResource && requiredResource.Amount < 1);



            // plays the idle animation
            if (productionTrack && sleepTrack) {
                productionTrack.Looped = true;
                sleepTrack.Looped = true;

                // plays the idle animation
                if (isBeingBuilt) {
                    sleepTrack.Stop(.1);
                    productionTrack.Stop(.1);
                } else if (forceSleep) {
                    if (!sleepTrack.IsPlaying) {
                        sleepTrack.Play(.1);
                        productionTrack.Stop(.1);
                    }
                } else {
                    if (!productionTrack.IsPlaying) {
                        productionTrack.Play(.1);
                        sleepTrack.Stop(.1);
                    }
                }
            }


            updateVillagerState(villagerModel, {
                isBeingBuilt,
                hasMaxedResources,
                currentInProgressPhase: hasMaxedResources ? 1 : currentInProgressPhase,
                resources: progression.Resources,
                produce: villagerData.Progress.Produce
            })
        }
    }).catch((err) => warnTS($line, "Villager", "Error updating villager state", err));

}