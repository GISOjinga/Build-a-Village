import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import routes from "server/routes";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";

const GROUP_ID = 36086761;
const REWARD = 100;

export default (world: World) => {
    const chest = paths.Map.FreeRewardChest;
    const prompt = chest?.ProximityHolder?.ClaimProximityPrompt;

    if (!prompt) return;

    prompt.KeyboardKeyCode = Enum.KeyCode.E;
    prompt.ActionText = "CLAIM";

    prompt.Triggered.Connect((player) => {
        const playerEntity = getEntity.fromInstance(player);
        if (!playerEntity) return;

        createEntity.updateData(playerEntity, (oldData) => {
            if (oldData.ClaimedFreeRewardChest) {
                routes.notify.sendTo({ text: "Reward already claimed", duration: 5 }, player);
                return oldData;
            }

            if (player.GetRankInGroup(GROUP_ID) > 0) {
                oldData.Coins += REWARD;
                oldData.ClaimedFreeRewardChest = true;
                routes.notify.sendTo({ text: "Congratulations, here is your $100 reward", duration: 5 }, player);
            } else {
                routes.notify.sendTo({ text: "you must complete all steps for reward", duration: 5 }, player);
            }
            return oldData;
        });
    });
};
