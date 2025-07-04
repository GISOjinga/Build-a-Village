export type DailyReward =
    | { type: "Coins"; amount: number }
    | { type: "Villager"; name: VillagerNames }
    | { type: "Produce"; name: ProduceNames };


export default [
    { type: "Coins", amount: 50 },
    { type: "Produce", name: "Wheat" },
    { type: "Coins", amount: 100 },
    { type: "Villager", name: "Farmer" },
    { type: "Produce", name: "Log" },
    { type: "Coins", amount: 150 },
    { type: "Villager", name: "Miner" },
    { type: "Produce", name: "Bread" },
    { type: "Coins", amount: 200 },
    { type: "Villager", name: "Baker" },
    { type: "Produce", name: "Iron" },
    { type: "Coins", amount: 250 },
    { type: "Villager", name: "Blacksmith" },
    { type: "Produce", name: "Bricks" },
    { type: "Coins", amount: 300 },
    { type: "Villager", name: "Mason" },
    { type: "Produce", name: "Crystal" },
    { type: "Coins", amount: 350 },
    { type: "Villager", name: "Woodsman" },
    { type: "Produce", name: "Planks" },
    { type: "Coins", amount: 400 },
    { type: "Villager", name: "Carpenter" },
    { type: "Produce", name: "Honey" },
    { type: "Coins", amount: 500 },
    { type: "Villager", name: "Witch" },
    { type: "Produce", name: "Berries" },
    { type: "Coins", amount: 600 },
    { type: "Villager", name: "Alchemist" },
    { type: "Produce", name: "Potion" },
    { type: "Coins", amount: 1000 },
] as Array<DailyReward>;
