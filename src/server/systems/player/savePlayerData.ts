import { World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players } from "@rbxts/services";
import paths from "shared/utils/paths";
import defaultData, { PlayerData } from "../../../shared/data/defaultData";
import { deepCopy } from "@rbxts/object-utils";
import { dataStore, getPlayerData, setPlayerData } from "./extra/playersData";





// saves the players data
export default (world: World) => {
    for (const [player] of useEvent(Players.PlayerRemoving)) {
        const playerData = getPlayerData(player)
        print(playerData)
        // if player data then set async
        // if (playerData) task.spawn(() => dataStore.SetAsync(`${player.UserId}`, playerData))
    }
    Players.GetPlayers().forEach(player => {
        if (!player.GetAttribute("JecsLoaded")) return;
        if (!player.GetAttribute("DataLoaded")) {
            // sets it as loaded
            player.SetAttribute("DataLoaded", true)

            // when the player loads the character
            task.spawn(() => {
                let [playerData] = dataStore.GetAsync<PlayerData>(`${player.UserId}`)

                // if not player data then creates one
                if (!playerData) playerData = deepCopy(defaultData)

                // sets their data
                setPlayerData(player, playerData)
            })
        }
    });
}