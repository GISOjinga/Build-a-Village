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
    const robuxStorePage = pagePaths.RobuxStore;
    const scrollingFrame = robuxStorePage.ScrollingFrame;
    type Sample = typeof scrollingFrame.Purchase1


    // // loads in each box
    // trash.Add(useEffect(() => {
    //     robuxStorePage.Visible = pageStates.openPage() === "RobuxStore";
    // }))

    // // when ever the walls update
    // scrollingFrame.GetChildren<Sample>().forEach((child: Sample) => {
    //     if (child.IsA("Frame")) {

    //     }
    // })

    return trash
}