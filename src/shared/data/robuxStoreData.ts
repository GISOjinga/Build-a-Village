export type RobuxStoreData = {
    StarterPack: StarterShopPack;
    LaunchPack: LaunchShopPack;
};

export const WEEK_LENGTH = 7 * 24 * 60 * 60;

const robuxStoreData: RobuxStoreData = {
    StarterPack: {
        Name: "Starter Pack",
        ProductId: 1285438020,
        Coins: 1000,
        Villagers: ["Farmer", "Miner", "Baker"],
    },
    LaunchPack: {
        Name: "Launch Pack",
        ProductId: 1283646112,
        Villagers: ["Carpenter", "Mason", "Tailor", "Blacksmith", "Blacksmith"],
    },
};

export default robuxStoreData;
