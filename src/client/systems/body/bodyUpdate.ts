import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { useEvent } from "shared/Plugin-Hook";
import { getEntity, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Added, Body, TargetEntity } from "shared/utils/jecs/jecsComponents";



// variables
const player = Players.LocalPlayer
const giftingPrompts = new WeakMap<Player, ProximityPrompt>();

export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player);
    const equippedTool = body && body.model.FindFirstChildOfClass("Tool");

    // loops through all the gifting prompts watching
    giftingPrompts.forEach((prompt, playerToGift) => {
        const tooType = equippedTool?.GetAttribute<ToolType>("ItemType")

        // toggiles the prompts visibility
        prompt.Enabled = tooType === "Villager" || tooType === "Commodity";

        // watches for the prompt to be activated
        for (const [] of useEvent(prompt.Triggered, debug.traceback() + playerToGift.UserId)) {
            // if the player is not the local player, we send a gift request
            if (playerToGift !== Players.LocalPlayer) {
                printTS($line, "Gifting to player: ", playerToGift.Name, " with tool: ", equippedTool?.Name);
                routes.handToolToPlayer.send(playerToGift)
            }
        }
    })

    // when a body is added, we add a proximity prompt to it
    for (const [_, clientEntity, body] of world.query(TargetEntity, Added(Body))) {
        const giftingPrompt = new Instance("ProximityPrompt");
        const player = body && Players.GetPlayerFromCharacter(body.model)

        // when added it sets the client id property
        body?.model.SetAttribute("ClientId", clientEntity)
        player?.SetAttribute("ClientId", clientEntity)
        if (player && player !== Players.LocalPlayer) {
            giftingPrompt.MaxActivationDistance = 10000
            giftingPrompt.RequiresLineOfSight = false
            giftingPrompt.HoldDuration = 5
            giftingPrompts.set(player, giftingPrompt)
            giftingPrompt.ActionText = "Gift to player";
            giftingPrompt.Parent = body.rootPart
        }
    }
}