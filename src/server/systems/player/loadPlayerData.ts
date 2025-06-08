import { World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players } from "@rbxts/services";
import paths from "shared/utils/paths";
import defaultData, { PlayerData } from "../../../shared/data/defaultData";
import { deepCopy } from "@rbxts/object-utils";
import { dataStore, setPlayerData } from "./extra/playersData";
import migrations from "./extra/migrations";



// migrates the players data
function migrateData(playerData: PlayerData): PlayerData {
    function update(newData: PlayerData): PlayerData {
        const funcToUpdateData = migrations.get(playerData.Version)

        // repeats the update until no more func
        if (funcToUpdateData) {
            return update(funcToUpdateData(newData))
        } else {
            return newData
        }
    }

    // returns the update
    return update(playerData)
}

// loads the players data
export default (world: World) => {
    Players.GetPlayers().forEach(player => {
        if (!player.GetAttribute("DataLoaded")) {
            // sets it as loaded
            player.SetAttribute("DataLoaded", true)

            // when the player loads the character
            useMemo(() => task.spawn(() => {
                let [playerData] = dataStore.GetAsync<PlayerData>(`${player.UserId}`)

                // if not player data then creates one
                if (!playerData) playerData = deepCopy(defaultData)

                // sets their data
                setPlayerData(player, migrateData(playerData))
            }), [])
        }
    });
}