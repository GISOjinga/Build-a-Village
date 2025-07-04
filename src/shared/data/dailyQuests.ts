export type DailyQuestInfo = {
    id: number;
    description: string;
    target: number;
    action: "collect" | "place" | "dig" | "supply" | "sell" | "gift" | "misc";
    reward: number;
};

const dailyQuests: Array<DailyQuestInfo> = [
    { id: 1, description: "Collect 3 wheat from a Farmer", target: 3, action: "collect", reward: 50 },
    { id: 2, description: "Deliver 2 wheat to a Baker", target: 2, action: "supply", reward: 60 },
    { id: 3, description: "Collect 4 ore from a Miner", target: 4, action: "collect", reward: 70 },
    { id: 4, description: "Use the Sell NPC to sell inventory", target: 1, action: "sell", reward: 80 },
    { id: 5, description: "Use \"Check Item Value\" on produce", target: 1, action: "misc", reward: 80 },
    { id: 6, description: "Wake 2 sleeping villagers", target: 2, action: "misc", reward: 90 },
    { id: 7, description: "Hold a Rainbow item", target: 1, action: "misc", reward: 90 },
    { id: 8, description: "Use E to collect from 5 stations", target: 5, action: "collect", reward: 100 },
    { id: 9, description: "Supply a Tier 2 station with produce", target: 1, action: "supply", reward: 110 },
    { id: 10, description: "Harvest a mutated item", target: 1, action: "collect", reward: 120 },
    { id: 11, description: "Change your wall using the Wall Shop", target: 1, action: "misc", reward: 120 },
    { id: 12, description: "Sell produce with Iron or better wall", target: 1, action: "sell", reward: 130 },
    { id: 13, description: "Own at least 2 wall types", target: 2, action: "misc", reward: 130 },
    { id: 14, description: "Equip the Gold Wall", target: 1, action: "misc", reward: 140 },
    { id: 15, description: "Unlock a wall from the Wall Shop", target: 1, action: "misc", reward: 150 },
    { id: 16, description: "Buy a villager from the market", target: 1, action: "misc", reward: 160 },
    { id: 17, description: "Use Robux to refresh the shop", target: 1, action: "misc", reward: 170 },
    { id: 18, description: "Attempt to purchase a rare villager", target: 1, action: "misc", reward: 170 },
    { id: 19, description: "Gift a villager to another player", target: 1, action: "gift", reward: 180 },
    { id: 20, description: "Use the gift prompt while holding produce", target: 1, action: "gift", reward: 180 },
    { id: 21, description: "Gift a tool to another player", target: 1, action: "gift", reward: 190 },
    { id: 22, description: "Receive a gifted villager", target: 1, action: "misc", reward: 190 },
    { id: 23, description: "Visit a friend's village", target: 1, action: "misc", reward: 200 },
    { id: 24, description: "Trade a Tier 1 produce item", target: 1, action: "gift", reward: 210 },
    { id: 25, description: "Help a friend by supplying their station", target: 1, action: "supply", reward: 210 },
    { id: 26, description: "Use the E key 20 times", target: 20, action: "collect", reward: 220 },
    { id: 27, description: "Claim 3 daily rewards in a row", target: 3, action: "misc", reward: 230 },
    { id: 28, description: "Be in a server with 3+ players", target: 3, action: "misc", reward: 230 },
    { id: 29, description: "Sell an item worth over $300", target: 1, action: "sell", reward: 240 },
    { id: 30, description: "Fully fill a Tier 2 station queue", target: 1, action: "supply", reward: 250 },
];

export default dailyQuests;
export type DailyQuest = DailyQuestInfo;
