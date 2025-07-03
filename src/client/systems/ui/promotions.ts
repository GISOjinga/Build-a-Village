import { World } from "@rbxts/jecs";
import { StarterGui } from "@rbxts/services";
import routes from "client/routes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import pageStates from "shared/utils/Animations/pageStates";

export default (world: World) => {
    useRoute(routes.updateFriendsBonus, pageStates.friendsBonus);
    useRoute(routes.sendFriendRequest, (otherPlayer) => {
        StarterGui.SetCore("PromptSendFriendRequest", otherPlayer as Player);
    });
};
