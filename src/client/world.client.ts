import { setupMatter } from "shared/utils/jecs/jecsSetup";
import { ContextActionService } from "@rbxts/services";
import modelDebugger from "shared/systems/modelDebugger";
import commandarClient from "./systems/commands/commandarClient";
import emitParticles from "./systems/particles/emitParticles";
import updateCooldown from "shared/systems/cooldown/updateCountDown";
import increaseParticlesSize from "./systems/particles/increaseParticlesSize";
import followInstance from "./systems/physics/followInstance";
import updateMovers from "shared/systems/movers/updateMovers";
import jabby from "@rbxts/jabby";
import change from "shared/systems/hooks/change";
import recieveFromServer from "./systems/componentReplication/recieveFromServer";
import { Players } from "@rbxts/services"
import { createPortal, createRoot } from "@rbxts/react-roblox"
import React, { StrictMode } from "@rbxts/react"
import { ReflexProvider } from "@rbxts/react-reflex"
import watchRoutes from "shared/systems/hooks/watchRoutes";
import append from "shared/systems/hooks/append";
import bodyUpdate from "./systems/body/bodyUpdate";
import setAnimation from "shared/systems/animator/setAnimation";
import loadAnimations from "shared/systems/animator/loadAnimations";
import exampleTag from "./tags/exampleTag";
import paths from "shared/utils/paths";
import GameUI from "client/app/GameUI";
import pagePaths from "shared/utils/Animations/pagePaths";
import updateTools from "./systems/player/updateTools";
import DialogueSellUI from "./app/DialogueSellUI";
import HoverBoxUI from "./app/HoverBoxUI";
import { HoverBoxAttachment, world } from "shared/utils/jecs/jecsComponents";
import hoverBoxUpdate from "./systems/ui/hoverBoxUpdate";
import playerDataUpdate from "./systems/ui/playerDataUpdate";
import shopDataUpdate from "./systems/ui/shopDataUpdate";
import debuggerHook from "shared/systems/hooks/debuggerHook";
import playerThumbnail from "./systems/ui/playerThumbnail";
import NpcDialogue from "./app/NpcDialogue";
import updateWallsForSale from "./systems/ui/updateWallsForSale";
import gameMusic from "./systems/sounds/gameMusic";

if (!game.IsLoaded()) game.Loaded.Wait()
// variables for the ui
const playerGui = Players.LocalPlayer.WaitForChild<PlayerGui>("PlayerGui")
const dialogueSellUI = paths.Assets.UI.DialogueSell.Clone()
const hoverBoxUI = paths.Assets.UI.HoverBox.Clone()
const gameUI = paths.Assets.UI.GameUI.Clone()
const npcDialogues = paths.Assets.UI.NpcDialogues.Clone()

// set up the UI
gameUI.Parent = playerGui
GameUI(pagePaths(gameUI))

// sets up dialogue sell
dialogueSellUI.Parent = playerGui
dialogueSellUI.Adornee = paths.Map.Shops.WaitForChild("Sell").WaitForChild("TalkBox") as BasePart
DialogueSellUI(dialogueSellUI)

// sets up hover box
hoverBoxUI.Parent = playerGui
hoverBoxUI.Adornee = world.get(HoverBoxAttachment, HoverBoxAttachment)!
HoverBoxUI(hoverBoxUI)

// sets up the npc dialogues
npcDialogues.Parent = playerGui
NpcDialogue(npcDialogues)




// hotReloader.scan(script.Parent!, (context) => { }, (context) => { });

// sets up matter
const debug = setupMatter([
    // * shared

    // animator
    { system: loadAnimations },
    { system: setAnimation },

    // debugger
    { system: modelDebugger },

    // cooldown
    { system: updateCooldown },

    // mover
    { system: updateMovers },

    // hooks
    debuggerHook,
    recieveFromServer,
    change,
    watchRoutes,
    append,

    // * client

    // body
    { system: bodyUpdate },

    // commands
    { system: commandarClient },

    // instance
    { system: followInstance },

    // particles
    { system: emitParticles },
    { system: increaseParticlesSize },

    // player
    { system: updateTools },

    // sounds
    { system: gameMusic },

    // ui
    { system: hoverBoxUpdate },
    { system: playerDataUpdate },
    { system: shopDataUpdate },
    { system: playerThumbnail },
    { system: updateWallsForSale },
], { // on added && removed
    // "Character": characterAdded,
    exampleTag,
})


const client = jabby.obtain_client()
ContextActionService.BindAction("Open Jabby Home", (actionName: string, state: Enum.UserInputState) => {
    if (state !== Enum.UserInputState.Begin) return
    client.spawn_app(client.apps.home)
}, false, Enum.KeyCode.F4)
// // sets up the debug key
// UserInputService.InputBegan.Connect(function (input, gameProcessed) {
//     if (gameProcessed) return
//     if (input.UserInputType === Enum.UserInputType.MouseButton2 && UserInputService.IsKeyDown(Enum.KeyCode.Tab)) {
//         debug.toggle()
//     }
// })