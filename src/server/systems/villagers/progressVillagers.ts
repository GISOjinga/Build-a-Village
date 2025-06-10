import { World } from "@rbxts/jecs";
import { useThrottle } from "shared/Plugin-Hook";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { Added, MaxedOut, ModelDebugger, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";






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
    for (const [_, villagerEntity, { villagerData, villagerModel }] of world.query(TargetEntity, Added(Villager))) {
        const buildingTimes = villagerData.Progress.Building
        const timeTillFullyBuilt = buildingTimes.EndTime - os.time();
        const hitBox = new Instance("Part")

        // set up part
        hitBox.Transparency = 1;
        hitBox.Anchored = true;
        hitBox.CanCollide = false
        hitBox.Size = villagerModel.GetExtentsSize();
        hitBox.CFrame = villagerModel.GetPivot();
        hitBox.Name = "HitBox";
        hitBox.Parent = villagerModel;

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
    if (useThrottle(.25)) {
        for (const [villagerEntity, { villagerData, villagerModel }] of world.query(Villager).without(MaxedOut)) {
            const buildingTimes = villagerData.Progress.Building
            const timeTillFullyBuilt = buildingTimes.EndTime - os.time();

            // if fully built then start progressing the foods
            if (timeTillFullyBuilt < 0) {
                const progression = villagerData.Progress.Progression
                const maxResources = villagerModel.Station.Parts.Resources.GetChildren().size();
                const maxInProgressPhases = villagerModel.Station.Parts.InProgress.GetChildren().size();
                const hasMaxedResources = progression.Resources.Amount >= maxResources;
                const totalTimeSinceLastResource = os.time() - progression.Time.StartTime;
                const inProgressPercentile = totalTimeSinceLastResource / progression.Time.RequiredTimePerResource
                const hasMetRequiredTime = totalTimeSinceLastResource >= progression.Time.RequiredTimePerResource;
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

                        // updates the start time
                        progression.Time.StartTime = os.time();
                    }
                }

                // if has maxed resources then
                villagerModel.Station.Parts.Resources.GetChildren().forEach((child) => {
                    // if resourceAmount and is less than or equal to current resources then show it
                    child.GetDescendants().forEach((descendant) => {
                        toggleTransparency(descendant, (tonumber(child.Name) || 1) <= progression.Resources.Amount);
                    })
                })
            }
        }
    }
}