import { PlayerData } from "shared/data/defaultData";

export default new Map<string, (oldData: PlayerData) => PlayerData>([
    ["0.0.0", (oldData: PlayerData) => {
        oldData.Version = "0.0.1"
        return oldData;
    }]
])