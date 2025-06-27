import { World } from "@rbxts/jecs";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { addComponent, getEntity, printTS, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import { ConfirmationPrompt, Removed, TargetEntity } from "shared/utils/jecs/jecsComponents";








export default (world: World) => {
    // use route on confirmPrompt when the bool is true then it confirms the prompt and removes it
    useRoute(routes.confirmPrompt, (yes, player) => {
        const playerEntity = getEntity.fromInstance(player);
        const confirmationPrompt = playerEntity && world.get(playerEntity, ConfirmationPrompt);

        // if data then
        if (confirmationPrompt) {
            printTS($line, "Confirmation Prompt: ", confirmationPrompt, " for player: ", player.Name);
            // if yes then removes the prompt
            addComponent(playerEntity, ConfirmationPrompt, { ...confirmationPrompt, confirmation: yes });
            removeComponent(playerEntity, ConfirmationPrompt);
        }
    })

    // when the confirmation prompt is removed then does the calls
    for (const [_, playerEntity, confirmationPrompt] of world.query(TargetEntity, Removed(ConfirmationPrompt))) {
        if (confirmationPrompt.confirmation) {
            // if the confirmation is true then calls the callback
            confirmationPrompt.onConfirm?.();
        } else {
            // if the confirmation is false then calls the cancel callback
            confirmationPrompt.onDecline?.();
        }
    }
}