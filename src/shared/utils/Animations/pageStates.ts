import { Atom, atom } from "@rbxts/charm";


const pageStates = {
    openPage: atom("None") as Atom<"Wall" | "Gift" | "Buy" | "RobuxStore" | "None">,
    villagersShop: atom(new Array<VillagerInfo>()),
    wallsShop: atom(new Array<WallInfo>()),
    robuxStore: atom(new Array<LimitedTimePack>()),
    buyButtonFocus: atom({ visible: false, selectedVillagerIndex: -1 }),
    totalTimeForNewVillager: atom(0),
    hoverInfo: atom({ visible: false, info: "" }),
    introText: atom({ text: "Welcome to the game!", duration: 2 }),
}

export type PageStates = typeof pageStates;
export default pageStates