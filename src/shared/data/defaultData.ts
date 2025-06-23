import { number } from "@rbxts/react/src/prop-types"
import wallsData from "./wallsData"

const defaultData = {
    Version: "0.0.0",
    Coins: 50000,
    Villagers: [] as Array<VillagerData>,
    Produce: [] as Array<ProduceData>,
    Walls: [{ ...wallsData[0], Owned: true, Equipped: true }] as Array<WallInfo>,
}


export default defaultData
export type PlayerData = typeof defaultData
