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


// variables
const player = Players.LocalPlayer
const mouse = player.GetMouse()


export default (world: World) => {
    const camera = Workspace.Camera;
    const body = getEntity.bodyFromPlayer(player);
    const platform = body && body.platform;
    const villagers = platform?.FindFirstChild("Villagers") as Folder | undefined;
    const hoverAttachment = world.get(HoverBoxAttachment, HoverBoxAttachment)!
    const target = platform && Tracer.ray(camera.CFrame.Position, !UserInputService.MouseEnabled ? camera.CFrame.LookVector : mouse.Hit.LookVector, 1000).useRaycastParams(rayParamsInclude([platform.Villagers])).run()
    const villagerPartHovered = villagers && target?.hit?.IsDescendantOf(villagers) && target.hit
    const villagerModel = villagerPartHovered && villagers?.GetChildren().find((child) => villagerPartHovered.IsDescendantOf(child));
    const villagerEntity = villagerModel && getEntity.fromInstance(villagerModel);
    const villagerInfo = villagerEntity && world.get(villagerEntity, Villager);
    const buildingTimes = villagerInfo && villagerInfo.villagerData.Progress.Building
    const timeTillFullyBuilt = buildingTimes && buildingTimes.EndTime - os.time();

    // when the mouse moves
    hoverAttachment.Position = (target?.hit && hoverAttachment.Position.Lerp(target.hit.Position, 0.2)) || hoverAttachment.Position

    // when the mouse hovers over a villager and sets the time till built
    if (useChange([villagerEntity, timeTillFullyBuilt]) && timeTillFullyBuilt && villagerEntity && villagerInfo && timeTillFullyBuilt > 0) {
        pageStates.hoverInfo({
            visible: true,
            info: `Ready In ${formatToHHMMSS(timeTillFullyBuilt)}.`,
        })
    }

    // when the mouse is not hovering over a villager
    if (useChange([villagerModel]) && !villagerEntity) {
        pageStates.hoverInfo({
            visible: false,
            info: "",
        });
    }

    // prints all villagers changed
    // for (const [_, villagerEntity, change] of world.query(TargetEntity, Changed(Villager))) {
    //     // print(change)
    // }
}