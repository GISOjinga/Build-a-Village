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





export default (sellPage: DialogueSellUI) => {
    const trash = new Janitor();

    // loops through all the options and when one is pressed then
    sellPage.Frame.GetChildren().forEach((child) => {
        const option = child.Name
        if (child.IsA("Frame")) {
            const hoverButton = child.FindFirstChild<GuiButton>("HoverDetect");

            //if hover button exists then bind the action
            if (hoverButton) {
                trash.Add(UIUtilities.ButtonAction({
                    Button: hoverButton,
                }, () => {
                    printTS($line, "pressed sell option", option);
                }));
            }
        }
    })

    return trash
}