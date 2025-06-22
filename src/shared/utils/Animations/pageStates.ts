import { Atom, atom } from "@rbxts/charm";
import robuxStoreData from "shared/data/robuxStoreData";


const pageStates = {
    placementOffset: atom(0),
    placeVillager: atom(false),
    digVillager: atom(false),
    openPage: atom("None") as Atom<"Placement" | "Dig" | "Wall" | "Gift" | "Buy" | "RobuxStore" | "Sell" | "None">,
    productToGift: atom(undefined as number | undefined),
    villagersShop: atom(new Array<VillagerInfo>()),
    wallsShop: atom(new Array<WallInfo>()),
    robuxStore: atom(robuxStoreData),
    buyButtonFocus: atom({ visible: false, selectedVillagerIndex: -1 }),
    totalTimeForNewVillager: atom(0),
    hoverInfo: atom({ visible: false, info: "" }),
    introText: atom({ text: "Welcome to the game!", duration: 2 }),
    npcDialogue: atom({ target: "None" as "Buy" | "Sell" | "None", text: "" }),
    coins: atom(0),
}

export type PageStates = typeof pageStates;
export default pageStates