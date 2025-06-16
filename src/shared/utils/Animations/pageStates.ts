import { Atom, atom } from "@rbxts/charm";


const pageStates = {
    openPage: atom("None") as Atom<"Wall" | "Gift" | "Buy" | "RobuxStore" | "None">,
    productToGift: atom(undefined as number | undefined),
    villagersShop: atom(new Array<VillagerInfo>()),
    wallsShop: atom(new Array<WallInfo>()),
    robuxStore: atom(new Array<LimitedTimePack>()),
    buyButtonFocus: atom({ visible: false, selectedVillagerIndex: -1 }),
    totalTimeForNewVillager: atom(0),
    hoverInfo: atom({ visible: false, info: "" }),
    introText: atom({ text: "Welcome to the game!", duration: 2 }),
    coins: atom(0),
}

export type PageStates = typeof pageStates;
export default pageStates