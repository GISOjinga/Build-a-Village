export type DailyReward =
    | { type: "Coins"; amount: number }
    | { type: "Villager"; name: VillagerNames }
    | { type: "Produce"; name: ProduceNames };

const dailyRewards: Array<DailyReward> = [
    { type: "Coins", amount: 50 },
    { type: "Produce", name: "Wheat" },
    { type: "Coins", amount: 100 },
    { type: "Villager", name: "Farmer" },
    { type: "Produce", name: "Ore" },
    { type: "Coins", amount: 150 },
    { type: "Villager", name: "Miner" },
    { type: "Produce", name: "Bread" },
    { type: "Coins", amount: 200 },
    { type: "Villager", name: "Baker" },
    { type: "Produce", name: "Iron" },
    { type: "Coins", amount: 250 },
    { type: "Villager", name: "Blacksmith" },
    { type: "Produce", name: "Goldified Wheat" },
    { type: "Coins", amount: 300 },
    { type: "Villager", name: "Mason" },
    { type: "Produce", name: "Brick" },
    { type: "Coins", amount: 350 },
    { type: "Villager", name: "Butcher" },
    { type: "Produce", name: "Meat" },
    { type: "Coins", amount: 400 },
    { type: "Villager", name: "Cook" },
    { type: "Produce", name: "Pie" },
    { type: "Coins", amount: 500 },
    { type: "Villager", name: "Legendary Villager" },
    { type: "Produce", name: "Rainbow Produce" },
    { type: "Coins", amount: 600 },
    { type: "Villager", name: "Mythical Villager" },
    { type: "Produce", name: "Random Tier 2 Produce" },
    { type: "Coins", amount: 1000 },
];

export default dailyRewards;
