import wallsData from "./wallsData"
import paths from "shared/utils/paths"

const defaultData = {
    Version: "0.0.0",
    Coins: paths.Assets.Villagers.Farmer.GetAttribute<number>("Price") || 0,
    Villagers: [] as Array<VillagerData>,
    Produce: [] as Array<ProduceData>,
    Tutorial: 0 as number | "Done",
    LastLogin: 0,
    Sessions: 0,
    Walls: [{ ...wallsData[0], Owned: true, Equipped: true }] as Array<WallInfo>,
    PromoCodesRedeemed: [] as Array<string>,
    ClaimedFreeRewardChest: false,
}

/**
 * Converts CFrame instances in VillagerData.RelativeLocation to string,
 * replacing `undefined` with `undefined`.
 */
export function encodePlayerData(data: PlayerData): Omit<PlayerData, "Villagers"> & {
    Villagers: Array<Omit<VillagerData, "RelativeLocation"> & { RelativeLocation: string | undefined }>
} {
    return {
        ...data,
        Villagers: data.Villagers.map(v => ({
            ...v,
            RelativeLocation: v.RelativeLocation ? tostring(v.RelativeLocation) : undefined,
        })),
    };
}

/**
 * Converts stringified CFrame back to actual CFrame.
 * Roblox's CFrame constructor can parse strings.
 */
export function decodePlayerData(
    encoded: ReturnType<typeof encodePlayerData>
): PlayerData {
    return {
        ...encoded,
        Villagers: encoded.Villagers.map(v => ({
            ...v,
            RelativeLocation: v.RelativeLocation
                ? new CFrame(...string.split(v.RelativeLocation, ",").map(val => tonumber(val)!)! as [never, never, never, never, never, never, never])
                : undefined,
        })),
    };
}

export default defaultData
export type PlayerData = typeof defaultData
