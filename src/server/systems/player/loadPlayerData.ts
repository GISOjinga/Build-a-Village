import { World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players } from "@rbxts/services";
import paths from "shared/utils/paths";
import defaultData, { decodePlayerData, PlayerData } from "../../../shared/data/defaultData";
import { deepCopy } from "@rbxts/object-utils";
import { dataStore, setPlayerData } from "./extra/playersData";
import migrations from "./extra/migrations";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import routes from "server/routes";
import { logTutorialStep, TutorialStep, logGameEvent, GameEvent } from "../../utils/analytics";



// migrates the players data
function migrateData(playerData: PlayerData): PlayerData {
    function update(newData: PlayerData): PlayerData {
        const funcToUpdateData = migrations.get(newData.Version)

        // repeats the update until no more func
        if (funcToUpdateData) {
            return update(funcToUpdateData(newData))
        } else {
            return newData
        }
    }

    // returns the update
    return update(deepCopy(playerData) as PlayerData);
}

// loads the players data
export default (world: World) => {
    useRoute(routes.jecsSetup, (_, player) => player.SetAttribute("JecsLoaded", true))
    Players.GetPlayers().forEach(player => {
        if (!player.GetAttribute("JecsLoaded")) {
            const FakePack = player.FindFirstChild("FakePack") || new Instance("Folder");
            FakePack.Name = "FakePack";
            FakePack.Parent = player
            return
        };
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

                if (playerData.LastDailyReward === undefined) playerData.LastDailyReward = 0
                if (playerData.DailyStreak === undefined) playerData.DailyStreak = 0
                if (!playerData.DailyQuests) playerData.DailyQuests = []
                if (!playerData.QuestHistory) playerData.QuestHistory = []

                const now = os.time()
                const sessions = (playerData.Sessions || 0) + 1
                if (playerData.LastLogin) {
                    const days = math.floor((now - playerData.LastLogin) / (60 * 60 * 24))
                    if (days >= 1) logGameEvent(player, GameEvent.ReturnDay1)
                    if (days >= 7) logGameEvent(player, GameEvent.ReturnDay7)
                }
                playerData.Sessions = sessions
                playerData.LastLogin = now

                logGameEvent(player, GameEvent.SessionStart, { session: sessions })

                // sets their data
                // if ((player.GetRankInGroup(36086761) >= 254 || player.UserId < 0) && playerData.Tutorial !== "Done") playerData.Coins = 1000
                setPlayerData(player, migrateData(playerData))
                print("Player Data Loaded for", player.Name)
            })
        }
    });
}