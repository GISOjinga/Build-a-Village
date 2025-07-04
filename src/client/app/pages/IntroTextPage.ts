import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { Players, SoundService, TweenService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";
import { addCommasEveryThreeDigits } from "shared/utils/functions/stringHelp";
import paths from "shared/utils/paths";
import { createTween } from "shared/utils/functions/tweenFunctions";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.2, 1.2);
    const introTextPage = pagePaths.IntroTextPage;

    // when ever notify is called
    introTextPage.Visible = true
    trash.Add(routes.notify.listen(pageStates.introText))

    // loads in each box
    trash.Add(useEffect((newTrash) => {
        const introText = pageStates.introText();
        const textToArray = introText.text.split("");
        const tweenInInfo = new TweenInfo(textToArray.size() * 0.01);
        const tweenOutInfo = new TweenInfo(textToArray.size() * 0.01);
        const tween = newTrash.Add(createTween<number>().Play(0, 1, tweenInInfo), "destroy")

        // moves the intro text char by char
        introTextPage.text.Text = "";

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
            if (introTextPage.text.Text !== full) {
                const typingSound = newTrash.Add(paths.SFX.UI.singletype.Clone())
                typingSound.Parent = SoundService
                typingSound.Play()
            };
            introTextPage.text.Text = (full ?? "")
        }))

        // when the intro text page is visible
        const cleanUp = tween.onComplete(() => {
            cleanUp.Disconnect();
            // tweens to the goal
            newTrash.Add(task.delay(introText.duration, () => {
                tween.Play(1, 0, tweenOutInfo)
                newTrash.Add(() => pageStates.introText({ text: "", duration: 0 }))
                newTrash.Add(tween.onComplete(() => pcall(() => newTrash.Destroy())))
            }));
        })
        newTrash.Add(cleanUp)
    }))

    return trash
}