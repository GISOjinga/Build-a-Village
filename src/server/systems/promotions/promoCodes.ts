import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import promoCodes from "shared/data/promoCodes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
    useRoute(routes.redeemPromo, (code, player) => {
        const reward = promoCodes[code.lower() as keyof typeof promoCodes];
        const playerEntity = getEntity.fromInstance(player);
        if (!playerEntity || !reward) {
            routes.promoResult.sendTo({ success: false, message: "Invalid code" }, player);
            return;
        }
        if (reward.coins) {
            createEntity.updateData(playerEntity, (old) => {
                old.Coins += reward.coins as number;
                return old;
            });
            routes.promoResult.sendTo({ success: true, message: `$${reward.coins} redeemed` }, player);
        } else if (reward.item) {
            routes.promoResult.sendTo({ success: true, message: `${reward.item} redeemed` }, player);
        }
    });
};
