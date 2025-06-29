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
    const buyProximityPrompt = paths.Map.Shops.WaitForChild("King").WaitForChild("Npc").WaitForChild("HumanoidRootPart").WaitForChild("ProximityPrompt") as typeof paths.Map.Shops.King.Npc.HumanoidRootPart.ProximityPrompt;
    const sellProximityPrompt = paths.Map.Shops.WaitForChild("Merchant").WaitForChild("Npc").WaitForChild("HumanoidRootPart").WaitForChild("ProximityPrompt") as typeof paths.Map.Shops.Merchant.Npc.HumanoidRootPart.ProximityPrompt;
    const wallProximityPrompt = paths.Map.Shops.WaitForChild("Architect").WaitForChild("Npc").WaitForChild("HumanoidRootPart").WaitForChild("ProximityPrompt") as typeof paths.Map.Shops.Architect.Npc.HumanoidRootPart.ProximityPrompt;

    // uses use effect to set the dialogue
    trash.Add(useEffect((newTrash) => {
        const buyTextLabel = dialoguePage.Buy.TextLabel;
        const sellTextLabel = dialoguePage.Sell.TextLabel;
        const wallTextLabel = dialoguePage.Wall.TextLabel;
        const npcDialogue = pageStates.npcDialogue();
        const tween = newTrash.Add(createMotion(npcDialogue.target === "None" ? 1 : 0, { start: true }), "destroy")
        const textToArray = (npcDialogue.target === "None" ? buyTextLabel.Text : npcDialogue.text).split("");

        // moves the intro text char by char
        dialoguePage.Enabled = true;
        buyTextLabel.Text = "";
        sellTextLabel.Text = "";
        wallTextLabel.Text = "";
        tween.tween(npcDialogue.target === "None" ? 0 : 1, { time: textToArray.size() * (npcDialogue.target === "None" ? 0.01 : 0.02), style: Enum.EasingStyle.Linear })

        // when the intro text page is visible
        newTrash.Add(tween.onStep((progress) => {
            const transparency = new NumberSequence([
                new NumberSequenceKeypoint(0, 1),
                new NumberSequenceKeypoint(.5, 1 - (progress * .25)),
                new NumberSequenceKeypoint(1, 1)
            ])

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
            wallTextLabel.Text = (full ?? "")
            dialoguePage.Buy.UIGradient.Transparency = transparency
            dialoguePage.Sell.UIGradient.Transparency = transparency
            dialoguePage.Wall.UIGradient.Transparency = transparency
        }))

        newTrash.Add(tween.onComplete(() => {
            newTrash.Add(task.delay(1, () => {
                newTrash.Destroy()
                pageStates.openPage(npcDialogue.target)

                // if target is none then hide
                if (npcDialogue.target === "None") {
                    dialoguePage.Sell.Visible = false;
                    dialoguePage.Buy.Visible = false;
                    dialoguePage.Wall.Visible = false;
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
            dialoguePage.Adornee = paths.Map.Shops.King.Npc.Head
            buyProximityPrompt.Enabled = false;
            sellProximityPrompt.Enabled = false;
            wallProximityPrompt.Enabled = false;
            dialoguePage.Buy.Visible = true;
            dialoguePage.Sell.Visible = false;
            dialoguePage.Wall.Visible = false;
        } else if (npcDialogue.target === "Sell") {
            dialoguePage.Adornee = paths.Map.Shops.Merchant.Npc.Head
            buyProximityPrompt.Enabled = false;
            sellProximityPrompt.Enabled = false;
            wallProximityPrompt.Enabled = false;
            dialoguePage.Sell.Visible = true;
            dialoguePage.Buy.Visible = false;
            dialoguePage.Wall.Visible = false;
        } else if (npcDialogue.target === "Wall") {
            dialoguePage.Adornee = paths.Map.Shops.Architect.Npc.Head
            buyProximityPrompt.Enabled = false;
            sellProximityPrompt.Enabled = false;
            wallProximityPrompt.Enabled = false;
            dialoguePage.Wall.Visible = true;
            dialoguePage.Buy.Visible = false;
            dialoguePage.Sell.Visible = false;
        } else if (npcDialogue.target === "None") {
            buyProximityPrompt.Enabled = true;
            sellProximityPrompt.Enabled = true;
            wallProximityPrompt.Enabled = true;
        }
    }))

    // when open page changes then removed the npc dialogue
    let oldPage: string = "None";
    trash.Add(effect(() => {
        if (oldPage === "Sell" || oldPage === "Buy" || oldPage === "Wall") pageStates.npcDialogue({ target: "None", text: "" })
        oldPage = pageStates.openPage();
    }))

    // watches for route calls
    trash.Add(routes.npcDialogue.listen((newDialogue) => pageStates.npcDialogue(newDialogue)));

    // when the buy button is clicked
    trash.Add(paths.Map.Shops.King.Npc.HumanoidRootPart.ProximityPrompt.Triggered.Connect(() => {
        pageStates.npcDialogue({ target: "Buy", text: "Here are the items for sale!" })
    }))

    // when the sell button is clicked
    trash.Add(paths.Map.Shops.Merchant.Npc.HumanoidRootPart.ProximityPrompt.Triggered.Connect(() => {
        pageStates.npcDialogue({ target: "Sell", text: "Hey! What can i do for ya?" })
    }))

    // when the wall button is clicked
    trash.Add(paths.Map.Shops.Architect.Npc.HumanoidRootPart.ProximityPrompt.Triggered.Connect(() => {
        pageStates.npcDialogue({ target: "Wall", text: "Here are the walls for sale!" })
    }))

    return trash
}