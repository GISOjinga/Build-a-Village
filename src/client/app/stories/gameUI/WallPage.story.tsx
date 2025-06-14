import React, { StrictMode } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import Object from "@rbxts/object-utils";
import paths from "shared/utils/paths";
import { Janitor } from "@rbxts/janitor";
import GameUI from "client/app/GameUI";
import pagePaths from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";


// return the controller
export = (gameUI: GameUI) => {
    const trash = new Janitor();

    // Create a root for the frame
    paths.Assets.UI.GameUI.GetChildren().forEach((child) => child.Clone().Parent = gameUI);
    trash.Add(GameUI(pagePaths(gameUI)));

    // adds in some fake data
    pageStates.openPage("Wall");
    pageStates.wallsShop((oldWallsShop) => {
        return [
            ...oldWallsShop, {
                Name: "Wooden Wall",
                Price: 100000,
                Image: "rbxassetid://112646206830150",
                Description: "A friendly villager.",
                Rarity: "Common",
                CashMultiplier: 1,
            },
        ] satisfies WallInfo[];
    })

    //We need to return another function to unmount the handle
    return () => {
        trash.Destroy();
    };
}