import { Entity, World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players } from "@rbxts/services";
import paths from "shared/utils/paths";
import { printJecs } from "shared/utils/functions/jecsHelpFunctions";
import { $line } from "rbxts-transformer-inline";





// loads the character
export default (world: World) => {
    Players.GetPlayers().forEach(player => {
        if (!player.GetAttribute("JecsLoaded")) return;
        if (!player.GetAttribute("characterSpawnedTag")) {

            // sets loaded to true
            player.SetAttribute("characterSpawnedTag", true)

            // when tasked with loading the characer
            task.spawn(() => {
                // loads the character
                player.LoadCharacter()

                // places the character inside the folder
                player.Character!.Parent = paths.Characters.Players

                // when destroying
                player.Character!.Destroying.Connect(() => {
                    player.SetAttribute("characterSpawnedTag", false)
                })
            })
        }
    });
}