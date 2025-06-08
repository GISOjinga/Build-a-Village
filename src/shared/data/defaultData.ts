import { number } from "@rbxts/react/src/prop-types"

const defaultData = {
    Version: "0.0.0",
    Fence: ("Wooden Fence" satisfies FenceNames) as FenceNames,
    Currency: 0,
}


export default defaultData
export type PlayerData = typeof defaultData // s
