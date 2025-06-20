import { World } from "@rbxts/jecs";
import { $line } from "rbxts-transformer-inline";
import { useThrottle } from "shared/Plugin-Hook";
import { addComponent, createEntity, printJecs, printTS, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import { ActiveVillagers, Added, Body, MaxedOut, ModelDebugger, Player, ProduceAll, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";






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



export default (world: World) => {
    // when villager is added but not fully built then
    for (const [_, villagerEntity, { villagerData, villagerModel, playerEntity }] of world.query(TargetEntity, Added(Villager))) {
        const player = world.get(playerEntity, Player)
        const body = world.get(playerEntity, Body);
        const buildingTimes = villagerData.Progress.Building
        const timeTillFullyBuilt = buildingTimes.EndTime - os.time();
        const hitBox = new Instance("Part")
        const proximityPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
        const requiredResource = villagerData.Progress.Required

        // set up part
        hitBox.Transparency = 1;
        hitBox.Anchored = true;
        hitBox.CanCollide = false
        hitBox.Size = villagerModel.GetExtentsSize();
        hitBox.CFrame = villagerModel.GetPivot();
        hitBox.Name = "HitBox";
        hitBox.Parent = villagerModel;

        // when proximity prompt is called
        proximityPrompt.Triggered.Connect((playerWhoTriggered) => {
            const villagerData = world.contains(villagerEntity) && world.get(villagerEntity, Villager)

            if (playerWhoTriggered === player && villagerData) {
                if (proximityPrompt.ActionText === "Collect All") {
                    const totalResources = villagerData.villagerData.Progress.Progression.Resources.Amount || 0

                    // if villager has resources then updates the villlager data with the resources of 0 and gives the total away with inventoryProduce
                    if (totalResources > 0) {
                        printJecs($line, `Giving ${totalResources} ${villagerData.villagerData.Progress.Produce} to player ${player.Name}`)
                        // gives the produce to the player
                        createEntity.inventoryProduce(playerEntity, villagerData.villagerData.Progress.Produce, totalResources)

                        // sets the resources to 0
                        villagerData.villagerData.Progress.Progression.Resources.Amount = 0;

                        // updates the villager entity
                        addComponent(villagerEntity, Villager, villagerData);
                        removeComponent(villagerEntity, MaxedOut);
                    }
                } else if (body && requiredResource && requiredResource.Amount < requiredResource.Max && proximityPrompt.ActionText === `Requires ${requiredResource.Produce}`) {
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
                                    ...villagerData.villagerData,
                                    Progress: {
                                        ...villagerData.villagerData.Progress,
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

    // takes the villager through its transitions
    if (useThrottle(.1)) {
        for (const [villagerEntity, villagerComp] of world.query(Villager).without(MaxedOut)) {
            const { villagerData, villagerModel } = villagerComp;
            const requiredResource = villagerData.Progress.Required
            const buildingTimes = villagerData.Progress.Building
            const timeTillFullyBuilt = buildingTimes.EndTime - os.time();
            const totalResourcesSoFar = villagerData.Progress.Progression.Resources.Amount || 0;
            const proximityPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt

            // toggles the interaction visiblity
            proximityPrompt.ActionText = (totalResourcesSoFar > 0 || !requiredResource) ? "Collect All" : (requiredResource && requiredResource.Amount < requiredResource.Max) ? `Requires ${requiredResource.Produce}` : "Collect";
            proximityPrompt.Enabled = (totalResourcesSoFar > 0 || (requiredResource && requiredResource.Amount < requiredResource.Max)) ? true : false;

            // if fully built then start progressing the foods
            if (timeTillFullyBuilt < 0) {
                const progression = villagerData.Progress.Progression
                const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();
                const maxInProgressPhases = villagerModel.Station.Parts.InProgress.GetChildren().size();
                const hasMaxedResources = progression.Resources.Amount >= maxResources;
                const totalTimeSinceLastResource = os.time() - progression.Time.StartTime;
                const inProgressPercentile = totalTimeSinceLastResource / progression.Time.RequiredTimePerResource
                const hasMetRequiredTime = totalTimeSinceLastResource >= progression.Time.RequiredTimePerResource && (!requiredResource || requiredResource.Amount > 0);
                const currentInProgressPhase = math.max(1, maxInProgressPhases * inProgressPercentile);

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
                        // increments the resources
                        progression.Resources.Amount += 1;

                        // takes away from required
                        if (requiredResource) requiredResource.Amount -= 1

                        // updates the start time
                        progression.Time.StartTime = os.time();
                    } else if (requiredResource && requiredResource.Amount <= 0) {
                        // if has not met required time and has no resources then
                        progression.Time.StartTime = os.time(); // resets the start time
                    }
                }

                // if has maxed resources then
                villagerModel.Station.Parts.Resources.GetChildren().forEach((child) => {
                    // if resourceAmount and is less than or equal to current resources then show it
                    child.GetDescendants().forEach((descendant) => {
                        toggleTransparency(descendant, (tonumber(child.Name) || 1) <= progression.Resources.Amount);
                    })
                })

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
        const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();

        // sets to fully built
        buildingTimes.EndTime = os.time()

        // sets the max resources
        progression.Resources.Amount = maxResources;

        // removes its self
        addComponent(villagerEntity, Villager, villagerComp);
        removeComponent(villagerEntity, ProduceAll);
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