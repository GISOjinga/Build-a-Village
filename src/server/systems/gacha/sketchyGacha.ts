import { World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { useEvent } from "shared/Plugin-Hook";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";
import routes from "server/routes";
import gachaItems, { GachaItem } from "shared/data/gachaItems";
import { Data } from "shared/utils/jecs/jecsComponents";
import { PlayerData } from "shared/data/defaultData";
import wallsData from "shared/data/wallsData";

const PRODUCT_ID = 3326181974;

function rollItem(data: PlayerData): GachaItem {
    const rng = new Random();
    const available = gachaItems.filter(item => {
        if (item.Type === "Villager") return !data.Villagers.some(v => v.Name === item.Name);
        if (item.Type === "Wall") return !data.Walls.some(w => w.Name === item.Name && w.Owned);
        return true;
    });
    let total = 0;
    available.forEach(i => total += i.Weight);
    let pick = rng.NextNumber(0, total);
    for (const item of available) {
        pick -= item.Weight;
        if (pick <= 0) return item;
    }
    return available[0];
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
        if (result.Type === "Villager") {
            createEntity.inventoryVillager(entity, result.Name as VillagerNames);
        } else if (result.Type === "Produce") {
            createEntity.insertProduce(entity, result.Name as ProduceNames, "Normal", 1);
        } else if (result.Type === "Wall") {
            const wallInfo = wallsData.find(w => w.Name === result.Name);
            if (wallInfo) {
                createEntity.updateData(entity, old => {
                    old.Walls.push({ ...wallInfo, Owned: true, Equipped: false });
                    return old;
                });
            }
        }

        routes.startSketchyRoll.sendTo({ item: result.Name, type: result.Type }, player);
    }
};
