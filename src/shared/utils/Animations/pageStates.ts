import { Atom, atom } from "@rbxts/charm";


const pageStates = {
    openPage: atom("None") as Atom<"Buy" | "Robux" | "None">,
    villagersShop: atom(new Array<VillagerInfo>()),
    buyButtonFocus: atom({ visible: false, selectedVillagerIndex: -1 }),
    totalTimeForNewVillager: atom(0),
}

export type PageStates = typeof pageStates;
export default pageStates