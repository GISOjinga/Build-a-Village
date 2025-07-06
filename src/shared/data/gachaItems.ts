export interface GachaItem {
    Name: string;
    Type: "Villager" | "Wall" | "Produce";
    Weight: number;
}

const gachaItems: Array<GachaItem> = [
    { Name: "Evil Wall", Type: "Wall", Weight: 1 },
    { Name: "Witch", Type: "Villager", Weight: 1 },
    { Name: "Sculptor", Type: "Villager", Weight: 1 },
    { Name: "Castle Wall", Type: "Wall", Weight: 2 },
    { Name: "Beekeeper", Type: "Villager", Weight: 5 },
    { Name: "Honey", Type: "Produce", Weight: 5 },
    { Name: "Potion", Type: "Produce", Weight: 10 },
    { Name: "Alchemist", Type: "Villager", Weight: 10 },
    { Name: "Stone Wall", Type: "Wall", Weight: 15 },
    { Name: "Tailor", Type: "Villager", Weight: 20 },
    { Name: "Book", Type: "Produce", Weight: 20 },
    { Name: "Scribe", Type: "Villager", Weight: 20 },
    { Name: "Log Palisade", Type: "Wall", Weight: 30 },
    { Name: "Sword", Type: "Produce", Weight: 30 },
    { Name: "Blacksmith", Type: "Villager", Weight: 30 },
    { Name: "Carpenter", Type: "Villager", Weight: 40 },
    { Name: "Ironwood Fence", Type: "Wall", Weight: 40 },
    { Name: "Planks", Type: "Produce", Weight: 40 },
    { Name: "Gatherer", Type: "Villager", Weight: 50 },
    { Name: "Bread", Type: "Produce", Weight: 60 },
    { Name: "Baker", Type: "Villager", Weight: 60 },
    { Name: "Woodsman", Type: "Villager", Weight: 70 },
    { Name: "Bricks", Type: "Produce", Weight: 80 },
    { Name: "Mason", Type: "Villager", Weight: 80 },
    { Name: "Shepherd", Type: "Villager", Weight: 90 },
    { Name: "Miner", Type: "Villager", Weight: 100 },
    { Name: "Wheat", Type: "Produce", Weight: 100 },
    { Name: "Farmer", Type: "Villager", Weight: 100 },
    { Name: "Crystal", Type: "Produce", Weight: 150 },
    { Name: "Wooden Fence", Type: "Wall", Weight: 200 },
];

export default gachaItems;
