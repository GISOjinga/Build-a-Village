import { World, Entity } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { useEvent } from "shared/Plugin-Hook";
import { createEntity, getEntity, addComponent, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";
import routes from "server/routes";
import gachaItems, { GachaItem } from "shared/data/gachaItems";
import { Data, GachaResult, Leaving, Player, TargetEntity, Added } from "shared/utils/jecs/jecsComponents";
import { PlayerData } from "shared/data/defaultData";
import wallsData from "shared/data/wallsData";
import { $line } from "rbxts-transformer-inline";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import ShopData from "../villagers/ShopData";

const PRODUCT_ID = 3326181974;
function rollItem(data: PlayerData): GachaItem {
    // Filter out already owned walls
    const available = gachaItems.filter(item => {
        if (item.Type === "Wall") {
            return !data.Walls.some(w => w.Name === item.Name && w.Owned);
        }
        return true;
    });

    // Compute total weight
    const chosen1 = available[math.random(0, available.size() - 1)];

    // Fallback (should never happen if weights are correct)
    // warn(`[${$line}] Fallback in rollItem() - returning last item.`);
    return math.random(1, chosen1.Weight) === 1 ? chosen1 : rollItem(data);
}

export default (world: World) => {
    const prompt = paths.Map.Shops.SketchyGuy.Npc.HumanoidRootPart.ProximityPrompt;

    for (const [player] of useEvent(prompt.Triggered)) {
        MarketplaceService.PromptProductPurchase(player, PRODUCT_ID);
    }

    for (const [userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        if (productId !== PRODUCT_ID || !wasPurchased) continue;
        const player = Players.GetPlayerByUserId(userId);
        const entity = player ? getEntity.fromInstance(player) : undefined;
        const data = entity && world.get(entity, Data);
        if (!player || !entity || !data) continue;

        const result = rollItem(data);
        addComponent(entity, GachaResult, { item: result.Name, type: result.Type });
        routes.startSketchyRoll.sendTo({ item: result.Name, type: result.Type }, player);
    }

    function giveReward(entity: Entity, result: { item: string; type: string }) {
        const data = world.get(entity, Data);
        const player = world.get(entity, Player);
        if (!data || !player) return;

        if (result.type === "Villager") {
            createEntity.inventoryVillager(entity, result.item as VillagerNames);
        } else if (result.type === "Produce") {
            createEntity.insertProduce(entity, result.item as ProduceNames, "Normal", 1);
        } else if (result.type === "Wall") {
            const wallInfo = wallsData.find(w => w.Name === result.item);
            if (wallInfo) {
                createEntity.updateData(entity, old => {
                    old.Walls.push({ ...wallInfo, Owned: true, Equipped: false });
                    return old;
                });
            }
        }
        routes.notify.sendTo({ text: `You received ${result.item}!`, duration: 5 }, player);
    }

    useRoute(routes.finishSketchyRoll, (_, player) => {
        const entity = getEntity.fromInstance(player);
        if (!entity) return;
        const result = world.get(entity, GachaResult);
        if (!result) return;
        giveReward(entity, result);
        removeComponent(entity, GachaResult);
    });

    // Handle player leaving during roll - immediately give them their reward
    for (const [entity] of world.query(TargetEntity, Added(Leaving))) {
        const result = world.get(entity, GachaResult);
        if (result) {
            giveReward(entity, result);
            removeComponent(entity, GachaResult);
        }
    }
};
