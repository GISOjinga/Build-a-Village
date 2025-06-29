import { World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { useEvent, useThrottle } from "shared/Plugin-Hook";
import { getAnimation } from "shared/systems/animator/loadAnimations";
import { addComponent, createEntity, getEntity, printJecs, printTS, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import { particlesEmit, particlesToggle } from "shared/utils/functions/particlesFunctions";
import { ActiveVillagers, Added, Body, MaxedOut, ModelDebugger, Player, ProduceAll, TakeFromVillager, TargetEntity, Villager, VillagerAnimator } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";
import ShopData from "./ShopData";
import villagersProgressData from "shared/data/villagersProgressData";
import { routes } from "shared/data/network";






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


// function to take resource spot
const takeResourceSpot = (villagerModel: VillagerModel, variant: ProduceVariant) => {
    // loops through all the avliable resources and finds the one that is not ready and takes it
    for (const [_, model] of pairs(villagerModel.Station.Parts.Resources.GetChildren())) {
        const villagerInfo = villagersProgressData.get(villagerModel.Name as VillagerNames);

        // if the model has a variant and is not ready then
        if (!model.GetAttribute<boolean>("Ready") && villagerInfo) {
            const variantParticles = paths.Assets.Particles.FindFirstChild(variant)?.Clone()
            const proximityPromptPart = model.FindFirstChild("ProximityPromptPart")
            const resourceProximityPrompt = proximityPromptPart?.FindFirstChild<ProximityPrompt>("ResourcesPrompt");

            // toggles the transparency
            model.GetDescendants().forEach((child) => {
                if (child.IsA("Attachment") && (child.Name === "Gold" || child.Name === "Rainbow")) {
                    child.Destroy();
                } else {
                    toggleTransparency(child, true)
                }
            });

            // sets the variant and ready
            model.SetAttribute("Variant", variant);
            model.SetAttribute("ProduceName", villagerInfo.Produce);
            model.SetAttribute("Ready", true);
            if (resourceProximityPrompt) resourceProximityPrompt.Enabled = true

            // if variant partielces then places it in
            if (proximityPromptPart && variantParticles) {
                variantParticles.Parent = proximityPromptPart
                particlesToggle(variantParticles, true)
            };
            break;
        }
    }
}


export default (world: World) => {
    // when villager is added but not fully built then
    for (const [_, villagerEntity, { villagerData, villagerModel, playerEntity }] of world.query(TargetEntity, Added(Villager))) {
        const player = world.get(playerEntity, Player)
        const body = world.get(playerEntity, Body);
        const buildingTimes = villagerData.Progress.Building
        const timeTillFullyBuilt = buildingTimes.EndTime - os.time();
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
            const resourceProximityPrompt = paths.Assets.ProximityPrompts.ResourcesPrompt.Clone()

            // sets up the proximity prompt
            proximityPromptyPart.Name = "ProximityPromptPart"
            proximityPromptyPart.Anchored = true
            proximityPromptyPart.CanQuery = true
            proximityPromptyPart.Transparency = 1
            proximityPromptyPart.CanCollide = false
            proximityPromptyPart.Size = Vector3.zero
            proximityPromptyPart.PivotTo(model.GetPivot())
            resourceProximityPrompt.ActionText = `Collect`
            resourceProximityPrompt.Parent = proximityPromptyPart
            resourceProximityPrompt.Enabled = false
            resourceProximityPrompt.Triggered.Connect((playerWhoTriggered) => {
                const variant = model.GetAttribute<ProduceVariant>("Variant")
                const readyToBePicked = model.GetAttribute<boolean>("Ready")
                const playerEntityWhoTriggered = getEntity.fromInstance(playerWhoTriggered)
                const villagerInfo = world.get(villagerEntity, Villager)


                // if both resource variant and ready then adds the collected item into the player who triggered it inventory and removes that variant
                if (variant && readyToBePicked && playerEntityWhoTriggered && villagerInfo) {
                    if (playerWhoTriggered === player) {
                        const progression = villagerInfo.villagerData.Progress.Progression

                        // removes the variant and ready
                        resourceProximityPrompt.Enabled = false
                        model.SetAttribute("Variant", undefined)
                        model.SetAttribute("Ready", undefined)
                        model.GetDescendants().forEach((child) => {
                            if (child.IsA("Attachment") && (child.Name === "Gold" || child.Name === "Rainbow")) {
                                child.Destroy();
                            } else {
                                toggleTransparency(child, false)
                            }
                        });

                        // removes the produce from the data
                        progression.Resources[variant] -= 1
                        addComponent(villagerEntity, Villager, { ...villagerInfo })

                        // adds the produce to the data
                        printJecs($line, `${playerWhoTriggered.Name} took ${produceName} with varaint ${variant} from ${playerEntity}`)
                        createEntity.insertProduce(playerEntityWhoTriggered, produceName, variant)
                        createEntity.updateData(playerEntityWhoTriggered, (oldData) => {
                            if (villagerInfo.villagerData.Name === "Farmer" && oldData.Tutorial === 2) oldData.Tutorial = 3
                            return oldData
                        })
                        removeComponent(villagerEntity, MaxedOut);
                    } else { // prompts product purchase to steal the produce
                        printTS($line, `Player ${playerWhoTriggered.Name} tried to take villager resource but was not the owner of the villager`)
                        // adds component to take produce from player
                        addComponent(playerEntityWhoTriggered, TakeFromVillager, { villagerEntityToStealFrom: villagerEntity, resourceModelName: model.Name, produceName, variant, })
                        MarketplaceService.PromptProductPurchase(playerWhoTriggered, 3315996934)
                    }
                }
            })
        })

        // when proximity prompt is called
        tier2ProximityPrompt.Triggered.Connect((playerWhoTriggered) => {
            const villagerInfo = world.contains(villagerEntity) && world.get(villagerEntity, Villager)

            if (playerWhoTriggered === player && villagerInfo) {
                if (body && requiredResource && requiredResource.Amount < requiredResource.Max && tier2ProximityPrompt.ActionText === `Requires ${requiredResource.Produce}`) {
                    const toolInHand = body.model.FindFirstChildOfClass("Tool")
                    const toolType = toolInHand && toolInHand.GetAttribute<ToolType>("ItemType");
                    const toolName = toolInHand && toolInHand.GetAttribute<ItemName>("ItemName");
                    const amountNeededToBeMaxedOut = requiredResource.Max - requiredResource.Amount;

                    // if tool an
                    if (toolType === "Commodity" && toolName === requiredResource.Produce) {
                        // updates the players data
                        createEntity.updateData(playerEntity, (oldData) => {
                            const produceIndex = oldData.Produce.findIndex((produce) => produce.Name === requiredResource.Produce);
                            const produce = oldData.Produce[produceIndex];
                            const amountToTakeAway = math.min(produce.Amount, amountNeededToBeMaxedOut);

                            // takes away the produce from the player
                            produce.Amount -= amountToTakeAway;

                            // updates the villager
                            addComponent(villagerEntity, Villager, {
                                villagerData: {
                                    ...villagerInfo.villagerData,
                                    Progress: {
                                        ...villagerInfo.villagerData.Progress,
                                        Required: {
                                            ...requiredResource,
                                            Amount: requiredResource.Amount + amountToTakeAway
                                        }
                                    }
                                },
                                villagerModel,
                                playerEntity
                            })

                            // if its 0 then removes it
                            if (produce.Amount <= 0) oldData.Produce.remove(produceIndex);

                            return oldData
                        })
                    }
                }
            }
        })

        // adds model debugger
        addComponent(villagerEntity, ModelDebugger, villagerModel)

        // everything in resources should already be hidden
        villagerModel.Station.Parts.Resources.GetDescendants().forEach((child) => toggleTransparency(child, false))
        villagerModel.Station.Parts.InProgress.GetDescendants().forEach((child) => toggleTransparency(child, false))
        villagerModel.Station.Parts.ProgressFull.GetDescendants().forEach((child) => toggleTransparency(child, false))

        // if not fully built then
        if (timeTillFullyBuilt > 0) {
            // hides the work station
            villagerModel.Station.Parts.StationParts.GetDescendants().forEach((child) => toggleTransparency(child, false, .5))

            // hides the body parts
            villagerModel.Npc.GetDescendants().forEach((child) => toggleTransparency(child, false))

            // hides accessories too
            villagerModel.Accessories.GetDescendants().forEach((child) => toggleTransparency(child, false))

            // does a cool down wait and destroys the villager entity
            task.delay(timeTillFullyBuilt, () => {
                // destroys the entity
                if (world.contains(villagerEntity)) world.delete(villagerEntity);
            });
        }
    }

    // when villager gets added trys to load in all the resources
    for (const [_, villagerEntity, villagerComp] of world.query(TargetEntity, Added(Villager))) {
        const { villagerData, villagerModel } = villagerComp;
        const resources = villagerData.Progress.Progression.Resources;

        // adds the villager component back
        addComponent(villagerEntity, Villager, villagerComp);

        // loops through all the resources that you have
        for (const [variant, amount] of pairs(resources)) {
            // if the amount is greater than 0 then
            if (amount > 0) takeResourceSpot(villagerModel, variant);
        }
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


    // use event to watch for stealing
    for (const [userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        const player = Players.GetPlayerByUserId(userId) as Player
        const playerEntity = player && getEntity.fromInstance(player);
        const takeFromVillager = playerEntity && world.get(playerEntity, TakeFromVillager);
        const villagerEntity = takeFromVillager && takeFromVillager.villagerEntityToStealFrom
        const villagerInfo = villagerEntity && world.get(villagerEntity, Villager);
        const model = villagerInfo && villagerInfo.villagerModel.Station.Parts.Resources.FindFirstChild(takeFromVillager.resourceModelName);

        // makes sure its from the villagers page
        if (productId === 3315996934) {
            // if the purchase was successful and the player exists
            if (wasPurchased && player && playerEntity && takeFromVillager && villagerInfo && model) {
                const proximityPromptPart = model.FindFirstChild("ProximityPromptPart")
                const resourceProximityPrompt = proximityPromptPart?.FindFirstChild<ProximityPrompt>("ResourcesPrompt");
                const progression = villagerInfo.villagerData.Progress.Progression
                const variant = takeFromVillager.variant
                const produceName = takeFromVillager.produceName;

                // removes the variant and ready
                if (resourceProximityPrompt) resourceProximityPrompt.Enabled = false
                model.SetAttribute("Variant", undefined)
                model.SetAttribute("Ready", undefined)
                model.GetDescendants().forEach((child) => {
                    if (child.IsA("Attachment") && (child.Name === "Gold" || child.Name === "Rainbow")) {
                        child.Destroy();
                    } else {
                        toggleTransparency(child, false)
                    }
                });

                // removes the produce from the data
                progression.Resources[variant] -= 1
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
            const { villagerData, villagerModel } = villagerComp;
            const requiredResource = villagerData.Progress.Required
            const buildingTimes = villagerData.Progress.Building
            const timeTillFullyBuilt = buildingTimes.EndTime - os.time();
            const resources = villagerData.Progress.Progression.Resources
            const totalResourcesSoFar = resources.Gold + resources.Normal + resources.Rainbow;
            const requiredProximityPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
            const villagerAnimationFolder = paths.Assets.Animations.Villager.FindFirstChild(villagerData.Name)
            const productionAnimation = villagerAnimationFolder?.FindFirstChild<Animation>("Production")
            const productionTrack = productionAnimation && getAnimation(animator, productionAnimation)
            const sleepTrack = getAnimation(animator, paths.Assets.Animations.Villager.Sleep)

            // toggles the interaction visiblity
            requiredProximityPrompt.ActionText = (requiredResource && requiredResource.Amount < requiredResource.Max) ? `Requires ${requiredResource.Produce}` : "";
            requiredProximityPrompt.Enabled = requiredResource ? true : false;

            // if fully built then start progressing the foods
            if (timeTillFullyBuilt < 0) {
                const progression = villagerData.Progress.Progression
                const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();
                const maxInProgressPhases = villagerModel.Station.Parts.InProgress.GetChildren().size();
                const hasMaxedResources = totalResourcesSoFar >= maxResources;
                const totalTimeSinceLastResource = os.time() - progression.Time.StartTime;
                const inProgressPercentile = totalTimeSinceLastResource / progression.Time.RequiredTimePerResource
                const hasMetRequiredTime = totalTimeSinceLastResource >= progression.Time.RequiredTimePerResource && (!requiredResource || requiredResource.Amount > 0);
                const currentInProgressPhase = math.max(1, maxInProgressPhases * inProgressPercentile);


                if (productionTrack && sleepTrack) {
                    productionTrack.Looped = true
                    sleepTrack.Looped = true;

                    if (hasMaxedResources || (requiredResource && requiredResource.Amount <= 0)) {
                        if (!sleepTrack.IsPlaying) {
                            sleepTrack.Play(.1);
                            productionTrack.Stop(.1);
                        }
                    } else if (!hasMaxedResources && (!requiredResource || (requiredResource && requiredResource.Amount > 0))) {
                        if (!productionTrack.IsPlaying) {
                            productionTrack.Play(.1);
                            sleepTrack.Stop(.1);
                        }
                    }
                }

                // if has maxed resources then
                if (hasMaxedResources) {

                    // hides in progress
                    villagerModel.Station.Parts.InProgress.GetDescendants().forEach((child) => toggleTransparency(child, false));

                    // shows progress full
                    villagerModel.Station.Parts.ProgressFull.GetDescendants().forEach((child) => toggleTransparency(child, true));

                    // adds component maxed out
                    addComponent(villagerEntity, MaxedOut);
                } else {

                    // shows in progress
                    villagerModel.Station.Parts.InProgress.GetChildren().forEach((child) => {
                        child.GetDescendants().forEach((descendant) => {
                            toggleTransparency(descendant, (tonumber(child.Name) || 1) <= currentInProgressPhase);
                        })
                    });

                    // hides progress full
                    villagerModel.Station.Parts.ProgressFull.GetDescendants().forEach((child) => toggleTransparency(child, false));

                    // if has met required time then
                    if (hasMetRequiredTime) {
                        const variantToGive = math.random(1, 100) <= 1 ? "Rainbow" : math.random(1, 100) <= 5 ? "Gold" : "Normal";

                        // takes the resource spot
                        takeResourceSpot(villagerModel, variantToGive);
                        progression.Resources[variantToGive] += 1;

                        // takes away from required
                        if (requiredResource) requiredResource.Amount -= 1

                        // updates the start time
                        progression.Time.StartTime = os.time();
                    } else if (requiredResource && requiredResource.Amount <= 0) {
                        // if has not met required time and has no resources then
                        progression.Time.StartTime = os.time(); // resets the start time
                    }
                }

                // updates the component
                addComponent(villagerEntity, Villager, villagerComp);
            }
        }
    }


    // if a player has a produce all component then take their villagers and set their resources amount to the max
    for (const [villagerEntity, villagerComp] of world.query(Villager, ProduceAll).without(MaxedOut)) {
        const { villagerData, villagerModel } = villagerComp;
        const buildingTimes = villagerData.Progress.Building
        const progression = villagerData.Progress.Progression

        // sets to fully built
        buildingTimes.EndTime = os.time()

        // loops through all resources and sets it to the max
        villagerModel.Station.Parts.Resources.GetChildren().forEach((model) => {
            const variantToGive = math.random(1, 100) <= 1 ? "Rainbow" : math.random(1, 100) <= 5 ? "Gold" : "Normal"
            takeResourceSpot(villagerModel, variantToGive);
            progression.Resources[variantToGive] = 1;
        })

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