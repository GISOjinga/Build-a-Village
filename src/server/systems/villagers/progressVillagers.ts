import { World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { useEvent, useThrottle } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { getAnimation } from "shared/systems/animator/loadAnimations";
import { addComponent, createEntity, getEntity, printJecs, printTS, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import { particlesEmit, particlesToggle } from "shared/utils/functions/particlesFunctions";
import { ActiveVillagers, Added, Body, Data, MaxedOut, ModelDebugger, Player, ProduceAll, TakeFromVillager, TargetEntity, Villager, VillagerAnimator } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";
import ShopData from "./ShopData";
import villagersProgressData from "shared/data/villagersProgressData";
import { routes } from "shared/data/network";
import { logTutorialStep, TutorialStep } from "../../utils/analytics";



// function to give random variant
const randomVariant = () => {
    return math.random(1, 200) <= 1 ? "Rainbow" : math.random(1, 20) <= 1 ? "Gold" : "Normal"
}



export default (world: World) => {
    // handle client requests
    useRoute(routes.collectVillagerProduce, ({ villagerEntity, resourceModelName }, playerWhoTriggered) => {
        const playerEntityWhoTriggered = getEntity.fromInstance(playerWhoTriggered);
        const villagerInfo = world.contains(villagerEntity) && world.get(villagerEntity, Villager);
        const model = villagerInfo ? villagerInfo.villagerModel.Station.Parts.Resources.FindFirstChild(resourceModelName) : undefined;
        const resourceIndex = ((model && tonumber(resourceModelName)) || 0) - 1;
        // const resourceProximityPrompt = model?.FindFirstChild("ProximityPromptPart")?.FindFirstChild<ProximityPrompt>("ResourcesPrompt");

        if (model && villagerInfo && playerEntityWhoTriggered && resourceIndex > -1) {
            const player = world.get(villagerInfo.playerEntity, Player);
            const variant = villagerInfo.villagerData.Progress.Progression.Resources[resourceIndex];

            if (variant) {
                if (playerWhoTriggered === player) {
                    villagerInfo.villagerData.Progress.Progression.Resources.remove(resourceIndex);
                    addComponent(villagerEntity, Villager, { ...villagerInfo });

                    createEntity.insertProduce(playerEntityWhoTriggered, villagerInfo.villagerData.Progress.Produce, variant);
                    createEntity.updateData(playerEntityWhoTriggered, (oldData) => {
                        if (villagerInfo.villagerData.Name === "Farmer" && oldData.Tutorial === 2) {
                            oldData.Tutorial = 3;
                            logTutorialStep(playerWhoTriggered, TutorialStep.WheatCollected, "tutorial_wheat_collected")
                        }
                        return oldData;
                    });
                    removeComponent(villagerEntity, MaxedOut);
                } else {
                    printTS($line, `Player ${playerWhoTriggered.Name} tried to take villager resource but was not the owner of the villager`);
                    addComponent(playerEntityWhoTriggered, TakeFromVillager, { villagerEntityToStealFrom: villagerEntity, resourceModelName: model.Name, produceName: villagerInfo.villagerData.Progress.Produce, variant });
                    MarketplaceService.PromptProductPurchase(playerWhoTriggered, 3315996934);
                }
            }
        }
    });

    useRoute(routes.supplyVillager, (villagerEntity, playerWhoTriggered) => {
        const playerEntityWhoTriggered = getEntity.fromInstance(playerWhoTriggered);
        const villagerInfo = world.contains(villagerEntity) && world.get(villagerEntity, Villager);
        if (villagerInfo && playerEntityWhoTriggered === villagerInfo.playerEntity) {
            const body = world.get(playerEntityWhoTriggered, Body);
            const requiredResource = villagerInfo.villagerData.Progress.Required;
            const villagerModel = villagerInfo.villagerModel;
            if (body && requiredResource && requiredResource.Amount < requiredResource.Max) {
                const toolInHand = body.model.FindFirstChildOfClass("Tool");
                const toolType = toolInHand && toolInHand.GetAttribute<ToolType>("ItemType");
                const toolName = toolInHand && toolInHand.GetAttribute<ItemName>("ItemName");
                const amountNeededToBeMaxedOut = requiredResource.Max - requiredResource.Amount;
                if (toolType === "Commodity" && toolName === requiredResource.Produce) {
                    createEntity.updateData(playerEntityWhoTriggered, (oldData) => {
                        const produceIndex = oldData.Produce.findIndex((produce) => produce.Name === requiredResource.Produce);
                        const produce = oldData.Produce[produceIndex];
                        const amountToTakeAway = math.min(produce.Amount, amountNeededToBeMaxedOut);
                        produce.Amount -= amountToTakeAway;
                        addComponent(villagerEntity, Villager, {
                            villagerData: {
                                ...villagerInfo.villagerData,
                                Progress: {
                                    ...villagerInfo.villagerData.Progress,
                                    Required: {
                                        ...requiredResource,
                                        Amount: requiredResource.Amount + amountToTakeAway,
                                    },
                                },
                            },
                            villagerModel,
                            playerEntity: villagerInfo.playerEntity,
                        });
                        if (produce.Amount <= 0) oldData.Produce.remove(produceIndex);
                        return oldData;
                    });
                }
            }
        }
    });

    // when villager is added but not fully built then
    for (const [_, villagerEntity, { villagerData, villagerModel, playerEntity }] of world.query(TargetEntity, Added(Villager))) {
        const player = world.get(playerEntity, Player)
        const body = world.get(playerEntity, Body);
        const buildingTimes = villagerData.Progress.Building
        const timeTillFullyBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) - os.time();
        const hitBox = new Instance("Part")
        const tier2ProximityPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
        const requiredResource = villagerData.Progress.Required
        const produceName = villagerData.Progress.Produce

        // set up part
        hitBox.Transparency = 1;
        hitBox.Anchored = true;
        hitBox.CanCollide = false
        hitBox.CanQuery = true;
        hitBox.Size = villagerModel.GetExtentsSize();
        hitBox.CFrame = villagerModel.GetPivot();
        hitBox.Name = "HitBox";
        hitBox.Parent = villagerModel; // remember to make it so that progressing resources only takes up the spot of a avliable resoource

        // for each resource that can be picked up adds a proximity prompt to it
        villagerModel.Station.Parts.Resources.GetChildren<Model>().forEach((model) => {
            const proximityPromptyPart = new Instance("Part", model)
            // const resourceProximityPrompt = paths.Assets.ProximityPrompts.ResourcesPrompt.Clone()

            // sets up the proximity prompt
            proximityPromptyPart.Name = "ProximityPromptPart"
            proximityPromptyPart.Anchored = true
            proximityPromptyPart.CanQuery = true
            proximityPromptyPart.Transparency = 1
            proximityPromptyPart.CanCollide = false
            proximityPromptyPart.Size = Vector3.zero
            proximityPromptyPart.PivotTo(model.GetPivot())
            // resourceProximityPrompt.ActionText = `Collect`
            // resourceProximityPrompt.Parent = proximityPromptyPart
        })

        // adds model debugger
        addComponent(villagerEntity, ModelDebugger, villagerModel)
    }


    // use event to watch for stealing
    for (const [userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        const player = Players.GetPlayerByUserId(userId) as Player
        const playerEntity = player && getEntity.fromInstance(player);
        const takeFromVillager = playerEntity && world.get(playerEntity, TakeFromVillager);
        const villagerEntity = takeFromVillager && takeFromVillager.villagerEntityToStealFrom
        const villagerInfo = villagerEntity && world.get(villagerEntity, Villager);
        const model = villagerInfo && villagerInfo.villagerModel.Station.Parts.Resources.FindFirstChild(takeFromVillager.resourceModelName);
        const resourceIndex = ((model && tonumber(takeFromVillager.resourceModelName)) || 0) - 1

        // makes sure its from the villagers page
        if (productId === 3315996934) {
            // if the purchase was successful and the player exists
            if (wasPurchased && player && playerEntity && takeFromVillager && villagerInfo && model && resourceIndex > -1) {
                // const proximityPromptPart = model.FindFirstChild("ProximityPromptPart")
                // const resourceProximityPrompt = proximityPromptPart?.FindFirstChild<ProximityPrompt>("ResourcesPrompt");
                const progression = villagerInfo.villagerData.Progress.Progression
                const variant = takeFromVillager.variant
                const produceName = takeFromVillager.produceName;

                // removes the produce from the data
                progression.Resources.remove(resourceIndex);
                addComponent(villagerEntity, Villager, { ...villagerInfo })

                // adds the produce to the data
                printJecs($line, `${player.Name} took ${takeFromVillager.produceName} with varaint ${variant} from villager ${villagerEntity}`)
                createEntity.insertProduce(playerEntity, produceName, variant)
                removeComponent(villagerEntity, MaxedOut);

                // reduces the item by 1 
                routes.playSound.sendTo({ sound: paths.SFX.UI.purchasepass, position: undefined }, player);
            } else if (!wasPurchased && playerEntity) { // makes sure to still remove the gift to
                removeComponent(playerEntity, TakeFromVillager);
                routes.playSound.sendTo({ sound: paths.SFX.UI.purchasefail, position: undefined }, player);
            }
        }
    }

    // takes the villager through its transitions
    if (useThrottle(.1)) {
        for (const [villagerEntity, villagerComp, animator] of world.query(Villager, VillagerAnimator).without(MaxedOut)) {
            const playerData = world.get(villagerComp.playerEntity, Data);
            const { villagerData, villagerModel } = villagerComp;
            const requiredResource = villagerData.Progress.Required
            const buildingTimes = villagerData.Progress.Building
            const timeTillFullyBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) - os.time();
            const resources = villagerData.Progress.Progression.Resources
            const progression = villagerData.Progress.Progression
            const totalResourcesSoFar = resources.size()
            const requiredProximityPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
            const villagerAnimationFolder = paths.Assets.Animations.Villager.FindFirstChild(villagerData.Name)
            const productionAnimation = villagerAnimationFolder?.FindFirstChild<Animation>("Production")

            // toggles the interaction visiblity
            requiredProximityPrompt.ActionText = (requiredResource && requiredResource.Amount < requiredResource.Max) ? `Requires ${requiredResource.Produce}` : "";
            // requiredProximityPrompt.Enabled = requiredResource ? requiredResource.Amount < requiredResource.Max : false;

            // if fully built then start progressing the foods
            if (timeTillFullyBuilt < 0) {
                const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();
                const hasMaxedResources = totalResourcesSoFar >= maxResources;
                const totalTimeSinceLastResource = os.time() - progression.Time.StartTime;
                const requiredTimePerResource = progression.Time.RequiredTimePerResource
                const hasMetRequiredTime = totalTimeSinceLastResource >= requiredTimePerResource && (!requiredResource || requiredResource.Amount > 0);

                progression.Time.RequiredTimePerResource = (playerData?.Tutorial === 2 && villagerData.Name === "Farmer") ? 5 : villagersProgressData.get(villagerData.Name)?.Progression.Time.RequiredTimePerResource || 0

                // if has maxed resources then
                if (hasMaxedResources) {
                    addComponent(villagerEntity, MaxedOut);
                } else {

                    // if has met required time then
                    if (hasMetRequiredTime) {

                        // takes the resource spot
                        progression.Resources.push(randomVariant());

                        // takes away from required
                        if (requiredResource) requiredResource.Amount -= 1

                        // updates the start time
                        progression.Time.StartTime = os.time() + math.max((totalTimeSinceLastResource - requiredTimePerResource), 0);
                    } else if (requiredResource && requiredResource.Amount <= 0) {
                        // if has not met required time and has no resources then
                        progression.Time.StartTime = os.time(); // resets the start time
                    }
                }
            } else {
                progression.Time.StartTime = os.time(); // resets the start time
            }

            // updates the component
            addComponent(villagerEntity, Villager, villagerComp);
        }
    }


    // if a player has a produce all component then take their villagers and set their resources amount to the max
    for (const [villagerEntity, villagerComp] of world.query(Villager, ProduceAll).without(MaxedOut)) {
        const { villagerData, villagerModel } = villagerComp;
        const buildingTimes = villagerData.Progress.Building
        const progression = villagerData.Progress.Progression
        const totalResources = villagerData.Progress.Progression.Resources.size()
        const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();

        // sets to fully built
        buildingTimes.TotalTime = 0

        // loops through all resources and sets it to the max
        for (let i = 0; i < (maxResources - totalResources); i++) {
            progression.Resources.push(randomVariant());
        }

        // removes its self
        addComponent(villagerEntity, Villager, villagerComp);
        removeComponent(villagerEntity, ProduceAll);
    }

    // for the villagers with maxed out sets their progression start time to os.time
    for (const [villagerEntity, villagerComp] of world.query(Villager, MaxedOut)) {
        const { villagerData } = villagerComp;
        const progression = villagerData.Progress.Progression;

        // sets the start time to os.time
        progression.Time.StartTime = os.time();

        // updates the villager component
        addComponent(villagerEntity, Villager, villagerComp);
    }

    // when ever player has produce all
    for (const [playerEntity, villagers] of world.query(ActiveVillagers, ProduceAll)) {
        villagers.forEach(({ entity }) => {
            // if villager entity exists then
            if (world.contains(entity)) {
                // adds produce all to villager
                addComponent(entity, ProduceAll);
            }
        })

        // removes produce all from player
        removeComponent(playerEntity, ProduceAll);
    }
}