import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";




export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.1, 1.1);

    // loops through all the page paths
    for (const [_, page] of pairs(pagePaths)) {
        const closeButton = page.FindFirstChild<GuiButton>("Close")

        // binds an action animation to close the page
        if (closeButton) {
            trash.Add(UIUtilities.ButtonAction({
                Button: closeButton,
                ExpandedSize: UIUtilities.MultiplyUdim2(closeButton.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(closeButton.Size, sizeOffset),
            }, () => {
                pageStates.openPage("None")
            }))
        }
    }


    // binds an action animation to buy
    trash.Add(effect(() => {
        const openPage = pageStates.openPage()

        pagePaths.VillagersPage.Visible = openPage === "Buy"
        pagePaths.RobuxStore.Visible = openPage === "RobuxStore"
        pagePaths.GiftPage.Visible = openPage === "Gift"
        pagePaths.WallPage.Visible = openPage === "Wall"
    }))

    return trash
}