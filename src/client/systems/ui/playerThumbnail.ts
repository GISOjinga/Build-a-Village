import { Janitor } from "@rbxts/janitor";
import { World } from "@rbxts/jecs";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { $line } from "rbxts-transformer-inline";
import { useChange } from "shared/Plugin-Hook";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { rayParamsInclude } from "shared/utils/functions/rayFunctions";
import { formatToHHMMSS } from "shared/utils/functions/stringHelp";
import { Changed, HoverBoxAttachment, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";


// variables
const trash = new Janitor()
const playerThumbnail = trash.Add(paths.Assets.UI.PlayerThumbnail.Clone())
const player = Players.LocalPlayer
const mouse = player.GetMouse()
trash.LinkToInstance(script, true)

// places the player thumbnail
export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player);
    const platform = body && body.platform;

    // when platform gets added sets the parent
    playerThumbnail.Parent = player.FindFirstChild("PlayerGui")
    if (useChange([platform]) && platform) {
        playerThumbnail.Adornee = platform.NameSign.Thumbnail;
    }
}