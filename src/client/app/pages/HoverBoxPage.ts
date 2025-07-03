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
    const queueLabel = hoverBoxUI.Frame.FindFirstChild("QueueLabel") as TextLabel | undefined;

    // if queue label does not exist create a small one under the main text label
    if (!queueLabel) {
        const newLabel = new Instance("TextLabel");
        newLabel.Name = "QueueLabel";
        newLabel.Size = UDim2.fromScale(1, 0.4);
        newLabel.Position = UDim2.fromScale(0, 1);
        newLabel.BackgroundTransparency = 1;
        newLabel.TextScaled = true;
        newLabel.Font = hoverBoxUI.Frame.TextLabel.Font;
        newLabel.TextColor3 = hoverBoxUI.Frame.TextLabel.TextColor3;
        newLabel.TextStrokeTransparency = hoverBoxUI.Frame.TextLabel.TextStrokeTransparency;
        newLabel.Parent = hoverBoxUI.Frame;
    }
    const queue = (queueLabel || hoverBoxUI.Frame.FindFirstChild("QueueLabel") as TextLabel);

    // loops through all the options and when one is pressed then
    trash.Add(useEffect(() => {
        hoverBoxUI.Enabled = pageStates.hoverInfo().visible
        hoverBoxUI.Frame.TextLabel.Text = pageStates.hoverInfo().info;
        queue.Text = pageStates.queueInfo();
        queue.Visible = pageStates.queueInfo() !== "";
    }))

    return trash
}