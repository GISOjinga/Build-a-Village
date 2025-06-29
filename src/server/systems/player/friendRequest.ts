import { World } from "@rbxts/jecs";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { createEntity, getEntity, printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { GiftTo, Player, Removed, TargetEntity } from "shared/utils/jecs/jecsComponents";

export default (world: World) => {
    // when gift to gets removed
    // printTS($line, "Watching for removed GiftTo components");
    for (const [_, playerEntity, giftTo] of world.query(TargetEntity, Removed(GiftTo))) {
        const player = world.get(playerEntity, Player)
        const playerToFriend = giftTo.target
        const playerToFriendEntity = getEntity.fromInstance(playerToFriend)

        // sends out a friend request to both players
        if (player && playerToFriendEntity) {
            printJecs($line, `Removing gift to: ${playerToFriend.Name} from player: ${player.Name}`);
            createEntity.confirmationPrompt(playerToFriendEntity, `Accept Friend Request?`, `Friend Request From @${player.Name}`, () => {
                printJecs($line, `Adding friend: ${playerToFriend.Name}`);
                routes.sendFriendRequest.sendTo(playerToFriend, player);
                routes.sendFriendRequest.sendTo(player, playerToFriend);
            });
        }
    }
};
