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
import { createMotion, tween } from "@rbxts/ripple";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.2, 1.2);
    const introTextPage = pagePaths.IntroTextPage;

    // loads in each box
    trash.Add(useEffect((newTrash) => {
        const introText = pageStates.introText();
        const textToArray = introText.text.split("");
        const tween = newTrash.Add(createMotion(0, { start: true }), "destroy")

        // moves the intro text char by char
        introTextPage.text.Text = "";
        tween.tween(1, { time: textToArray.size() * 0.01, style: Enum.EasingStyle.Linear })

        // when the intro text page is visible
        newTrash.Add(tween.onStep((progress) => {
            let full = ""
            for (let i = 0; i < math.floor(textToArray.size() * progress); i++) {
                if (i < math.floor(textToArray.size() * progress)) {
                    full += textToArray[i];
                } else {
                    full += " ";
                }
            }
            introTextPage.text.Text = (full ?? "")
        }))

        // when the intro text page is visible
        newTrash.Add(tween.onComplete(() => {
            // tweens to the goal
            newTrash.Add(task.delay(introText.duration, () => {
                tween.tween(0, { time: textToArray.size() * 0.01, style: Enum.EasingStyle.Linear })
            }));
        }))
    }))

    return trash
}