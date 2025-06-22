export default {
    Purchase1: {
        Name: "Starter Pack",
        TimeEnds: os.clock() + 1000,
        Villagers: ["Farmer", "Miner", "Blacksmith", "Carpenter", "Baker", "Herbalist", "Tailor"],
        Pack: {
            Pack1: { Amount: 1, ProductId: 0 },
            Pack3: { Amount: 3, ProductId: 0 },
            Pack10: { Amount: 10, ProductId: 0 },
        },
    },
    Purchase2: {
        Name: "Starter Pack",
        TimeEnds: os.clock() + 1000,
        Villagers: ["Farmer", "Miner", "Blacksmith", "Carpenter", "Baker", "Herbalist", "Tailor"],
        Pack: {
            Pack1: { Amount: 1, ProductId: 0 },
            Pack3: { Amount: 3, ProductId: 0 },
            Pack10: { Amount: 10, ProductId: 0 },
        },
    },
} satisfies {
    Purchase1: LimitedTimePack,
    Purchase2: LimitedTimePack,
}