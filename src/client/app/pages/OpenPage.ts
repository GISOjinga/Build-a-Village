import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import useEffect from "../hooks/useEffect";
import { TweenService } from "@rbxts/services";




export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.1, 1.1);
    let [robuxStoreDirection, wallDirection] = [1, 1]
    const originalPositions = {
        Gift: pagePaths.GiftPage.Position,
        Wall: pagePaths.WallPage.Position,
        Buy: pagePaths.VillagersPage.Position,
        RobuxStore: pagePaths.RobuxStore.Position,
        Promo: pagePaths.PromoPage.Position,
        DailyRewards: pagePaths.DailyRewardsPage.Position,
    }
    const pageNameToInstance = {
        Gift: pagePaths.GiftPage,
        Wall: pagePaths.WallPage,
        Buy: pagePaths.VillagersPage,
        RobuxStore: pagePaths.RobuxStore,
        Promo: pagePaths.PromoPage,
        DailyRewards: pagePaths.DailyRewardsPage,
    }

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

    trash.Add(useEffect((newTrash) => {
        const openPage = pageStates.openPage()

        // if the page is not open then return
        robuxStoreDirection = openPage === "RobuxStore" ? robuxStoreDirection * -1 : robuxStoreDirection;
        wallDirection = openPage === "Wall" ? wallDirection * -1 : wallDirection;

        // loops through all of them to tween each
        for (const [pageName, page] of pairs(pageNameToInstance)) {
            const originalPagePosition = originalPositions[pageName];
            const closePosition = pageName === "Gift" ? UDim2.fromScale(originalPositions.Gift.X.Scale, 2)
                : pageName === "Buy" ? UDim2.fromScale(originalPositions.Buy.X.Scale, -2)
                    : pageName === "DailyRewards" ? UDim2.fromScale(originalPositions.DailyRewards.X.Scale, -2)
                        : pageName === "RobuxStore" ? UDim2.fromScale(-2 * robuxStoreDirection, originalPositions.RobuxStore.Y.Scale)
                            : pageName === "Wall" ? UDim2.fromScale(-2 * wallDirection, originalPositions.Wall.Y.Scale)
                                : pageName === "Promo" ? UDim2.fromScale(originalPositions.Promo.X.Scale, 2)
                                    : UDim2.fromScale(.5, -2);

            // sets the position of the page
            page.Visible = true;

            // creates a tween to move the page to its position
            newTrash.Add(TweenService.Create(page, new TweenInfo(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), {
                Position: openPage === pageName ? originalPagePosition : closePosition
            })).Play();
        }
    }))

    return trash
}