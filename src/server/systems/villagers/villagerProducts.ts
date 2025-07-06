import { World } from "@rbxts/jecs";
import { MarketplaceService } from "@rbxts/services";
import { useEvent } from "shared/Plugin-Hook";
import paths from "shared/utils/paths";
import ShopData from "./ShopData";

export default (world: World) => {
    const beekeeperPrompt = paths.Map.Villagers.Beekeeper.Npc.HumanoidRootPart.ProximityPrompt;
    const witchPrompt = paths.Map.Villagers.Witch.Npc.HumanoidRootPart.ProximityPrompt;

    for (const [player] of useEvent(beekeeperPrompt.Triggered)) {
        const data = ShopData.Villagers.find(v => v.Name === "Beekeeper");
        if (data) MarketplaceService.PromptProductPurchase(player, data.ProductId);
    }

    for (const [player] of useEvent(witchPrompt.Triggered)) {
        const data = ShopData.Villagers.find(v => v.Name === "Witch");
        if (data) MarketplaceService.PromptProductPurchase(player, data.ProductId);
    }
};

