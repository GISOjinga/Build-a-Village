import { number } from "@rbxts/react/src/prop-types"
import wallsData from "./wallsData"

const defaultData = {
    Version: "0.0.0",
    Coins: 100000,
    Villagers: [] as Array<VillagerData>,
    Produce: [] as Array<ProduceData>,
    Tutorial: 0 as number | "Done",
    Walls: [{ ...wallsData[0], Owned: true, Equipped: true }] as Array<WallInfo>,
    PromoCodesRedeemed: [] as Array<string>,
}


export default defaultData
export type PlayerData = typeof defaultData
