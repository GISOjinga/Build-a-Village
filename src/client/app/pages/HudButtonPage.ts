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
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.HUD.Buy,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.HUD.Buy.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.HUD.Buy.Size, sizeOffset),
    }, () => {
        routes.teleportToShop.send("Buy")
        pageStates.openPage("Buy")
    }))

    // binds an action animation to sell
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.HUD.Sell,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.HUD.Sell.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.HUD.Sell.Size, sizeOffset),
    }, () => {
        routes.teleportToShop.send("Sell")
        pageStates.openPage("None")
    }))

    // binds an action animation to village
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.HUD.Village,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.HUD.Village.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.HUD.Village.Size, sizeOffset),
    }, () => {
        routes.teleportToVillage.send()
        pageStates.openPage("None");
    }))

    // binds an action animation to shop
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.HUD.Shop,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.HUD.Shop.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.HUD.Shop.Size, sizeOffset),
    }, () => {
        pageStates.openPage("RobuxStore");
    }))

    return trash
}