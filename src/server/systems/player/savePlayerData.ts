import { Entity, World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { HttpService, Players } from "@rbxts/services";
import paths from "shared/utils/paths";
import defaultData, { decodePlayerData, encodePlayerData, PlayerData } from "../../../shared/data/defaultData";
import { deepCopy } from "@rbxts/object-utils";
import { dataStore, getPlayerData, setPlayerData } from "./extra/playersData";
import { $line } from "rbxts-transformer-inline";
import { printJecs } from "shared/utils/functions/jecsHelpFunctions";
import { Villager } from "shared/utils/jecs/jecsComponents";


print("Saving Player Data System Loaded")


// saves the players data
export default (world: World) => {
    for (const [player] of useEvent(Players.PlayerRemoving)) {
        const playerData = getPlayerData(player)
        const entity = player.GetAttribute<Entity>("ServerId");

        // gets the entity
        printJecs($line, "Destroying Player Entity: ", entity)
        // if entity exists then destroy it
        if (entity && playerData) {
            // when ever a villager updates it also updates that players data
            for (const [_, newData] of world.query(Villager)) {
                const playerEntity = newData.playerEntity;

                if (playerEntity === entity) {
                    const indexOfVillager = playerData.Villagers.findIndex((v) => v.UniqueId === newData.villagerData.UniqueId);
                    if (indexOfVillager !== -1) playerData.Villagers[indexOfVillager] = newData.villagerData;
                }
            }

            world.delete(entity)
        }
        print(playerData)
        // if player data then set async
        if (playerData) task.spawn(() => dataStore.SetAsync(`${player.UserId}`, encodePlayerData(playerData)))
    }
}