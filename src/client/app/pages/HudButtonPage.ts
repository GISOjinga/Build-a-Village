import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";




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
    }))

    // binds an action animation to sell
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.HUD.Sell,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.HUD.Sell.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.HUD.Sell.Size, sizeOffset),
    }, () => {
        routes.teleportToShop.send("Sell")
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

    // binds the wall button to open the shop
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.HUD.Walls,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.HUD.Walls.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.HUD.Walls.Size, sizeOffset),
    }, () => {
        routes.teleportToShop.send("Wall")
    }))

    // updates your coins
    trash.Add(useEffect((newTrash) => {
        const newPrice = pageStates.coins()
        const [oldPriceString] = pagePaths.Page.Playercash.Text.gsub("%$", "")
        let oldPrice = tonumber(oldPriceString) || 0;

        // tweens the price
        pagePaths.Page.Playercash.SetAttribute("Coins", newPrice);
        newTrash.Add(task.spawn(() => {
            while (oldPrice !== newPrice) {
                const directionToNewPrice = newPrice - oldPrice > 0 ? 1 : -1;
                oldPrice += math.floor(directionToNewPrice * math.max(1, math.abs(newPrice - oldPrice) / 10));
                pagePaths.Page.Playercash.Text = `$${oldPrice}`;
                task.wait(0.01);
            }
        }))
    }));

    return trash
}