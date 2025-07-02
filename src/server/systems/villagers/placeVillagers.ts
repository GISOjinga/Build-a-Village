import { pair, World } from "@rbxts/jecs";
import routes from "server/routes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { addComponent, createEntity, getEntity, printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { isVillagersOverlapping } from "shared/utils/functions/villagerFunctions";
import { ActiveVillagers, Body, Changed, Data, Platform, Player, Removed, TargetEntity, Villager, world } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";
import { deepCopy } from "@rbxts/object-utils";
import villagersProgressData from "shared/data/villagersProgressData";
import { $line } from "rbxts-transformer-inline";
import { logTutorialStep, TutorialStep } from "../../utils/analytics";









export default (world: World) => {
    useRoute(routes.placeVillager, (_location, player) => {
        const entity = getEntity.fromInstance(player);
        const body = getEntity.bodyFromPlayer(player);
        const tool = body && body.model.FindFirstChildOfClass("Tool");
        const itemType = tool?.GetAttribute("ItemType")
        const villagerName = tool?.GetAttribute("ItemName") as VillagerNames | undefined;
        const uniqueId = tool?.GetAttribute("UniqueId") as number | undefined;
        const villagerModel = villagerName && paths.Assets.Villagers.FindFirstChild<VillagerModel>(villagerName)
        const modelHeight = villagerModel?.GetAttribute<number>("Height") || 3.3
        const platform = body && body.platform;
        const floorYPosition = platform && platform.Floor.Position.Y - (platform.Floor.Size.Y / 2)
        const location = floorYPosition && new CFrame(_location.X, floorYPosition + modelHeight, _location.Z).mul(_location.Rotation)

        // if entity exists and tool exists then
        if (location && entity !== undefined && uniqueId !== undefined && villagerModel && platform && tool && villagerName && itemType === "Villager" && !isVillagersOverlapping(platform.Villagers.GetChildren(), villagerModel, location)) {

            // removes the tool and adds you to the plot of land
            createEntity.updateData(entity, (oldData) => {
                const indexOfVillager = oldData.Villagers.findIndex((v) => v.UniqueId === uniqueId);
                const villagerData = oldData.Villagers[indexOfVillager];

                // sets up the vilalger to be ready to load in
                villagerData.RelativeLocation = platform.Floor.CFrame.ToObjectSpace(location);
                villagerData.Progress = deepCopy(villagersProgressData.get(villagerName)!);
                villagerData.Progress.Progression.Time.StartTime = os.time();
                villagerData.Progress.Building.StartTime = os.time();
                villagerData.Progress.Building.TotalTime = 5;
                if (oldData.Tutorial === 1 && villagerName === "Farmer") {
                    oldData.Tutorial = 2
                    logTutorialStep(player, TutorialStep.FarmerPlaced, "tutorial_farmer_placed")
                }
                return oldData
            })
        }
    })

    // when requesting to dig villager it will remove the relative cframe by updating the data
    useRoute(routes.digVillager, (villagerEntity, player) => {
        const playerEntity = getEntity.fromInstance(player);
        const villager = world.get(villagerEntity, Villager);
        const uniqueId = villager?.villagerData.UniqueId

        // prints the villager and player trying to dig
        printJecs($line, `${player.Name} is trying to dig villager: `, villagerEntity, "\nPlayer Entity: " + playerEntity, "\nUniqueId: " + uniqueId);

        // if entity exists and tool exists then
        if (playerEntity !== undefined && playerEntity === villager?.playerEntity && uniqueId !== undefined) {
            printJecs($line, "Digging Villager", villagerEntity, playerEntity, uniqueId);

            // removes the tool and adds you to the plot of land
            createEntity.updateData(playerEntity, (oldData) => {
                const indexOfVillager = oldData.Villagers.findIndex((v) => v.UniqueId === uniqueId);
                const villagerData = oldData.Villagers[indexOfVillager];

                // sets up the vilalger to be ready to load in
                villagerData.RelativeLocation = undefined;
                world.delete(villagerEntity); // deletes the villager entity
                printJecs($line, "Removed Relative Location from: ", villagerData);
                return oldData
            })
        }
    })

    // if player doesnt have ActiveVillagers then gives them one
    for (const [entity] of world.query(Player).without(ActiveVillagers)) addComponent(entity, ActiveVillagers, []);


    // when active villagers get removed then goes through all the villagers and deletes them
    for (const [_, activeVillagers] of world.query(Removed(ActiveVillagers))) {
        printJecs($line, "Removing Active Villagers: ", activeVillagers);
        // removes all the villagers from the platform
        activeVillagers.forEach((villager) => {
            if (villager.entity && world.contains(villager.entity)) world.delete(villager.entity)
        });
    }

    // for all active vilalgers of the player with data makes sure they are spawned in
    for (const [playerEntity, body, data, activeVillagers, platformEntity] of world.query(Body, Data, ActiveVillagers, pair(TargetEntity, Platform))) {
        if (!body.platform) continue
        const platform = body.platform
        const missingVillagers = data.Villagers.filter((v) => (v.RelativeLocation && !activeVillagers.find((av) => av.uniqueId === v.UniqueId)) ? true : false);
        const villagersToDespawn = activeVillagers.filter((v) => data.Villagers.find((av) => (av.UniqueId === v.uniqueId) && (av.RelativeLocation !== undefined)) && false);

        // gets rid of the spawned villagers that dont exist in data
        villagersToDespawn.forEach((villager) => world.delete(villager.entity))

        // creates a villager
        missingVillagers.forEach((villager) => activeVillagers.push({
            uniqueId: villager.UniqueId,
            entity: createEntity.villagerNpc(playerEntity, villager, platform, platformEntity),
        }));

        // updates active vilalgers
        addComponent(playerEntity, ActiveVillagers, activeVillagers);
        // print(activeVillagers, missingVillagers)
    }

    // when ever a villager entity is destroyed it goes saves all the progress and goes back to inventory
    for (const [_, __, { villagerData, villagerModel, playerEntity }] of world.query(TargetEntity, Removed(Villager))) {
        const playerData = playerEntity && world.contains(playerEntity) && world.get(playerEntity, Data)
        const activeVillagers = playerData && world.get(playerEntity, ActiveVillagers);

        // destroys the villager
        villagerModel.Destroy();

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
            activeVillagers.remove(activeVillagers.findIndex((v) => v.uniqueId === villagerData.UniqueId))
            addComponent(playerEntity, ActiveVillagers, activeVillagers);
        }
    }
}