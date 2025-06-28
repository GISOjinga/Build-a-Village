import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { MarketplaceService, Players, TweenService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities, { AddUdim2, SubtractUdim2 } from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.05, 1.05);
    const confirmPage = pagePaths.ConfirmPage
    const goalPosition = confirmPage.Position
    const tweenInPosition = TweenService.Create(confirmPage, new TweenInfo(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), { Position: goalPosition })
    const tweenOutPosition = TweenService.Create(confirmPage, new TweenInfo(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), { Position: AddUdim2(goalPosition, UDim2.fromScale(.5, 0)) })

    // use effect on trash
    trash.Add(useEffect((newTrash) => {
        const confirmInfo = pageStates.confirmPrompt();

        // sets the texts
        confirmPage.title.Text = confirmInfo.title;
        confirmPage.message.Text = confirmInfo.message;

        // if the confirm info is not set then return
        if (confirmInfo.title === "" || confirmInfo.message === "") {
            tweenOutPosition.Play();
            tweenInPosition.Cancel();
        } else {
            tweenInPosition.Play();
            tweenOutPosition.Cancel();
        }
    }));

    // when declined
    trash.Add(UIUtilities.ButtonAction({
        Button: confirmPage.Decline,
        ExpandedSize: UIUtilities.MultiplyUdim2(confirmPage.Decline.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(confirmPage.Decline.Size, sizeOffset),
    }, () => {
        routes.confirmPrompt.send(false)
    }))

    // when clicked on accpect
    trash.Add(UIUtilities.ButtonAction({
        Button: confirmPage.Accept,
        ExpandedSize: UIUtilities.MultiplyUdim2(confirmPage.Accept.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(confirmPage.Accept.Size, sizeOffset),
    }, () => {
        routes.confirmPrompt.send(true)
    }))
    confirmPage.Visible = true;

    return trash
}