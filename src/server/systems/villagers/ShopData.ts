import paths from "shared/utils/paths"

const villagersData = [] as Array<VillagerInfo>
const sellPricesData = {} as { [key in (VillagerNames | ProduceNames)]: number }

// This is a placeholder for the villagers data.
paths.Assets.Villagers.GetChildren<VillagerModel>().forEach((villager) => {
    const sellPrice = villager.GetAttribute<number>("Price") || 0

    sellPricesData[villager.Name as VillagerNames] = sellPrice
    villagersData.push({
        Name: villager.Name as VillagerNames,
        Price: sellPrice,
        InStock: 0,
        Image: villager.GetAttribute<string>("Image") || "",
        Description: villager.GetAttribute<string>("Description") || "",
        Rarity: villager.GetAttribute<VillagerRarity>("Rarity") || "Common",
        Tier: villager.GetAttribute<number>("Tier") || 1,
        ProductId: villager.GetAttribute<number>("ProductId") || 0,
    })
})


// loops through tools in assets to set the sell prices
paths.Assets.Tools.Produce.GetChildren<Tool>().forEach((tool) => {
    sellPricesData[tool.Name as ProduceNames] = tool.GetAttribute<number>("Price") || 0
})

// sorts them by price
villagersData.sort((a, b) => a.Price < b.Price)
export default {
    Villagers: villagersData satisfies Array<VillagerInfo> as Array<VillagerInfo>,
    SellPrice: sellPricesData,
}