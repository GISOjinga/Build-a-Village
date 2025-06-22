import { World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import robuxStoreData from "shared/data/robuxStoreData";
import { useEvent } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { createEntity, getEntity, removeComponent, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Added, GiftTo, Player } from "shared/utils/jecs/jecsComponents";

// helper to find purchase info by productId
function findPurchaseByProduct(productId: number) {
    for (const [purchaseName, purchase] of pairs(robuxStoreData)) {
        for (const [packName, pack] of pairs(purchase.Pack)) {
            if (pack.ProductId === productId) {
                return { purchaseName: purchaseName as keyof typeof robuxStoreData, purchase, pack };
            }
        }
    }
    return undefined;
}

export default (world: World) => {
    // send store data to players when they join
    for (const [_, player] of world.query(Added(Player))) {
        routes.updateRobuxStore.sendTo(robuxStoreData, player);
    }

    // handle client requests to buy a pack
    useRoute(routes.buyRobuxPack, ({ purchase, pack }, player) => {
        const purchaseData = robuxStoreData[purchase];
        const packData = purchaseData?.Pack[pack];
        if (packData) MarketplaceService.PromptProductPurchase(player, packData.ProductId);
    });

    // handle completed purchases
    for (const [_userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        const player = Players.GetPlayerByUserId(_userId) as Player | undefined;
        const playerEntity = player && getEntity.fromInstance(player);
        const info = findPurchaseByProduct(productId);
        if (!player || !playerEntity || !info) continue;

        if (wasPurchased) {
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
                    for (let i = 0; i < info.pack.PackMultiplier; i++) {
                        createEntity.inventoryVillager(targetEntity, villager);
                    }
                }
                printTS($line, `${targetPlayer.Name} received pack`, info.purchaseName, "x", info.pack.PackMultiplier);
            }
        } else {
            removeComponent(playerEntity, GiftTo);
        }
    }
};