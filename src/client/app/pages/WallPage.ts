import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { Players, TweenService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";
import { addCommasEveryThreeDigits } from "shared/utils/functions/stringHelp";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.2, 1.2);
    const wallPage = pagePaths.WallPage;
    const scrollingFrame = wallPage.ScrollingFrame;
    const sample = scrollingFrame.Sample;


    // loads in each box
    trash.Add(useEffect((newTrash) => {
        wallPage.Visible = pageStates.openPage() === "Wall";
    }))

    // when ever the walls update
    trash.Add(useEffect((newTrash) => {
        const wallsShop = pageStates.wallsShop();

        // starts off by clearing up the wall shop scrolling frame
        scrollingFrame.GetChildren().forEach((child) => {
            if (child !== sample && child.IsA("Frame")) child.Destroy();
        })

        // loads in each of the walls
        wallsShop.forEach((wallInfo, index) => {
            const wallBox = sample.Clone();
            const sizeOffset = UDim2.fromScale(1.01, 1.01);
            const buyButton = wallBox.buy;

            // set up
            sample.Visible = false
            wallBox.Visible = true;
            wallBox.Name = wallBox.Name;
            wallBox.LayoutOrder = index;
            wallBox.Price.Text = `$${addCommasEveryThreeDigits(wallInfo.Price)}`;
            wallBox.Multiplier.Text = `X${wallInfo.CashMultiplier} CASH GAIN`
            wallBox.SampleName.Text = wallInfo.Name;
            wallBox.Parent = scrollingFrame;

            // binds the focus action
            newTrash.Add(UIUtilities.ButtonAction({
                Button: buyButton,
                ExpandedSize: UIUtilities.MultiplyUdim2(buyButton.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(buyButton.Size, sizeOffset),
            }, () => {
                printTS($line, "buying wall", wallInfo.Name, wallInfo.Price);
            }))
        })
    }))

    return trash
}