import { World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { useEvent, useRoute } from "shared/Plugin-Hook";
import { createEntity, getEntity, addComponent, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";
import routes from "server/routes";
import gachaItems, { GachaItem } from "shared/data/gachaItems";
import { Data, GachaResult, Leaving, Player } from "shared/utils/jecs/jecsComponents";
import { PlayerData } from "shared/data/defaultData";
import wallsData from "shared/data/wallsData";

const PRODUCT_ID = 3326181974;
export const AUTO_SKIP_PASS_ID = 3326181975;
const ROLL_DURATION = 5;

function rollItem(data: PlayerData): GachaItem {
    const available = gachaItems.filter(item => {
        if (item.Type === "Wall") return !data.Walls.some(w => w.Name === item.Name && w.Owned);
        return true;
    });
    const chosen = available[math.random(0, available.size() - 1)]
    return math.random(1, chosen.Weight) === 1 ? chosen : rollItem(data); // Ensure we always return a valid item
}

export default (world: World) => {
    const prompt = paths.Map.Shops.SketchyGuy.Npc.HumanoidRootPart.ProximityPrompt;

    for (const [player] of useEvent(prompt.Triggered)) {
        MarketplaceService.PromptProductPurchase(player, PRODUCT_ID);
    }

    useRoute(routes.buyAutoSkipRoll, (_, player) => {
        MarketplaceService.PromptGamePassPurchase(player, AUTO_SKIP_PASS_ID);
    });

    for (const [player, gamePassId, wasPurchased] of useEvent(MarketplaceService.PromptGamePassPurchaseFinished)) {
        if (gamePassId !== AUTO_SKIP_PASS_ID) continue;
        const entity = getEntity.fromInstance(player);
        if (!entity) continue;
        if (wasPurchased || MarketplaceService.UserOwnsGamePassAsync(player.UserId, AUTO_SKIP_PASS_ID)) {
            createEntity.updateData(entity, old => { old.AutoSkipRoll = true; return old; });
            routes.notify.sendTo({ text: "Auto Skip Roll unlocked!", duration: 5 }, player);
        }
    }

    for (const [userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        if (productId !== PRODUCT_ID || !wasPurchased) continue;
        const player = Players.GetPlayerByUserId(userId);
        const entity = player ? getEntity.fromInstance(player) : undefined;
        const data = entity && world.get(entity, Data);
        if (!player || !entity || !data) continue;

        const result = rollItem(data);
        addComponent(entity, GachaResult, { item: result.Name, type: result.Type, startTime: os.time() });
        routes.startSketchyRoll.sendTo({ item: result.Name, type: result.Type }, player);
    }

    for (const [entity, result] of world.query(GachaResult, Player, Data)) {
        const player = world.get(entity, Player);
        const data = world.get(entity, Data);
        if (!player || !data) continue;
        if (data.AutoSkipRoll || world.contains(entity, Leaving) || os.time() - result.startTime >= ROLL_DURATION) {
            if (result.type === "Villager") {
                createEntity.inventoryVillager(entity, result.item as VillagerNames);
            } else if (result.type === "Produce") {
                createEntity.insertProduce(entity, result.item as ProduceNames, "Normal", 1);
            } else if (result.type === "Wall") {
                const wallInfo = wallsData.find(w => w.Name === result.item);
                if (wallInfo) {
                    createEntity.updateData(entity, old => { old.Walls.push({ ...wallInfo, Owned: true, Equipped: false }); return old; });
                }
            }
            routes.notify.sendTo({ text: `You got ${result.item}!`, duration: 5 }, player);
            removeComponent(entity, GachaResult);
        }
    }
};
