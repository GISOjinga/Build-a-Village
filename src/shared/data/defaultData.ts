import { number } from "@rbxts/react/src/prop-types"

const defaultData = {
    Version: "0.0.0",
    Fence: ("Wooden Fence" satisfies FenceNames) as FenceNames,
    Coins: 1000,
    Villagers: [] as Array<VillagerData>,
    Produce: [] as Array<ProduceData>,
}


export default defaultData
export type PlayerData = typeof defaultData
