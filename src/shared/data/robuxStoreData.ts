export type RobuxStoreData = {
    StarterPack: StarterShopPack;
    LaunchPack: LaunchShopPack;
};

const robuxStoreData: RobuxStoreData = {
    StarterPack: {
        Name: "Starter Pack",
        TimeEnds: os.time() + 24 * 60 * 60,
        ProductId: 3319212062,
        Coins: 1000,
        Villagers: ["Farmer", "Miner", "Baker"],
    },
    LaunchPack: {
        Name: "Launch Pack",
        TimeEnds: os.time() + 7 * 24 * 60 * 60,
        ProductId: 3319212063,
        Villagers: ["Carpenter", "Mason", "Tailor", "Blacksmith", "Blacksmith"],
    },
};

export default robuxStoreData;
