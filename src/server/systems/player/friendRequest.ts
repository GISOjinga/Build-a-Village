import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
    useRoute(routes.requestAddFriend, (otherPlayer, player) => {
        const playerEntity = getEntity.fromInstance(player);
        if (!playerEntity) return;
        createEntity.confirmationPrompt(playerEntity, `Add ${otherPlayer.Name}?`, "Send friend request?", () => {
            routes.sendFriendRequest.sendTo(otherPlayer, player);
        });
    });
};
