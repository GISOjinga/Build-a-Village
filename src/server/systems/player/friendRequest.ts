import { World } from "@rbxts/jecs";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { createEntity, getEntity, printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
    useRoute(routes.requestAddFriend, (otherPlayer, player) => {
        const playerToFriendEntity = getEntity.fromInstance(otherPlayer);
        printJecs($line, `Creating confirmation prompt for player: ${playerToFriendEntity}`);
        if (!playerToFriendEntity) return;
        printJecs($line, `Received friend request from ${player.Name} for player: ${otherPlayer.Name}`);
        createEntity.confirmationPrompt(playerToFriendEntity, `Accept Friend Request?`, `Friend Request From @${player.Name}`, () => {
            printJecs($line, `Adding friend: ${otherPlayer.Name}`);
            routes.sendFriendRequest.sendTo(otherPlayer, player);
            routes.sendFriendRequest.sendTo(player, otherPlayer);
        });
    });
};
