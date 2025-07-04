import { deepCopy } from "@rbxts/object-utils";
import defaultData, { PlayerData } from "shared/data/defaultData";

export default new Map<string, (oldData: PlayerData) => PlayerData>([
    ["0.0.0", (oldData: PlayerData) => {
        oldData.Version = "0.0.1"
        return oldData;
    }], ["0.0.1", (oldData: PlayerData) => {
        oldData.Version = "0.0.2"
        oldData.LastLogin = 0; // Reset LastLogin to 0
        oldData.Sessions = 0; // Reset Sessions to 0
        return oldData;
    }], ["0.0.2", (oldData: PlayerData) => {
        oldData.Version = "0.0.3"
        oldData.DailyStreak = 0
        oldData.LastDailyReward = 0
        oldData.DailyQuests = []
        oldData.QuestHistory = []
        return oldData
    }],
])