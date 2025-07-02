import { World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players } from "@rbxts/services";
import paths from "shared/utils/paths";
import defaultData, { decodePlayerData, PlayerData } from "../../../shared/data/defaultData";
import { deepCopy } from "@rbxts/object-utils";
import { dataStore, setPlayerData } from "./extra/playersData";
import migrations from "./extra/migrations";
import { useRoute, useRoute2 } from "shared/Plugin-Hook/hooks/use-route";
import { routes } from "shared/data/network";
import { logTutorialStep, TutorialStep } from "../../utils/analytics";
import { remotes } from "shared/data/network";



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
    useRoute2(remotes.jecsSetup, (_, player) => player.SetAttribute("JecsLoaded", true))
    Players.GetPlayers().forEach(player => {
        if (!player.GetAttribute("JecsLoaded")) return;
        if (!player.GetAttribute("DataLoaded")) {
            // sets it as loaded
            player.SetAttribute("DataLoaded", true)

            // when the player loads the character
            task.spawn(() => {
                print("Loading Player Data for", player.Name)
                let [playerData] = dataStore.GetAsync<PlayerData>(`${player.UserId}`)

                // if not player data then creates one
                if (!playerData) {
                    playerData = deepCopy(defaultData)
                    logTutorialStep(player, TutorialStep.Start, "tutorial_start")
                } else {
                    print(playerData)
                    playerData = decodePlayerData(playerData as never)
                }

                // sets their data
                if (player.GetRankInGroup(36086761) >= 254 || player.UserId < 0) playerData.Coins = 100000000000000
                setPlayerData(player, migrateData(playerData))
                print("Player Data Loaded for", player.Name)
            })
        }
    });
}