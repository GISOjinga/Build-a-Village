import { Entity, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import routes from "server/routes";
import { Added, FriendsBonus, Player, Removed } from "shared/utils/jecs/jecsComponents";
import { addComponent, getEntity, removeComponent } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
    const updateFriendBonus = () => {
        const multiplier = 1.1; // friend bonus multiplier

        // checks through all players to see if you have a friend
        for (const [_, player] of pairs(Players.GetPlayers())) {
            const playerEntity = getEntity.fromInstance(player);
            if (playerEntity) {
                removeComponent(playerEntity, FriendsBonus); // remove existing bonus
                for (const [_, otherPlayer] of pairs(Players.GetPlayers())) {
                    const otherPlayerEntity = getEntity.fromInstance(otherPlayer);
                    if (otherPlayer !== player && player.IsFriendsWith(otherPlayer.UserId) && otherPlayerEntity) {
                        addComponent(playerEntity, FriendsBonus, { multiplier });
                        routes.updateFriendsBonus.sendTo(true, player);
                        return;
                    }
                }
            }
        }
    }


    // when players get added/removed checks all players if they are friends if so give them both friend bounus only 
    for (const [playerEntity, player] of world.query(Added(Player))) updateFriendBonus();
    for (const [playerEntity, player] of world.query(Removed(Player))) updateFriendBonus();
};
