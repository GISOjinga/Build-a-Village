import { World } from "@rbxts/jecs";
import { StarterGui } from "@rbxts/services";
import { routes } from "shared/data/network";
import pageStates from "shared/utils/Animations/pageStates";

export default (world: World) => {
    routes.updateFriendsBonus.listen(pageStates.friendsBonus);
    routes.sendFriendRequest.listen((otherPlayer) => {
        StarterGui.SetCore("PromptSendFriendRequest", otherPlayer);
    });
};
