export default {
    Purchase1: {
        Name: "Starter Pack",
        TimeEnds: os.clock() + 1000,
        Villagers: ["Farmer", "Miner", "Blacksmith", "Carpenter", "Baker", "Mason", "Tailor"],
        Pack: {
            Pack1: { PackMultiplier: 1, ProductId: 0 },
            Pack3: { PackMultiplier: 3, ProductId: 0 },
            Pack10: { PackMultiplier: 10, ProductId: 0 },
        },
    },
    Purchase2: {
        Name: "Starter Pack",
        TimeEnds: os.clock() + 1000,
        Villagers: ["Farmer", "Miner", "Blacksmith", "Carpenter", "Baker", "Mason", "Tailor"],
        Pack: {
            Pack1: { PackMultiplier: 1, ProductId: 0 },
            Pack3: { PackMultiplier: 3, ProductId: 0 },
            Pack10: { PackMultiplier: 10, ProductId: 0 },
        },
    },
} satisfies {
    Purchase1: LimitedTimePack,
    Purchase2: LimitedTimePack,
}