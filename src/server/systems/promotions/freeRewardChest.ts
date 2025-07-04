import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import routes from "server/routes";
import { useEvent } from "shared/Plugin-Hook";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";

const groupId = 36086761;
const reward = 100;

export default (world: World) => {
    const chest = paths.Map.FreeRewardChest;
    const prompt = chest?.ProximityHolder?.ClaimProximityPrompt;

    if (!prompt) return;

    for (const [player] of useEvent(prompt.Triggered)) {
        const playerEntity = getEntity.fromInstance(player);
        if (!playerEntity) return;

        task.spawn(() => {
            createEntity.updateData(playerEntity, (oldData) => {
                if (oldData.ClaimedFreeRewardChest) {
                    routes.notify.sendTo({ text: "Reward already claimed", duration: 5 }, player);
                    return oldData;
                }

                if (player.IsInGroup(groupId) === true) {
                    oldData.Coins += reward;
                    oldData.ClaimedFreeRewardChest = true;
                    routes.notify.sendTo({ text: "Congratulations, here is your $100 reward", duration: 5 }, player);
                } else {
                    routes.notify.sendTo({ text: "you must complete all steps for reward", duration: 5 }, player);
                }
                return oldData;
            });
        })
    }
};
