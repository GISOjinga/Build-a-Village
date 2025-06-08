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
import { producer } from "shared/utils/producers"
import { Players } from "@rbxts/services"
import { createPortal, createRoot } from "@rbxts/react-roblox"
import React, { StrictMode } from "@rbxts/react"
import { ReflexProvider } from "@rbxts/react-reflex"
import GameUI from "client/app/gameUI"
import watchRoutes from "shared/systems/hooks/watchRoutes";
import append from "shared/systems/hooks/append";
import bodyUpdate from "./systems/body/bodyUpdate";
import setAnimation from "shared/systems/animator/setAnimation";
import loadAnimations from "shared/systems/animator/loadAnimations";
import exampleTag from "./tags/exampleTag";

// variables for the ui
const playerGui = Players.LocalPlayer.WaitForChild<PlayerGui>("PlayerGui")
const root = createRoot(new Instance("Folder"));

// starts the ui by opening setting the screen gui and opening the home page
root.render(
    <StrictMode>
        <ReflexProvider producer={producer} >
            {
                createPortal(
                    <screengui key="GameUI" IgnoreGuiInset={true} ZIndexBehavior={"Sibling"} ResetOnSpawn={false} ScreenInsets={Enum.ScreenInsets.DeviceSafeInsets} >
                        <GameUI />
                    </screengui>, playerGui
                )
            }
        </ReflexProvider>
    </StrictMode>,
);




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