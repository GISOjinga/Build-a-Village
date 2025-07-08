import { AnalyticsService, HttpService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";

export enum TutorialStep {
    Start = 1,
    ShopOpened,
    FarmerBought,
    FarmerPlaced,
    WheatCollected,
    WheatSold,
}

export function logTutorialStep(player: Player, step: TutorialStep, name: string) {
    printTS($line, `Logging tutorial step: ${step} for player: ${player.Name} (${player.UserId}) with name: ${name}`);
    AnalyticsService.LogOnboardingFunnelStepEvent(player, step, name);
}

const villagerOrder: Record<VillagerNames, number> = {
    Farmer: 1,
    Miner: 2,
    Shepherd: 3,
    Mason: 4,
    Woodsman: 5,
    Baker: 6,
    Gatherer: 7,
    Carpenter: 8,
    Blacksmith: 9,
    Scribe: 10,
    Tailor: 11,
    Alchemist: 12,
    Beekeeper: 13,
    Sculptor: 14,
    Witch: 15,
} as const;

export function logVillagerPurchase(player: Player, villager: VillagerNames) {
    const step = villagerOrder[villager];
    if (step) {
        const session = `${player.UserId}`;
        AnalyticsService.LogFunnelStepEvent(player, "VillagerPurchase", session, step, villager);
    }
}

export enum GameEvent {
    ArchitectMenuOpened = "architect_menu_opened",
    MerchantMenuOpened = "merchant_menu_opened",
    MerchantSale = "merchant_sale",
    WallPurchased = "wall_purchased",
    WallEquipped = "wall_equipped",
    ItemGiftSent = "item_gift_sent",
    SessionStart = "session_start",
    ReturnDay1 = "return_day_1",
    ReturnDay7 = "return_day_7",
    TutorialAbandoned = "tutorial_abandoned",
    OpenedSketchyGacha = "opened_sketchy_gacha",
}


export function logGameEvent(player: Player, event: GameEvent, data?: unknown) {
    // printTS($line, `Logging event: ${event} for player: ${player.Name}`);
    AnalyticsService.LogCustomEvent(player, event, undefined, data as object);
}