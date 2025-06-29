import paths from "shared/utils/paths"

const wallsData = new Array<WallInfo>()

// This is a placeholder for the villagers data.
paths.Assets.Walls.GetChildren().forEach((wall) => {
    wallsData.push({
        Name: wall.Name as WallNames,
        Description: wall.GetAttribute<string>("Description") || "",
        Price: wall.GetAttribute<number>("Price") || 0,
        Image: wall.GetAttribute<string>("Image") || "rbxassetid://1234567890", // Default placeholder image
        GamePassId: wall.GetAttribute<number>("GamePassId") || 0,
        CashMultiplier: wall.GetAttribute<number>("CashMultiplier") || 1,
        Rarity: wall.GetAttribute<WallRarity>("Rarity") || "Common",
        Owned: false,
        Equipped: false,
    } satisfies WallInfo as WallInfo)
})

export default wallsData satisfies Array<WallInfo> as Array<WallInfo>