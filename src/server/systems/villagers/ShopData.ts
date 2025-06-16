export default {
    Villagers: [
        {
            Name: "Farmer",
            Price: 100,
            InStock: 0,
            Image: "rbxassetid://112646206830150",
            Description: "A friendly villager.",
            Rarity: "Common",
            Tier: 1,
            ProductId: 3308077941, // Example product ID for in-game purchases
        }, {
            Name: "Blacksmith",
            Price: 200,
            InStock: 0,
            Image: "rbxassetid://112646206830150",
            Description: "A friendly villager.",
            Rarity: "Common",
            Tier: 1,
            ProductId: 3308078109,
        }
    ] satisfies Array<VillagerInfo> as Array<VillagerInfo>,
}