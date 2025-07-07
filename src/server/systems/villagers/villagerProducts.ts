import { World } from "@rbxts/jecs";
import { MarketplaceService } from "@rbxts/services";
import { useEvent, useMemo } from "shared/Plugin-Hook";
import paths from "shared/utils/paths";
import ShopData from "./ShopData";

export default (world: World) => {
    const beekeeperPrompt = paths.Map.Villagers.Beekeeper.Npc.HumanoidRootPart.ProximityPrompt;
    const witchPrompt = paths.Map.Villagers.Witch.Npc.HumanoidRootPart.ProximityPrompt;

    // Set up production animations for NPCs
    const beekeeperHumanoid = paths.Map.Villagers.Beekeeper.Npc.Humanoid;
    const witchHumanoid = paths.Map.Villagers.Witch.Npc.Humanoid;

    // Find and play production animations
    const beekeeperAnimation = paths.Assets.Animations.Villager.Beekeeper.Production;
    const witchAnimation = paths.Assets.Animations.Villager.Witch.Production;

    if (beekeeperAnimation && beekeeperHumanoid) {
        const animationTrack = useMemo(() => witchHumanoid.Animator.LoadAnimation(beekeeperAnimation), [])
        animationTrack.Looped = true;
        if (!animationTrack.IsPlaying) animationTrack.Play();
    }

    if (witchAnimation && witchHumanoid) {
        const animationTrack = useMemo(() => witchHumanoid.Animator.LoadAnimation(witchAnimation), [])
        animationTrack.Looped = true;
        if (!animationTrack.IsPlaying) animationTrack.Play();
    }

    for (const [player] of useEvent(beekeeperPrompt.Triggered)) {
        const data = ShopData.Villagers.find(v => v.Name === "Beekeeper");
        if (data) MarketplaceService.PromptProductPurchase(player, data.ProductId);
    }

    for (const [player] of useEvent(witchPrompt.Triggered)) {
        const data = ShopData.Villagers.find(v => v.Name === "Witch");
        if (data) MarketplaceService.PromptProductPurchase(player, data.ProductId);
    }
};

