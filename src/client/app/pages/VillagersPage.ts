import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { MarketplaceService, Players, TweenService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";
import paths from "shared/utils/paths";


const formatDuration = (totalSeconds: number) => {
    //Handle negative durations by converting to positive
    if (totalSeconds < 0) totalSeconds = -totalSeconds

    //Calculate each unit
    const secondsInMinute = 60
    const secondsInHour = 60 * secondsInMinute
    const secondsInDay = 24 * secondsInHour
    const secondsInMonth = 30 * secondsInDay// approximate month

    const months = math.floor(totalSeconds / secondsInMonth)
    const days = math.floor((totalSeconds % secondsInMonth) / secondsInDay)
    const hours = math.floor((totalSeconds % secondsInDay) / secondsInHour)
    const minutes = math.floor((totalSeconds % secondsInHour) / secondsInMinute)
    const seconds = math.floor(totalSeconds % secondsInMinute)

    //Build parts in order, skipping zero values except seconds
    const parts = new Array<string>();
    if (months > 0) { parts.push(months + "mo") }
    if (days > 0) { parts.push(days + "d") }
    if (hours > 0) { parts.push(hours + "h") }
    if (minutes > 0) { parts.push(minutes + "m") }
    parts.push(seconds + "s")

    //Concatenate with spaces
    return parts.reduce((newString, oldString) => newString + " " + oldString)
}

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.05, 1.05);
    const villagersContent = pagePaths.VillagersPage.ScrollingFrame;
    const buyButton = villagersContent.Buy;
    const buyButtonGoalSize = buyButton.Size
    const exampleBox = villagersContent.Sample
    const buyButtonTweenInfo = new TweenInfo(0.3, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out)

    // sets the buy button size to be invisible
    pagePaths.VillagersPage.Visible = true;
    exampleBox.Visible = false;
    buyButton.Size = UDim2.fromScale(0, 0);
    buyButton.Visible = true;

    // when restock is pressed
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.VillagersPage.ReStock,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.VillagersPage.ReStock.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.VillagersPage.ReStock.Size, sizeOffset),
    }, () => {
        MarketplaceService.PromptProductPurchase(Players.LocalPlayer, 3308848691)
    }))

    // loads in each box
    trash.Add(useEffect((newTrash) => {
        const villagersShop = pageStates.villagersShop();
        const buyButtonFocus = pageStates.buyButtonFocus();
        // cleans up the old ones
        villagersContent.GetChildren().forEach((child) => {
            if (child.IsA("ImageButton") && child !== buyButton && child !== exampleBox) {
                child.SetAttribute("InUse", false);
            }
        })

        // loads them in
        villagersShop.forEach((villagerInfo, index) => {
            const villagerBox = villagersContent.FindFirstChild<typeof exampleBox>(villagerInfo.Name) || exampleBox.Clone();
            const sizeOffset = UDim2.fromScale(1.01, 1.01);
            const rarityImage = villagerBox.FindFirstChild("Rarity" + villagerInfo.Rarity) as ImageLabel | undefined;
            const villagerRenderViewPort = paths.Assets.UI.VillagerRenders.FindFirstChild(villagerInfo.Name)?.Clone() as ViewportFrame | undefined;

            // set up
            villagerBox.SetAttribute("InUse", true);
            villagerBox.Visible = true;
            villagerBox.Name = villagerInfo.Name;
            villagerBox.LayoutOrder = (index + 1) * 2;
            villagerBox.Price.Text = `$${villagerInfo.Price}`;
            villagerBox.Stock.Text = `x${villagerInfo.InStock} stock`
            villagerBox.VillagerName.Text = villagerInfo.Name;
            villagerBox.Tier.Text = `Tier ${villagerInfo.Tier}`;
            villagerBox.Parent = villagersContent;

            // sets the rarity
            if (rarityImage) rarityImage.Visible = true;

            // sets up the view port
            if (villagerRenderViewPort) {
                villagerRenderViewPort.Visible = true;
                villagerRenderViewPort.Parent = villagerBox.VillagerViewPort
            }

            // binds the focus action
            newTrash.Add(UIUtilities.ButtonAction({
                Button: villagerBox,
                ExpandedSize: UIUtilities.MultiplyUdim2(villagerBox.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(villagerBox.Size, UDim2.fromScale(1.08, 1.08)),
            }, () => {
                pageStates.buyButtonFocus({
                    visible: (buyButtonFocus.selectedVillagerIndex === index && buyButtonFocus.visible) ? false : true,
                    selectedVillagerIndex: index, // +1 to account for the example box
                })
            }))
        })

        villagersContent.GetChildren().forEach((child) => {
            if (child.IsA("ImageButton") && child !== buyButton && child !== exampleBox && !child.GetAttribute("InUse")) child.Destroy();
        })

    }))


    // updates the buy button visibility
    trash.Add(useEffect((newTrash) => {
        const buyButtonFocus = pageStates.buyButtonFocus();
        const tween = newTrash.Add(TweenService.Create(buyButton, buyButtonTweenInfo, {
            BorderSizePixel: buyButtonFocus.visible ? 4 : 0,
            Size: buyButtonFocus.visible ? buyButtonGoalSize : UDim2.fromScale(0, -0.01),
        }))

        // tweens the shadow holder
        newTrash.Add(TweenService.Create(buyButton.bg, buyButtonTweenInfo, {
            ImageTransparency: buyButtonFocus.visible ? 0 : 1,
        })).Play();
        // buyButton.shadowHolder.Visible = buyButtonFocus.visible;

        // toggles all ui strokes
        buyButton.GetDescendants().forEach((descendant) => {
            if (descendant.IsA("UIStroke")) {
                const originalThickness = descendant.GetAttribute<number>("OriginalThickness") || descendant.Thickness;

                // sets the original thickness
                descendant.SetAttribute("OriginalThickness", originalThickness);
                trash.Add(TweenService.Create(descendant, buyButtonTweenInfo, {
                    Thickness: buyButtonFocus.visible ? originalThickness : 0,
                })).Play();
            }
        })

        // updates the visibility of the buy button
        buyButton.LayoutOrder = (((buyButtonFocus.selectedVillagerIndex ?? -1) + 1) * 2) + 1;
        buyButton.Size = buyButtonFocus.visible ? UDim2.fromScale(0, 0) : buyButtonGoalSize;
        tween.Play();
    }))

    // when ever the robux or buy coins get pressed
    trash.Add(useEffect((newTrash) => {
        const buyButtonFocus = pageStates.buyButtonFocus();
        const villagersShop = pageStates.villagersShop();
        const villagerInfo = villagersShop[buyButtonFocus.selectedVillagerIndex];

        // updates the villager info box
        if (villagerInfo) {
            trash.Add(task.spawn(() => {
                const [passed, productInfo] = pcall(() => MarketplaceService.GetProductInfo(villagerInfo.ProductId, Enum.InfoType.Product));
                buyButton.Robux.Text = `${passed ? productInfo.PriceInRobux : 0}`;
                // if (!passed) printTS($line, "Failed to get product info for villager", villagerInfo.Name, ":", productInfo);
            }))

            buyButton.Normal.Visible = villagerInfo.InStock > 0 ? true : false;
            buyButton.Normal.Text = `$${villagerInfo.Price}`;

            // when buying with coins
            newTrash.Add(UIUtilities.ButtonAction({
                Button: buyButton.Normal,
                ExpandedSize: UIUtilities.MultiplyUdim2(buyButton.Normal.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(buyButton.Normal.Size, sizeOffset),
            }, () => {
                routes.buyVillager.send({
                    villagerIndex: buyButtonFocus.selectedVillagerIndex,
                    currency: "Coins",
                })
            }))

            // when buying with robux
            newTrash.Add(UIUtilities.ButtonAction({
                Button: buyButton.Robux,
                ExpandedSize: UIUtilities.MultiplyUdim2(buyButton.Robux.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(buyButton.Robux.Size, sizeOffset),
            }, () => {
                routes.buyVillager.send({
                    villagerIndex: buyButtonFocus.selectedVillagerIndex,
                    currency: "Robux",
                })
            }))

            // request to buy
            newTrash.Add(UIUtilities.ButtonAction({
                Button: buyButton.Gift,
                ExpandedSize: UIUtilities.MultiplyUdim2(buyButton.Gift.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(buyButton.Gift.Size, sizeOffset),
            }, () => {
                pageStates.productToGift(villagerInfo.ProductId);
                pageStates.openPage("Gift");
            }))
        }
    }))

    // any time totalTimeForNewVillager changes, we update the time
    trash.Add(task.spawn(() => {
        while (true) {
            const totalTimeForNewVillager = pageStates.totalTimeForNewVillager();
            const formattedTime = formatDuration(totalTimeForNewVillager);

            // updates the countdown text in a formated way
            pagePaths.VillagersPage.Countdown.Text = `New Villagers in ${formattedTime}`;
            task.wait(1)
        }
    }))

    return trash
}