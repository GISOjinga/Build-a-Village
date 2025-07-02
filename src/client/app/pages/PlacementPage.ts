import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { MarketplaceService, Players, TweenService, UserInputService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";
import Signal from "@rbxts/signal";




export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const placementPage = pagePaths.PlacementPage
    const sizeOffset = UDim2.fromScale(1.1, 1.1);


    trash.Add(useEffect(() => {
        const openPage = pageStates.openPage()

        // if open page is not Placement then show the page
        placementPage.Visible = openPage === "Placement" || openPage === "Dig"
        placementPage.Placetext.Text = openPage === "Placement" ? "Place" : "Dig"
        placementPage.Placetext.BackgroundColor3 = openPage === "Placement" ? Color3.fromRGB(112, 227, 25) : Color3.fromRGB(227, 26, 26)
        placementPage.Placetext.BorderColor3 = openPage === "Placement" ? Color3.fromRGB(10, 99, 0) : Color3.fromRGB(99, 0, 0)
        placementPage.Placetext.UIStrokeBG.Color = openPage === "Placement" ? Color3.fromRGB(10, 99, 0) : Color3.fromRGB(99, 0, 0)
        placementPage.Placetext.UIStrokeText.Color = openPage === "Placement" ? Color3.fromRGB(10, 99, 0) : Color3.fromRGB(99, 0, 0)
        placementPage.RightPress.Visible = openPage === "Placement"
        placementPage.LeftPress.Visible = openPage === "Placement"
    }))


    // when ever the right press is pressed
    trash.Add(UIUtilities.ButtonAction({
        Button: placementPage.RightPress,
        ExpandedSize: UIUtilities.MultiplyUdim2(placementPage.RightPress.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(placementPage.RightPress.Size, sizeOffset),
    }, () => pageStates.placementRotationOffset((offset) => offset + 90)))

    // when ever the left press is pressed
    trash.Add(UIUtilities.ButtonAction({
        Button: placementPage.LeftPress,
        ExpandedSize: UIUtilities.MultiplyUdim2(placementPage.LeftPress.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(placementPage.LeftPress.Size, sizeOffset),
    }, () => pageStates.placementRotationOffset((offset) => offset - 90)))

    // when the place button is pressed
    trash.Add(UIUtilities.ButtonAction({
        Button: placementPage.Placetext,
        ExpandedSize: UIUtilities.MultiplyUdim2(placementPage.Placetext.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(placementPage.Placetext.Size, sizeOffset),
    }, () => {
        if (pageStates.openPage() === "Placement") {
            pageStates.placeVillager(true)
        } else if (pageStates.openPage() === "Dig") {
            pageStates.digVillager(true)
        }
    }))

    return trash
}