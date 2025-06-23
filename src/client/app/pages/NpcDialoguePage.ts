import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { Players, SoundService, TweenService } from "@rbxts/services";
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
    const buyProximityPrompt = paths.Map.Shops.WaitForChild("Buy").WaitForChild("Noob").WaitForChild("HumanoidRootPart").WaitForChild("ProximityPrompt") as typeof paths.Map.Shops.Buy.Noob.HumanoidRootPart.ProximityPrompt;
    const sellProximityPrompt = paths.Map.Shops.WaitForChild("Sell").WaitForChild("Noob").WaitForChild("HumanoidRootPart").WaitForChild("ProximityPrompt") as typeof paths.Map.Shops.Sell.Noob.HumanoidRootPart.ProximityPrompt;

    // uses use effect to set the dialogue
    trash.Add(useEffect((newTrash) => {
        const buyTextLabel = dialoguePage.Buy.TextLabel;
        const sellTextLabel = dialoguePage.Sell.TextLabel;
        const npcDialogue = pageStates.npcDialogue();
        const tween = newTrash.Add(createMotion(npcDialogue.target === "None" ? 1 : 0, { start: true }), "destroy")
        const textToArray = (npcDialogue.target === "None" ? buyTextLabel.Text : npcDialogue.text).split("");

        // moves the intro text char by char
        dialoguePage.Enabled = true;
        buyTextLabel.Text = "";
        sellTextLabel.Text = "";
        tween.tween(npcDialogue.target === "None" ? 0 : 1, { time: textToArray.size() * (npcDialogue.target === "None" ? 0.01 : 0.01), style: Enum.EasingStyle.Linear })

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
            if (buyTextLabel.Text !== full) {
                const typingSound = newTrash.Add(paths.SFX.UI.singletype.Clone())
                typingSound.Parent = SoundService
                typingSound.Play()
            };
            buyTextLabel.Text = (full ?? "")
            sellTextLabel.Text = (full ?? "")
        }))

        newTrash.Add(tween.onComplete(() => {
            newTrash.Add(task.delay(1, () => {
                newTrash.Destroy()
                pageStates.openPage(npcDialogue.target)

                // if target is none then hide
                if (npcDialogue.target === "None") {
                    dialoguePage.Sell.Visible = false;
                    dialoguePage.Buy.Visible = false;
                }
            }))
        }))

        // // sets open pages to none
        // if (pageStates.openPage() !== "None" && pageStates.openPage() !== "Sell") {
        //     printTS($line, " CLOSING PAGESSSSSSS");
        //     pageStates.openPage("None")
        // }

        // sets the adornee
        if (npcDialogue.target === "Buy") {
            dialoguePage.Adornee = paths.Map.Shops.Buy.Noob.Head
            buyProximityPrompt.Enabled = false;
            sellProximityPrompt.Enabled = false;
            dialoguePage.Buy.Visible = true;
            dialoguePage.Sell.Visible = false;
        } else if (npcDialogue.target === "Sell") {
            dialoguePage.Adornee = paths.Map.Shops.Sell.Noob.Head
            buyProximityPrompt.Enabled = false;
            sellProximityPrompt.Enabled = false;
            dialoguePage.Sell.Visible = true;
            dialoguePage.Buy.Visible = false;
        } else if (npcDialogue.target === "None") {
            buyProximityPrompt.Enabled = true;
            sellProximityPrompt.Enabled = true;
        }
    }))

    // when open page changes then removed the npc dialogue
    let oldPage: string = "None";
    trash.Add(effect(() => {
        if (oldPage === "Sell" || oldPage === "Buy") pageStates.npcDialogue({ target: "None", text: "" })
        oldPage = pageStates.openPage();
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