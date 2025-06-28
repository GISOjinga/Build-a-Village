import { StarterPack, LaunchPack } from "types/GlobalTypes";

export type RobuxStoreData = {
    StarterPack: StarterPack;
    LaunchPack: LaunchPack;
};

const robuxStoreData: RobuxStoreData = {
    StarterPack: {
        Name: "Starter Pack",
        TimeEnds: os.time() + 24 * 60 * 60,
        ProductId: 0,
        Coins: 1000,
        Villagers: ["Farmer", "Miner", "Baker"],
    },
    LaunchPack: {
        Name: "Launch Pack",
        TimeEnds: os.time() + 7 * 24 * 60 * 60,
        ProductId: 0,
        Villagers: ["Carpenter", "Mason", "Tailor", "Blacksmith", "Steward"],
    },
};

export default robuxStoreData;
