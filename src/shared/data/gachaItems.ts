export interface GachaItem {
    Name: string;
    Type: "Villager" | "Wall" | "Produce";
    Weight: number;
}

export default [
    { Name: "Evil Wall", Type: "Wall", Weight: 8474576271 },
    { Name: "Witch", Type: "Villager", Weight: 8455230 },
    { Name: "Sculptor", Type: "Villager", Weight: 2959342 },
    { Name: "Castle Wall", Type: "Wall", Weight: 1691052 },
    { Name: "Beekeeper", Type: "Villager", Weight: 1268289 },
    { Name: "Honey", Type: "Produce", Villager: "Beekeeper", Weight: 1268289 },
    { Name: "Potion", Type: "Produce", Villager: "Alchemist", Weight: 422764 },
    { Name: "Alchemist", Type: "Villager", Weight: 422764 },
    { Name: "Stone Wall", Type: "Wall", Weight: 253659 },
    { Name: "Tailor", Type: "Villager", Weight: 152196 },
    { Name: "Book", Type: "Produce", Villager: "Scribe", Weight: 50733 },
    { Name: "Scribe", Type: "Villager", Weight: 50733 },
    { Name: "Log Palisade", Type: "Wall", Weight: 42278 },
    { Name: "Sword", Type: "Produce", Villager: "Blacksmith", Weight: 20294 },
    { Name: "Blacksmith", Type: "Villager", Weight: 20294 },
    { Name: "Carpenter", Type: "Villager", Weight: 8457 },
    { Name: "Ironwood Fence", Type: "Wall", Weight: 8457 },
    { Name: "Planks", Type: "Produce", Villager: "Carpenter", Weight: 8457 },
    { Name: "Gatherer", Type: "Villager", Weight: 3384 },
    { Name: "Bread", Type: "Produce", Villager: "Baker", Weight: 1270 },
    { Name: "Baker", Type: "Villager", Weight: 1270 },
    { Name: "Woodsman", Type: "Villager", Weight: 509 },
    { Name: "Bricks", Type: "Produce", Villager: "Mason", Weight: 255 },
    { Name: "Mason", Type: "Villager", Weight: 255 },
    { Name: "Shepherd", Type: "Villager", Weight: 129 },
    { Name: "Miner", Type: "Villager", Weight: 52 },
    { Name: "Wheat", Type: "Produce", Villager: "Farmer", Weight: 27 },
    { Name: "Farmer", Type: "Villager", Weight: 27 },
    { Name: "Crystal", Type: "Produce", Weight: 3 },
    { Name: "Wooden Fence", Type: "Wall", Weight: 2 },
] as Array<GachaItem>;
