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
    const totalWeight = available.reduce((sum, item) => sum + item.Weight, 0);

    // Get a random number between 1 and totalWeight
    const roll = math.random() * totalWeight;

    // Find the item whose cumulative weight contains the roll
    let cumulative = 0;
    for (const item of available) {
        cumulative += item.Weight;
        if (roll <= cumulative) {
            return item;
        }
    }

    // Fallback (should never happen if weights are correct)
    // warn(`[${$line}] Fallback in rollItem() - returning last item.`);
    return rollItem(data); // Retry to ensure we get a valid item
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

    routes.finishSketchyRoll.listen((_, player) => {
        const entity = getEntity.fromInstance(player);
        if (!entity) return;
        const result = world.get(entity, GachaResult);
        if (!result) return;
        giveReward(entity, result);
        removeComponent(entity, GachaResult);
    });

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

    for (const [entity] of world.query(TargetEntity, Added(Leaving))) {
        const result = world.get(entity, GachaResult);
        if (result) {
            giveReward(entity, result);
            removeComponent(entity, GachaResult);
        }
    }
};
