import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useEvent } from "shared/Plugin-Hook";
import routes from "server/routes";

const MESSAGES = [
    "Please hit like on the game to support us. We really appreciate it! :)",
    "Check out the link to the community to get updates. It's in the game description!",
    "Have a bug or suggestion? Join our Discord server and let us know!",
    "Join our Discord server for more updates and community events!",
    "Tell your friends to come join!",
    "If you get teleported/migrated please be patient, we're activly adding a bunch of fun updates!",
    "There's a weird sketchy guy under the tree go try your luck!"
];


let totalTime = os.time() + math.random(60 * 6, 60 * 10);
export default () => {
    if (totalTime < os.time()) {
        routes.notify.sendToAll({ text: MESSAGES[math.floor(math.random() * MESSAGES.size())], duration: 5 });
        totalTime = os.time() + math.random(60 * 6, 60 * 10);
    }
};
