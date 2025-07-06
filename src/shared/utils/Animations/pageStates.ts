import { Atom, atom } from "@rbxts/charm";
import robuxStoreData from "shared/data/robuxStoreData";


const pageStates = {
    placementRotationOffset: atom(0),
    placeVillager: atom(false),
    digVillager: atom(false),
    openPage: atom("None") as Atom<"Placement" | "Dig" | "Wall" | "Gift" | "Buy" | "RobuxStore" | "Promo" | "Sell" | "Inventory" | "None">,
    confirmPrompt: atom({ title: "", message: "" }),
    productToGift: atom(undefined as number | undefined),
    villagersShop: atom(new Array<VillagerInfo>()),
    wallsShop: atom(new Array<WallInfo>()),
    robuxStore: atom(robuxStoreData),
    buyButtonFocus: atom({ visible: false, selectedVillagerIndex: -1 }),
    totalTimeForNewVillager: atom(0),
    hoverInfo: atom({ visible: false, info: "" }),
    queueInfo: atom(""),
    inventoryTools: atom(new Array<Tool>()),
    hotBarTools: atom({
        0: undefined,
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
    } as Record<number, Tool | undefined>),
    isDragging: atom(false),
    introText: atom({ text: "Welcome to the game!", duration: 2 }),
    npcDialogue: atom({ target: "None" as "Buy" | "Sell" | "Wall" | "None", text: "" }),
    coins: atom(0),
    friendsBonus: atom(false),
}

export type PageStates = typeof pageStates;
export default pageStates
