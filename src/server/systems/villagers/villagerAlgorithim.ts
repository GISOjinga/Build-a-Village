import ShopData from "./ShopData";

export type VillagerInfo = {
    Name: string;
    Price: number;
    InStock: number;
    Image: string;
    Description: string;
    Rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythical";
    Tier: number;
    ProductId: number;
};

// ===== Configuration Tables =====
// Chance each rarity appears (0–1)
const rarityAppearChance: Record<VillagerInfo["Rarity"], number> = {
    Common: 1.00,
    Uncommon: 0.80,
    Rare: 0.40,
    Epic: 0.20,
    Legendary: 0.05,
    Mythical: 0.01,
};

// Weighted stock tables per rarity
const stockWeights: Record<VillagerInfo["Rarity"], Array<{ quantity: number; weight: number }>> = {
    Common: [
        { quantity: 5, weight: 50 },
        { quantity: 6, weight: 30 },
        { quantity: 7, weight: 15 },
        { quantity: 8, weight: 5 }, // represents 8–10: split weight equally
        { quantity: 9, weight: 2.5 },
        { quantity: 10, weight: 2.5 },
    ],
    Uncommon: [
        { quantity: 3, weight: 60 },
        { quantity: 4, weight: 30 },
        { quantity: 5, weight: 5 }, // split 5–6 equally
        { quantity: 6, weight: 5 },
    ],
    Rare: [
        { quantity: 1, weight: 70 },
        { quantity: 2, weight: 25 },
        { quantity: 3, weight: 5 },
    ],
    Epic: [
        { quantity: 1, weight: 90 },
        { quantity: 2, weight: 10 },
    ],
    Legendary: [
        { quantity: 1, weight: 95 },
        { quantity: 2, weight: 5 },
    ],
    Mythical: [
        { quantity: 1, weight: 99 },
        { quantity: 2, weight: 1 },
    ],
};

// Returns the index of one villager to restock, or null if none appear
export function selectVillagerToRestock(): number | undefined {
    const candidates: number[] = [];

    // Gather all villagers that pass the rarity-based appearance roll
    for (let i = 0; i < ShopData.Villagers.size(); i++) {
        const v = ShopData.Villagers[i];
        const appearChance = rarityAppearChance[v.Rarity];
        if (math.random() <= appearChance) {
            candidates.push(i);
        }
    }

    // If no one passed, return null
    if (candidates.size() === 0) {
        return undefined;
    }

    // Pick one random candidate
    const pickIndex = math.floor(math.random() * candidates.size());
    return candidates[pickIndex];
}