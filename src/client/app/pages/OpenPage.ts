import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";




export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.05, 1.05);


    // binds an action animation to buy
    trash.Add(effect(() => {
        const openPage = pageStates.openPage()

        pagePaths.VillagersPage.Visible = openPage === "Buy"
        pagePaths.RobuxStore.Visible = openPage === "Robux"
    }))

    return trash
}