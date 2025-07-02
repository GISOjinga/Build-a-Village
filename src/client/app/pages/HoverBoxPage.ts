import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { Players, TweenService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";





export default (hoverBoxUI: HoverBoxUI) => {
    const trash = new Janitor();

    // loops through all the options and when one is pressed then
    trash.Add(useEffect(() => {
        hoverBoxUI.Enabled = pageStates.hoverInfo().visible
        hoverBoxUI.Frame.TextLabel.Text = pageStates.hoverInfo().info;
    }))

    return trash
}