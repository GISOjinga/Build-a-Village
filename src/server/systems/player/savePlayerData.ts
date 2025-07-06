import { Entity, World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { HttpService, Players } from "@rbxts/services";
import paths from "shared/utils/paths";
import defaultData, { decodePlayerData, encodePlayerData, PlayerData } from "../../../shared/data/defaultData";
import { deepCopy } from "@rbxts/object-utils";
import { dataStore, getPlayerData, setPlayerData } from "./extra/playersData";
import { $line } from "rbxts-transformer-inline";
import { addComponent, printJecs } from "shared/utils/functions/jecsHelpFunctions";
import { Leaving, Villager } from "shared/utils/jecs/jecsComponents";
import { logGameEvent, GameEvent } from "../../utils/analytics";
import { appendJecs } from "shared/systems/hooks/append";


print("Saving Player Data System Loaded")


// saves the players data
export default (world: World) => {
    for (const [player] of useEvent(Players.PlayerRemoving)) {
        const playerData = getPlayerData(player)
        const entity = player.GetAttribute<Entity>("ServerId");

        // if entity then adds a leaving component
        if (entity && playerData) {
            addComponent(entity, Leaving)
            // when ever a villager updates it also updates that players data
            for (const [_, newData] of world.query(Villager)) {
                const playerEntity = newData.playerEntity;

                if (playerEntity === entity) {
                    const indexOfVillager = playerData.Villagers.findIndex((v) => v.UniqueId === newData.villagerData.UniqueId);
                    if (indexOfVillager !== -1) playerData.Villagers[indexOfVillager] = newData.villagerData;
                }
            }
        }

        appendJecs(() => {
            // gets the entity
            printJecs($line, "Destroying Player Entity: ", entity)

            // if entity exists then destroy it
            if (entity) world.delete(entity)
            print(playerData)
            if (playerData) {
                if (playerData.Tutorial !== "Done") logGameEvent(player, GameEvent.TutorialAbandoned, { step: playerData.Tutorial })
                task.spawn(() => dataStore.SetAsync(`${player.UserId}`, encodePlayerData(playerData)))
            }
        });
    }
}