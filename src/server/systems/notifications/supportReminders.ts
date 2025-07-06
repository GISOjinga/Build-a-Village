import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useEvent } from "shared/Plugin-Hook";
import routes from "server/routes";

const MESSAGES = [
    "Please hit like on the game to support us.",
    "Check out the link to the community to get updates. It's in the game description!",
    "Tell your friends to come join!",
];

function startReminders(player: Player) {
    task.spawn(() => {
        let index = 0;
        while (player.Parent) {
            routes.notify.sendTo({ text: MESSAGES[index], duration: 5 }, player);
            index = (index + 1) % MESSAGES.size();
            task.wait(math.random(240, 360));
        }
    });
}

export default (world: World) => {
    Players.GetPlayers().forEach(startReminders);
    for (const [player] of useEvent(Players.PlayerAdded)) startReminders(player);
};
