import paths from "shared/utils/paths"

const villagersData = [] as Array<VillagerInfo>

// This is a placeholder for the villagers data.
paths.Assets.Villagers.GetChildren<VillagerModel>().forEach((villager) => {
    villagersData.push({
        Name: villager.Name as VillagerNames,
        Price: villager.GetAttribute<number>("Price") || 0,
        InStock: 0,
        Image: villager.GetAttribute<string>("Image") || "",
        Description: villager.GetAttribute<string>("Description") || "",
        Rarity: villager.GetAttribute<VillagerRarity>("Rarity") || "Common",
        Tier: villager.GetAttribute<number>("Tier") || 1,
        ProductId: villager.GetAttribute<number>("ProductId") || 0,
    })
})

// sorts them by price
villagersData.sort((a, b) => a.Price < b.Price)
export default {
    Villagers: villagersData satisfies Array<VillagerInfo> as Array<VillagerInfo>,
    SellPrice: {
        Farmer: 50,
        Blacksmith: 100,
        Bread: 25,
        Sword: 50,
    } satisfies { [key in (VillagerNames | ProduceNames)]: number },
}