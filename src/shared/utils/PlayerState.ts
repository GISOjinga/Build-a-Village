import { Entity, World } from "@rbxts/jecs";
import { PlayerState } from "./jecs/jecsComponents";
import Object from "@rbxts/object-utils";


export const PlayerStateSchema = {
    movement: [
        "isGliding",
        "isDoubleJumping",
        "isDecidingAirDash",
        "isAirDashing",
        "isChargingLeap",
        "isChargeleaping",
    ],
    // combat: [
    //     "isBlocking",
    //     "isPunching",
    // ],
};

// Various statuses (add as needed)
export type PlayerState = {
    movement: {
        isGliding?: { active: boolean; lastUpdated: number };
        isDoubleJumping?: { active: boolean; lastUpdated: number };
        isDecidingAirDash?: { active: boolean; lastUpdated: number };
        isAirDashing?: { active: boolean; lastUpdated: number };
        isChargingLeap?: { active: boolean; lastUpdated: number };
        isChargeleaping?: { active: boolean; lastUpdated: number };
    }
    combat: {
        /** ex) 
        isBlocking?: {active: boolean; lastUpdated: number};
        isPunching?: {active: boolean; lastUpdated: number};
         **/
    }
};


export function getHardPriorityState(
    world: World,
    entity: Entity
): string | undefined {
    const state = world.get(entity, PlayerState);
    if (!state) return undefined;

    // Define your hard-priority keys here
    const hardPriorityKeys: { category: keyof PlayerState; key: string }[] = [
        /** Example:
        { category: "status", key: "isDead" },
        { category: "status", key: "isKnockedBack" },
        { category: "status", key: "isStunned" },
        **/
    ];

    for (const { category, key } of hardPriorityKeys) {
        if (
            typeIs(state[category], "table") &&
            (state[category] as Record<string, { active: boolean }>)[key]?.active
        ) {
            return key;
        }
    }
    return undefined;
};

export function createInitialPlayerState(): PlayerState {
    const initial: Record<string, Record<string, { active: boolean; lastUpdated: number }>> = {};

    for (const [categoryName, keys] of Object.entries(PlayerStateSchema)) {
        // print(categoryName);
        const categoryObj: Record<string, { active: boolean; lastUpdated: number }> = {};

        for (const key of keys as string[]) {
            categoryObj[key] = { active: false, lastUpdated: 0 };
            // print(key);
        }

        initial[categoryName] = categoryObj;
    }

    return initial as unknown as PlayerState;
}
