import { World } from "@rbxts/jecs";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { $line } from "rbxts-transformer-inline";
import { useChange } from "shared/Plugin-Hook";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { rayParamsInclude } from "shared/utils/functions/rayFunctions";
import { formatToHHMMSS, formatToMMSS } from "shared/utils/functions/stringHelp";
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
    const villagerModel = villagerPartHovered && villagers?.GetChildren().find((child) => villagerPartHovered.IsDescendantOf(child)) as VillagerModel
    const villagerEntity = villagerModel && getEntity.fromInstance(villagerModel);
    const villagerInfo = villagerEntity && world.get(villagerEntity, Villager);
    const buildingTimes = villagerInfo && villagerInfo.villagerData.Progress.Building
    const timeTillFullyBuilt = buildingTimes && buildingTimes.EndTime - os.time();
    const progressionInfo = villagerInfo && villagerInfo.villagerData.Progress
    const produce = progressionInfo && progressionInfo.Produce;
    const produceStartTime = progressionInfo && progressionInfo.Progression.Time.StartTime;
    const requiredProduceTime = progressionInfo && progressionInfo.Progression.Time.RequiredTimePerResource;
    const produceEndTime = produceStartTime && requiredProduceTime && produceStartTime + requiredProduceTime
    const timeTillNextProduce = progressionInfo && produceEndTime && produceEndTime - os.time() > 0 ? produceEndTime - os.time() : 0;
    const resources = villagerInfo && villagerInfo.villagerData.Progress.Progression.Resources
    const totalProduce = resources && ((resources.Normal + resources.Gold + resources.Rainbow) || 0);
    const maxProduce = villagerModel && villagerModel.Station.Parts.Resources.GetChildren().size()//107658992263405

    // when the mouse moves
    hoverAttachment.Position = (target?.hit && hoverAttachment.Position.Lerp(target.hit.Position, 0.2)) || hoverAttachment.Position

    // when ever platform updates then
    if (useChange([platform]) && platform) hoverAttachment.Position = platform.Floor.Position

    // when the mouse hovers over a villager and sets the time till built
    // print(villagerEntity, timeTillFullyBuilt, timeTillNextProduce)
    // if (useChange([villagerEntity, timeTillFullyBuilt, timeTillNextProduce])) {
    if (timeTillFullyBuilt && villagerEntity && villagerInfo && timeTillFullyBuilt > 0) {
        pageStates.hoverInfo({
            visible: true,
            info: `Ready In ${formatToHHMMSS(timeTillFullyBuilt)}.`,
        })
    } else if (villagerEntity && timeTillNextProduce > 0) {
        pageStates.hoverInfo({
            visible: true,
            info: `(${totalProduce}/${maxProduce}) ${produce} in ${formatToMMSS(timeTillNextProduce)}.`,
        })
    } else if (villagerEntity && totalProduce === maxProduce) {
        pageStates.hoverInfo({
            visible: true,
            info: `(${totalProduce}/${maxProduce}) ${produce} ready.`,
        });
    } else if (!villagerEntity) {
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