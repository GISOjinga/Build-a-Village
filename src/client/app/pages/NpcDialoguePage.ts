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
import paths from "shared/utils/paths";
import { createMotion } from "@rbxts/ripple";





export default (dialoguePage: NpcDialogues) => {
    const trash = new Janitor();
    const buyProximityPrompt = paths.Map.Shops.Buy.Noob.HumanoidRootPart.ProximityPrompt;
    const sellProximityPrompt = paths.Map.Shops.Sell.Noob.HumanoidRootPart.ProximityPrompt;

    // uses use effect to set the dialogue
    trash.Add(useEffect((newTrash) => {
        const npcDialogue = pageStates.npcDialogue();
        const introText = pageStates.introText();
        const textToArray = introText.text.split("");
        const tween = newTrash.Add(createMotion(0, { start: true }), "destroy")
        const buyTextLabel = dialoguePage.Buy.TextLabel;
        const sellTextLabel = dialoguePage.Sell.TextLabel;

        // moves the intro text char by char
        buyTextLabel.Text = "";
        sellTextLabel.Text = "";
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
            buyTextLabel.Text = (full ?? "")
            sellTextLabel.Text = (full ?? "")
        }))

        // sets open pages to none
        if (pageStates.openPage() !== "None" && pageStates.openPage() !== "Sell") pageStates.openPage("None")

        // sets the adornee
        if (npcDialogue.target === "Buy") {
            dialoguePage.Adornee = paths.Map.Shops.Buy.Noob.Head
            buyProximityPrompt.Enabled = false;
            sellProximityPrompt.Enabled = false;
        } else if (npcDialogue.target === "Sell") {
            dialoguePage.Adornee = paths.Map.Shops.Sell.Noob.Head
            buyProximityPrompt.Enabled = false;
            sellProximityPrompt.Enabled = false;
        } else if (npcDialogue.target === "None") {
            dialoguePage.Buy.Visible = false;
            dialoguePage.Sell.Visible = false;
            buyProximityPrompt.Enabled = true;
            sellProximityPrompt.Enabled = true;
        }
    }))

    // when open page changes then removed the npc dialogue
    trash.Add(effect(() => {
        if (pageStates.openPage() === "None" || pageStates.openPage() === "Sell") return
        pageStates.npcDialogue({ target: "None", text: "" });
    }))

    // watches for route calls
    trash.Add(routes.npcDialogue.listen((newDialogue) => pageStates.npcDialogue(newDialogue)));

    // when the buy button is clicked
    trash.Add(paths.Map.Shops.Buy.Noob.HumanoidRootPart.ProximityPrompt.Triggered.Connect(() => {
        pageStates.npcDialogue({ target: "Buy", text: "Here are the items for sale!" })
    }))

    // when the sell button is clicked
    trash.Add(paths.Map.Shops.Sell.Noob.HumanoidRootPart.ProximityPrompt.Triggered.Connect(() => {
        pageStates.npcDialogue({ target: "Sell", text: "Hey! What can i do for ya?" })
    }))

    return trash
}