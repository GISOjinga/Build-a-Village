import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { routes } from "shared/data/network";
import { FriendsBonus, Player } from "shared/utils/jecs/jecsComponents";
import { addComponent, getEntity } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
    for (const [playerEntity, player] of world.query(FriendsBonus).without(Player)) {
        // just placeholder to satisfy query typing
    }

    for (const [playerEntity, player] of world.query(Player)) {
        let hasFriend = false;
        for (const other of Players.GetPlayers()) {
            if (other !== player && player.IsFriendsWith(other.UserId)) {
                hasFriend = true;
                break;
            }
        }
        const multiplier = hasFriend ? 1.1 : 1;
        const existing = world.get(playerEntity, FriendsBonus);
        if (!existing) {
            addComponent(playerEntity, FriendsBonus, { multiplier });
            routes.updateFriendsBonus.sendTo(hasFriend, player);
        } else if (existing.multiplier !== multiplier) {
            world.set(playerEntity, FriendsBonus, { multiplier });
            routes.updateFriendsBonus.sendTo(hasFriend, player);
        }
    }
};
