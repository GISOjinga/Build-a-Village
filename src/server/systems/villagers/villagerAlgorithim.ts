import gameSettings from "shared/data/gameSettings";
import ShopData from "./ShopData";
import Object from "@rbxts/object-utils";

const villagersShop = gameSettings.Shop.VillagerShop;

export function getVillagersToRestock(): Array<VillagerNames> {
    const villagersToAdd = new Array<VillagerNames>();
    const allVillagers = ShopData.Villagers;

    allVillagers.forEach((villager) => {
        const rarity = villager.Rarity;
        const appearChance = villagersShop.RarityAppearChance[rarity];

        // If the villager is not in stock, check if it should be added
        if (math.random(1, appearChance) === 1) villagersToAdd.push(villager.Name);
    })

    return villagersToAdd
}