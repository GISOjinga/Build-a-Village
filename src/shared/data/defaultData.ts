import { number } from "@rbxts/react/src/prop-types"

const defaultData = {
    Version: "0.0.0",
    Coins: 1000,
    Villagers: [] as Array<VillagerData>,
    Produce: [] as Array<ProduceData>,
    Walls: [] as Array<WallInfo>,
}


export default defaultData
export type PlayerData = typeof defaultData
