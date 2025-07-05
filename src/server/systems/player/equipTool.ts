import { World } from "@rbxts/jecs";
import { Backpack } from "@rbxts/types";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import routes from "shared/data/network";
import { $line } from "rbxts-transformer-inline";
import { printJecs } from "shared/utils/functions/jecsHelpFunctions";

export default (world: World) => {
    useRoute(routes.equipTool, ({ toolName }, player) => {
        const backpack = player.FindFirstChild("Backpack") as Backpack | undefined;
        const character = player.Character;
        const tool = backpack?.FindFirstChild(toolName) as Tool | undefined;
        if (tool && character) {
            printJecs($line, `Equipping tool ${toolName} for`, player.Name);
            tool.Parent = character;
        }
    });
};
