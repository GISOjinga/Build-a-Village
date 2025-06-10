import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { addComponent, createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { isVillagersOverlapping } from "shared/utils/functions/villagerFunctions";
import { ActiveVillagers, Body, Changed, Data, Player, Removed, TargetEntity, Villager, world } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";
import { deepCopy } from "@rbxts/object-utils";
import villagersProgressData from "shared/data/villagersProgressData";









export default (world: World) => {
    useRoute(routes.placeVillager, (location, player) => {
        const entity = getEntity.fromInstance(player);
        const body = getEntity.bodyFromPlayer(player);
        const tool = body && body.model.FindFirstChildOfClass("Tool");
        const itemType = tool?.GetAttribute("ItemType")
        const villagerName = tool?.GetAttribute("ItemName") as VillagerNames | undefined;
        const uniqueId = tool?.GetAttribute("UniqueId") as number | undefined;
        const villagerModel = villagerName && paths.Assets.Villagers.FindFirstChild<VillagerModel>(villagerName)
        const platform = body && body.platform;

        // if entity exists and tool exists then
        if (entity !== undefined && uniqueId !== undefined && villagerModel && platform && tool && villagerName && itemType === "Villager" && !isVillagersOverlapping(platform.Villagers.GetChildren(), villagerModel, location)) {

            // removes the tool and adds you to the plot of land
            createEntity.updateData(entity, (oldData) => {
                const indexOfVillager = oldData.Villagers.findIndex((v) => v.UniqueId === uniqueId);
                const villagerData = oldData.Villagers[indexOfVillager];

                // sets up the vilalger to be ready to load in
                villagerData.RelativeLocation = platform.Floor.CFrame.ToObjectSpace(location);
                villagerData.Progress = deepCopy(villagersProgressData.get(villagerName)!);
                villagerData.Progress.Progression.Time.StartTime = os.time();
                villagerData.Progress.Building.StartTime = os.time();
                villagerData.Progress.Building.EndTime = os.time() + 5;
                return oldData
            })
        }
    })

    // if player doesnt have ActiveVillagers then gives them one
    for (const [entity] of world.query(Player).without(ActiveVillagers)) addComponent(entity, ActiveVillagers, []);

    // for all active vilalgers of the player with data makes sure they are spawned in
    for (const [playerEntity, body, data, activeVillagers] of world.query(Body, Data, ActiveVillagers)) {
        if (!body.platform) continue
        const platform = body.platform
        const missingVillagers = data.Villagers.filter((v) => (v.RelativeLocation && !activeVillagers.find((av) => av.uniqueId === v.UniqueId)) ? true : false);
        const villagersToDespawn = activeVillagers.filter((v) => data.Villagers.find((av) => (av.UniqueId === v.uniqueId) && (av.RelativeLocation !== undefined)) && false);

        // gets rid of the spawned villagers that dont exist in data
        villagersToDespawn.forEach((villager) => world.delete(villager.entity))

        // creates a villager
        missingVillagers.forEach((villager) => activeVillagers.push({
            uniqueId: villager.UniqueId,
            entity: createEntity.villagerNpc(playerEntity, villager, platform),
        }));

        // updates active vilalgers
        addComponent(playerEntity, ActiveVillagers, activeVillagers);
        // print(activeVillagers, missingVillagers)
    }

    // when ever a villager entity is destroyed it goes saves all the progress and goes back to inventory
    for (const [_, villagerEntity, { villagerData, villagerModel, playerEntity }] of world.query(TargetEntity, Removed(Villager))) {
        const playerData = playerEntity && world.contains(playerEntity) && world.get(playerEntity, Data)
        const activeVillagers = playerData && world.get(playerEntity, ActiveVillagers);

        // if player data exists then updates the villager data
        if (playerData && activeVillagers) {
            // const oldVillagerData = playerData.Villagers.find((v) => v.UniqueId === villagerData.UniqueId);
            // const oldProgress = oldVillagerData && oldVillagerData

            // saves the villagers data but also removes their relative location
            // createEntity.updateData(playerEntity, (oldData) => {
            //     const indexOfActiveVillager = oldData.Villagers.findIndex((v) => v.UniqueId === villagerData.UniqueId);

            //     // saves the progress but removes your relative location meaning you arent spawned anymore
            //     oldData.Villagers[indexOfActiveVillager].Progress = oldProgress?.Progress || villagerData.Progress;
            //     villagerData.RelativeLocation = undefined;

            //     return oldData;
            // });

            // pops it out shifting the rest of the villagers while also adding the component back
            villagerModel.Destroy();
            activeVillagers.remove(activeVillagers.findIndex((v) => v.uniqueId === villagerData.UniqueId))
            addComponent(playerEntity, ActiveVillagers, activeVillagers);
        }
    }
}