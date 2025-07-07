

export default [
    { id: 1, description: "Collect 3 wheat from a Farmer", target: 3, action: "misc", reward: { type: "Coins", amount: 50 } },
    { id: 2, description: "Deliver 2 wheat to a Baker", target: 2, action: "misc", reward: { type: "Coins", amount: 60 } },
    { id: 3, description: "Collect 4 iron from a Miner", target: 4, action: "misc", reward: { type: "Produce", name: "Iron" } },
    { id: 4, description: "Use the Sell NPC to sell inventory", target: 1, action: "misc", reward: { type: "Coins", amount: 80 } },
    { id: 5, description: "Check one of your produced items values", target: 1, action: "misc", reward: { type: "Coins", amount: 80 } },
    { id: 6, description: "Wake 2 sleeping villagers", target: 2, action: "misc", reward: { type: "Produce", name: "Honey" } },
    { id: 7, description: "Hold a Rainbow item", target: 1, action: "misc", reward: { type: "Coins", amount: 90 } },
    { id: 8, description: "Collect from 5 stations", target: 5, action: "misc", reward: { type: "Coins", amount: 100 } },
    { id: 9, description: "Supply a Tier 2 station", target: 1, action: "misc", reward: { type: "Produce", name: "Bricks" } },
    { id: 10, description: "Harvest a mutated item", target: 1, action: "misc", reward: { type: "Coins", amount: 120 } },
    { id: 11, description: "Change your wall using the Wall Shop", target: 1, action: "misc", reward: { type: "Coins", amount: 120 } },
    { id: 12, description: "Own at least 2 wall types", target: 2, action: "misc", reward: { type: "Produce", name: "Planks" } },
    { id: 13, description: "Equip the Ironwood Fence", target: 1, action: "misc", reward: { type: "Coins", amount: 140 } },
    { id: 14, description: "Unlock a wall from the Wall Shop", target: 1, action: "misc", reward: { type: "Coins", amount: 150 } },
    { id: 15, description: "Buy a villager from the market", target: 1, action: "misc", reward: { type: "Coins", amount: 160 } },
    { id: 16, description: "Attempt to purchase a rare villager", target: 1, action: "misc", reward: { type: "Produce", name: "Crystal" } },
    { id: 17, description: "Use the gift prompt while holding produce", target: 1, action: "misc", reward: { type: "Coins", amount: 180 } },
    { id: 18, description: "Gift a produce to another player", target: 1, action: "misc", reward: { type: "Produce", name: "Berries" } },
    { id: 19, description: "Visit a friend's village", target: 1, action: "misc", reward: { type: "Villager", name: "Woodsman" } },
    { id: 20, description: "Gift a Tier 1 produce item", target: 1, action: "misc", reward: { type: "Coins", amount: 210 } },
    { id: 21, description: "Collect 20 items", target: 20, action: "misc", reward: { type: "Coins", amount: 220 } },
    { id: 22, description: "Be in a server with 3+ players", target: 3, action: "misc", reward: { type: "Coins", amount: 230 } },
    { id: 23, description: "Sell an item worth over $300", target: 1, action: "misc", reward: { type: "Coins", amount: 240 } },
    { id: 24, description: "Fully fill a Tier 2 station queue", target: 1, action: "misc", reward: { type: "Villager", name: "Miner" } },
] as Array<DailyQuestInfo>
export type DailyQuest = DailyQuestInfo;
