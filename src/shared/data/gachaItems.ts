export interface GachaItem {
    Name: string;
    Type: "Villager" | "Wall" | "Produce";
    Weight: number;
}

export default [
    { Name: "Evil Wall", Type: "Wall", Weight: 1000000000 },
    { Name: "Witch", Type: "Villager", Weight: 227584593 },
    { Name: "Sculptor", Type: "Villager", Weight: 227584593 },
    { Name: "Castle Wall", Type: "Wall", Weight: 51794747 },
    { Name: "Beekeeper", Type: "Villager", Weight: 51794747 },
    { Name: "Alchemist", Type: "Villager", Weight: 51794747 },
    { Name: "Stone Wall", Type: "Wall", Weight: 2682696 },
    { Name: "Tailor", Type: "Villager", Weight: 2682696 },
    { Name: "Scribe", Type: "Villager", Weight: 2682696 },
    { Name: "Log Palisade", Type: "Wall", Weight: 138950 },
    { Name: "Crystal", Type: "Produce", Weight: 138950 },
    { Name: "Blacksmith", Type: "Villager", Weight: 138950 },
    { Name: "Honey", Type: "Produce", Weight: 138950 },
    { Name: "Carpenter", Type: "Villager", Weight: 7197 },
    { Name: "Ironwood Fence", Type: "Wall", Weight: 7197 },
    { Name: "Potion", Type: "Produce", Weight: 7197 },
    { Name: "Gatherer", Type: "Villager", Weight: 7197 },
    { Name: "Baker", Type: "Villager", Weight: 373 },
    { Name: "Book", Type: "Produce", Weight: 373 },
    { Name: "Woodsman", Type: "Villager", Weight: 373 },
    { Name: "Sword", Type: "Produce", Weight: 373 },
    { Name: "Mason", Type: "Villager", Weight: 19 },
    { Name: "Planks", Type: "Produce", Weight: 19 },
    { Name: "Bread", Type: "Produce", Weight: 19 },
    { Name: "Shepherd", Type: "Villager", Weight: 19 },
    { Name: "Miner", Type: "Villager", Weight: 10 },
    { Name: "Bricks", Type: "Produce", Weight: 10 },
    { Name: "Farmer", Type: "Villager", Weight: 10 },
    { Name: "Wheat", Type: "Produce", Weight: 10 },
] as Array<GachaItem>;
