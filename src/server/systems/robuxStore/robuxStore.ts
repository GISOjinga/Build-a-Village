import { World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import robuxStoreData, { RobuxStoreData } from "shared/data/robuxStoreData";
import paths from "shared/utils/paths";
import ShopData from "../villagers/ShopData";
import { useEvent } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { createEntity, getEntity, removeComponent, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Added, GiftTo, Player } from "shared/utils/jecs/jecsComponents";

const WEEK_LENGTH = 7 * 24 * 60 * 60;

function getWeeklySeed() {
    return math.floor(os.time() / WEEK_LENGTH);
}

function chooseVillagers(rng: Random, count: number) {
    const pool = ShopData.Villagers.map(v => v.Name);
    const result = new Array<VillagerNames>();
    while (result.size() < count) {
        const idx = rng.NextInteger(1, pool.size()) - 1;
        const name = pool[idx];
        if (!result.includes(name)) result.push(name);
    }
    return result;
}

let currentSeed = 0;

// helper to find purchase info by productId
function findPurchaseByProduct(productId: number) {
    for (const [purchaseName, purchase] of pairs(robuxStoreData)) {
        if (purchase.ProductId === productId) {
            return { purchaseName: purchaseName as keyof RobuxStoreData, purchase };
        }
    }
    return undefined;
}

export default (world: World) => {
    const seed = getWeeklySeed();
    if (seed !== currentSeed) {
        currentSeed = seed;
        const starterRng = new Random(seed + 142);
        const launchRng = new Random(seed + 532);
        robuxStoreData.StarterPack.Villagers = chooseVillagers(starterRng, 3) as [
            VillagerNames,
            VillagerNames,
            VillagerNames
        ];
        robuxStoreData.LaunchPack.Villagers = chooseVillagers(launchRng, 5) as [
            VillagerNames,
            VillagerNames,
            VillagerNames,
            VillagerNames,
            VillagerNames
        ];
        robuxStoreData.StarterPack.Coins = starterRng.NextInteger(1000, 5000);
        routes.updateRobuxStore.sendToAll(robuxStoreData);
    }

    for (const [_, player] of world.query(Added(Player))) {
        routes.updateRobuxStore.sendTo(robuxStoreData, player);
    }

    // handle client requests to buy a pack
    useRoute(routes.buyRobuxPack, ({ purchase }, player) => {
        const purchaseData = robuxStoreData[purchase];
        if (purchaseData) MarketplaceService.PromptProductPurchase(player, purchaseData.ProductId);
    });

    // handle completed purchases
    for (const [_userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        const player = Players.GetPlayerByUserId(_userId) as Player | undefined;
        const playerEntity = player && getEntity.fromInstance(player);
        const info = findPurchaseByProduct(productId);
        if (!player || !playerEntity || !info) continue;

        if (wasPurchased) {
            routes.playSound.sendTo({ sound: paths.SFX.UI.purchasepass, position: undefined }, player);

            let targetPlayer = player;
            let targetEntity = playerEntity;
            const giftPlayer = world.get(playerEntity, GiftTo) as Player | undefined;
            if (giftPlayer) {
                removeComponent(playerEntity, GiftTo);
                if (giftPlayer.Parent) {
                    routes.notify.sendTo({ text: `${player.Name} has gifted you!`, duration: 5 }, giftPlayer);
                    routes.notify.sendTo({ text: `You have gifted ${giftPlayer.Name}!`, duration: 5 }, player);
                    targetPlayer = giftPlayer;
                    targetEntity = getEntity.fromInstance(giftPlayer) as typeof playerEntity;
                }
            }

            if (targetEntity) {
                for (const villager of info.purchase.Villagers) {
                    createEntity.inventoryVillager(targetEntity, villager);
                }

                const starter = info.purchase as Partial<StarterShopPack>;
                if (starter.Coins) {
                    createEntity.updateData(targetEntity, (old) => {
                        old.Coins += starter.Coins as number;
                        return old;
                    });
                }

                printTS($line, `${targetPlayer.Name} received pack`, info.purchaseName);
            }
        } else {
            routes.playSound.sendTo({ sound: paths.SFX.UI.purchasefail, position: undefined }, player);
            removeComponent(playerEntity, GiftTo);
        }
    }
};