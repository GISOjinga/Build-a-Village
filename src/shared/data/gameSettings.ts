import { instanceToAttributeTree } from "shared/utils/functions/instanceFunctions";
import paths from "shared/utils/paths";

export default instanceToAttributeTree(paths.GameSettingsConfig).GameSettingsConfig as GameSettings

export type GameSettings = {
    Shop: {
        VillagerShop: {
            RarityAppearChance: {
                Common: number;
                Uncommon: number;
                Rare: number;
                Epic: number;
                Legendary: number;
                Mythic: number;
            };
        };
    };
};