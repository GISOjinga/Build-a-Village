import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { TweenService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";


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
    buyButton.Size = UDim2.fromScale(0, 0);
    buyButton.Visible = true;

    // when restock is pressed
    trash.Add(UIUtilities.ButtonAction({
        Button: pagePaths.VillagersPage.ReStock,
        ExpandedSize: UIUtilities.MultiplyUdim2(pagePaths.VillagersPage.ReStock.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(pagePaths.VillagersPage.ReStock.Size, sizeOffset),
    }, () => {

    }))

    // loads in each box
    trash.Add(useEffect((newTrash) => {
        const villagersShop = pageStates.villagersShop();
        const buyButtonFocus = pageStates.buyButtonFocus();

        // cleans up the old ones
        villagersContent.GetChildren().forEach((child) => {
            if (child.IsA("ImageButton") && child !== buyButton && child !== exampleBox) child.Destroy();
        })

        // loads them in
        villagersShop.forEach((villagerInfo, index) => {
            const villagerBox = exampleBox.Clone();
            const sizeOffset = UDim2.fromScale(1.01, 1.01);

            // set up
            villagerBox.Visible = true;
            villagerBox.Name = villagerInfo.Name;
            villagerBox.LayoutOrder = (index + 1) * 2;
            villagerBox.Price.Text = `$${villagerInfo.Price}`;
            villagerBox.Stock.Text = `x${villagerInfo.InStock} stock`
            villagerBox.VillagerName.Text = villagerInfo.Name;
            // villagerBox.VillagerViewPort.Image = villagerInfo.Image;
            // villagerBox.RarityCommon.Image = villagerInfo.RarityImage;
            villagerBox.Tier.Text = `Tier ${villagerInfo.Tier}`;
            villagerBox.Parent = villagersContent;

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
    }))


    // updates the buy button visibility
    trash.Add(useEffect((newTrash) => {
        const buyButtonFocus = pageStates.buyButtonFocus();
        const tween = newTrash.Add(TweenService.Create(buyButton, buyButtonTweenInfo, {
            BorderSizePixel: buyButtonFocus.visible ? 4 : 0,
            Size: buyButtonFocus.visible ? buyButtonGoalSize : UDim2.fromScale(0, -0.01),
        }))

        // tweens the shadow holder
        buyButton.shadowHolder.Visible = buyButtonFocus.visible;

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
            buyButton.Nomral.Text = `$${villagerInfo.Price}`;
            buyButton.Robux.Text = tostring(villagerInfo.Robux);

            // when buying with coins
            newTrash.Add(UIUtilities.ButtonAction({
                Button: buyButton.Nomral,
                ExpandedSize: UIUtilities.MultiplyUdim2(buyButton.Nomral.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(buyButton.Nomral.Size, sizeOffset),
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
        }
    }))

    // any time totalTimeForNewVillager changes, we update the time
    trash.Add(useEffect(() => {
        const totalTimeForNewVillager = pageStates.totalTimeForNewVillager();
        const formattedTime = formatDuration(totalTimeForNewVillager);

        // updates the countdown text in a formated way
        pagePaths.VillagersPage.Countdown.Text = `New Villagers in ${formattedTime}`;
    }))

    // when ever the villagers get updated by the route then
    trash.Add(routes.updateVillagersShop.listen(pageStates.villagersShop))

    return trash
}