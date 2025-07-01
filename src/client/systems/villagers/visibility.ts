import { World } from "@rbxts/jecs";
import { MarketplaceService, Players, Workspace } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { useEvent, useThrottle } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { getAnimation } from "shared/systems/animator/loadAnimations";
import { addComponent, createEntity, getEntity, printJecs, printTS, removeComponent, warnJecs } from "shared/utils/functions/jecsHelpFunctions";
import { particlesEmit, particlesToggle } from "shared/utils/functions/particlesFunctions";
import { ActiveVillagers, Added, Body, Changed, Data, MaxedOut, ModelDebugger, Player, ProduceAll, ReplicatedComponent, TakeFromVillager, TargetEntity, Villager, VillagerAnimator } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";




// function to togggle transparency
const toggleTransparency = (_instance: Instance, visible: boolean, customInvis: number = 1) => {
    const instance: BasePart | Decal = _instance as BasePart | Decal;

    // if the instance is a BasePart or Decal then
    if (instance.IsA("BasePart") || instance.IsA("Decal")) {
        const trueTransparency = instance.GetAttribute<number>("Transparency") ?? instance.Transparency;

        // set up
        instance.SetAttribute("Transparency", trueTransparency);
        instance.Transparency = visible ? trueTransparency : customInvis;
        if (instance.IsA("BasePart")) instance.CollisionGroup = visible ? "Default" : "NoCollision";
    }
}




export default (world: World) => Promise.try(() => {
    // when villager is added but not fully built then
    for (const [_, { villagerModel }] of world.query(Added(Villager))) {
        // everything in resources should already be hidden
        villagerModel.Station.Parts.Resources.GetDescendants().forEach((child) => toggleTransparency(child, false))
        villagerModel.Station.Parts.InProgress.GetDescendants().forEach((child) => toggleTransparency(child, false))
        villagerModel.Station.Parts.ProgressFull.GetDescendants().forEach((child) => toggleTransparency(child, false))

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
    }

    // when vilalger animator gets added
    for (const [_, villagerEntity, animator] of world.query(TargetEntity, Added(VillagerAnimator))) {
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
                productionTrack.GetMarkerReachedSignal("impact").Connect(() => particlesEmit(villagerModel))
            }
        }
    }


    if (useThrottle(.2)) {
        // controls the animations
        for (const [_, { villagerData, villagerModel }, animator] of world.query(Villager, VillagerAnimator)) {
            const villagerAnimationFolder = paths.Assets.Animations.Villager.FindFirstChild(villagerData.Name)
            const productionAnimation = villagerAnimationFolder?.FindFirstChild<Animation>("Production")
            const productionTrack = productionAnimation && getAnimation(animator, productionAnimation)
            const sleepTrack = getAnimation(animator, paths.Assets.Animations.Villager.Sleep)
            const progress = villagerData.Progress
            const progression = progress.Progression
            const buildingTimes = progress.Building
            const isBeingBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) > os.time();
            const requiredResource = progress.Required
            const resources = progression.Resources
            const totalResourcesSoFar = resources.size()
            const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();
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
        }

        // watches for changes
        for (const [villagerClientEntity, villagerInfo] of world.query(Villager)) {
            const villagerEntity = world.get(villagerClientEntity, ReplicatedComponent);
            // const oldChange = changedVillager.old
            // const newChange = changedVillager.new
            // const villagerInfo = newChange || oldChange;

            // if one of the changes
            if (villagerInfo && villagerEntity) {
                const { villagerData, villagerModel, playerEntity } = villagerInfo;
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
                const currentInProgressPhase = math.max(1, maxInProgressPhases * inProgressPercentile);

                // toggles that villagers visibility on if them have been built
                if (!isBeingBuilt) {
                    // starts off hidden
                    villagerModel.Station.Parts.ProgressFull.GetDescendants().forEach((child) => toggleTransparency(child, false));
                    villagerModel.Station.Parts.InProgress.GetDescendants().forEach((child) => toggleTransparency(child, false));
                    villagerModel.Station.Parts.Resources.GetDescendants().forEach((child) => toggleTransparency(child, false));
                    villagerModel.Station.Parts.StationParts.GetDescendants().forEach((child) => toggleTransparency(child, true));
                    villagerModel.Npc.GetDescendants().forEach((child) => toggleTransparency(child, true));
                    villagerModel.Accessories.GetDescendants().forEach((child) => toggleTransparency(child, true));

                    // loops through the resource array
                    villagerModel.Station.Parts.Resources.GetChildren<Model>().forEach((resourceModel) => {
                        const modelIndex = (tonumber(resourceModel.Name) || 0) - 1;
                        const resourcePartParticles = resourceModel.FindFirstChild<Part>("__ResourceParticles__")
                        const variant = resources[modelIndex]

                        resourceModel.SetAttribute("Ready", variant ? true : false);
                        resourceModel.SetAttribute("ProduceName", villagerData.Progress.Produce);
                        resourceModel.SetAttribute("Variant", variant);
                        if (resourcePartParticles) particlesToggle(resourcePartParticles, false);

                        if (modelIndex > -1 && resourcePartParticles && variant) {
                            const particleAttachment = resourcePartParticles.FindFirstChild<ParticleEmitter>(variant);

                            // if the resource particles data exists then
                            resourceModel.GetDescendants().forEach((child) => toggleTransparency(child, true))

                            // toggles the particles
                            if (particleAttachment) particlesToggle(particleAttachment, variant === "Gold" || variant === "Rainbow");
                        }
                    })

                    // if has maxed resources then
                    if (hasMaxedResources) {
                        // hides them
                        villagerModel.Station.Parts.ProgressFull.GetDescendants().forEach((child) => toggleTransparency(child, true));
                    } else {
                        // shows in progress
                        villagerModel.Station.Parts.InProgress.GetChildren().forEach((child) => {
                            child.GetDescendants().forEach((descendant) => {
                                toggleTransparency(descendant, (tonumber(child.Name) || 1) <= currentInProgressPhase);
                            })
                        });
                    }
                } else {
                    // hides the work station
                    villagerModel.Station.Parts.ProgressFull.GetDescendants().forEach((child) => toggleTransparency(child, false));
                    villagerModel.Station.Parts.InProgress.GetDescendants().forEach((child) => toggleTransparency(child, false));
                    villagerModel.Station.Parts.Resources.GetDescendants().forEach((child) => toggleTransparency(child, false));
                    villagerModel.Station.Parts.StationParts.GetDescendants().forEach((child) => toggleTransparency(child, false, .5))

                    // hides the body parts
                    villagerModel.Npc.GetDescendants().forEach((child) => toggleTransparency(child, false))

                    // hides accessories too
                    villagerModel.Accessories.GetDescendants().forEach((child) => toggleTransparency(child, false))
                }
            }
        }
    }
}).catch((err) => { warnJecs($line, "Villager Visibility System Error", err) });