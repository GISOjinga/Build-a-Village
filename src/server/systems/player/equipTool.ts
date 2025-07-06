import { World } from "@rbxts/jecs";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import routes from "server/routes";
import { $line } from "rbxts-transformer-inline";
import { printJecs } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
    useRoute(routes.equipTool, (tool, player: Player) => {
        const backpack = player.FindFirstChild("FakePack") as Backpack | undefined;
        const character = player.Character;
        const oldTool = character?.FindFirstChildOfClass("Tool")

        if (tool && tool.Parent && character) {
            printJecs($line, `Equipping tool ${tool.Name} for`, player.Name);
            if (oldTool) {
                oldTool.Parent = backpack
                if (oldTool !== tool) tool.Parent = character;
            } else {
                tool.Parent = character;
            }
        }
    });
};

