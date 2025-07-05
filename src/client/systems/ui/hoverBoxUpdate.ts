import { World } from "@rbxts/jecs";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { $line } from "rbxts-transformer-inline";
import { useChange, useThrottle } from "shared/Plugin-Hook";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity, printTS, warnJecs } from "shared/utils/functions/jecsHelpFunctions";
import { rayParamsInclude } from "shared/utils/functions/rayFunctions";
import { formatToHHMMSS, formatToMMSS } from "shared/utils/functions/stringHelp";
import { Body, Changed, Data, HoverBoxAttachment, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";


// variables
const player = Players.LocalPlayer
const mouse = player.GetMouse()
let goalLocation = Vector3.zero


export default (world: World) => {
    const hoverAttachment = world.get(HoverBoxAttachment, HoverBoxAttachment)!
    if (useThrottle(.01) && pageStates.hoverInfo().visible) hoverAttachment.Position = hoverAttachment.Position.Lerp(goalLocation, 0.2);
    if (useThrottle(.1)) {
        Promise.try(() => {
            const camera = Workspace.Camera;
            const clientEntity = getEntity.fromInstance(player);
            const body = clientEntity && world.get(clientEntity, Body);
            const playerData = clientEntity && world.get(clientEntity, Data);
            const platform = body && body.platform;
            const villagers = platform?.FindFirstChild("Villagers") as Folder | undefined;
            const target = platform && Tracer.ray(camera.CFrame.Position, !UserInputService.MouseEnabled ? camera.CFrame.LookVector : mouse.Hit.LookVector, 1000).useRaycastParams(rayParamsInclude([platform.Villagers])).run()
            const villagerPartHovered = villagers && target?.hit?.IsDescendantOf(villagers) && target.hit
            const villagerModel = villagerPartHovered && villagers?.GetChildren().find((child) => villagerPartHovered.IsDescendantOf(child)) as VillagerModel
            const villagerEntity = villagerModel && getEntity.fromInstance(villagerModel);
            const villagerInfo = villagerEntity && world.get(villagerEntity, Villager);
            const buildingTimes = villagerInfo && villagerInfo.villagerData.Progress.Building
            const timeTillFullyBuilt = buildingTimes && (buildingTimes.StartTime + buildingTimes.TotalTime) - os.time();
            const produceName = villagerInfo && villagerInfo.villagerData.Progress.Produce
            const progressionInfo = villagerInfo && villagerInfo.villagerData.Progress
            const resources = villagerInfo && villagerInfo.villagerData.Progress.Progression.Resources
            const produceStartTime = progressionInfo && progressionInfo.Progression.Time.StartTime;
            const requiredProduceTime = progressionInfo && ((playerData?.Tutorial === 2 && villagerInfo.villagerData.Name === "Farmer") ? 5 : progressionInfo.Progression.Time.RequiredTimePerResource);
            const totalRequireResources = (progressionInfo && progressionInfo.Required) ? progressionInfo.Required.Amount : undefined;
            const requiredProduceName = (progressionInfo && progressionInfo.Required) ? progressionInfo.Required.Produce : undefined;
            const maxProduce = villagerModel && villagerModel.Station.Parts.Resources.GetChildren().size()//107658992263405
            const produceEndTime = produceStartTime && requiredProduceTime && produceStartTime + requiredProduceTime
            const timeTillNextProduce = progressionInfo && produceEndTime && produceEndTime - os.time() > 0 ? produceEndTime - os.time() : 0;
            const totalProduce = resources && resources.size();

            // when the mouse moves
            hoverAttachment.Name = "HoverBoxAttachment"
            goalLocation = (target?.hit && target.position) || hoverAttachment.Position

            // when ever platform updates then
            if (useChange([platform]) && body && platform) hoverAttachment.Position = body.rootPart.Position

            // when the mouse hovers over a villager and sets the time till built
            // print(villagerEntity, timeTillFullyBuilt, timeTillNextProduce)
            // if (useChange([villagerEntity, timeTillFullyBuilt, timeTillNextProduce])) {
            // when ever villager entity changes
            if (useChange([villagerEntity, totalRequireResources, maxProduce])) {
                pageStates.queueInfo((totalRequireResources !== undefined && maxProduce !== undefined) ? `(${totalRequireResources}/${maxProduce}) ${requiredProduceName} in queue` : "");
            }


            if (villagerEntity && totalProduce === maxProduce) {
                pageStates.hoverInfo({
                    visible: true,
                    info: `(${totalProduce}/${maxProduce}) ${produceName} ready.`,
                });
            } else if (timeTillFullyBuilt && villagerEntity && villagerInfo && timeTillFullyBuilt > 0) {
                // printTS($line, "Villager is building: ", villagerEntity, "Produce: ", produce, "Time Till Fully Built: ", timeTillFullyBuilt);
                pageStates.hoverInfo({
                    visible: true,
                    info: `Ready In ${formatToHHMMSS(timeTillFullyBuilt)}.`,
                })
            } else if (totalRequireResources !== undefined && villagerEntity && requiredProduceName && totalRequireResources <= 0) {
                // printTS($line, "Villager is waiting for produce: ", villagerEntity, "Required Produce: ", requiredProduceName);
                pageStates.hoverInfo({
                    visible: true,
                    info: `Waiting on ${requiredProduceName}`,
                })
            } else if (villagerEntity && timeTillNextProduce > 0) {
                // printTS($line, "Villager is producing: ", villagerEntity, "Produce: ", produce, "Time Till Next Produce: ", timeTillNextProduce);
                pageStates.hoverInfo({
                    visible: true,
                    info: `(${totalProduce}/${maxProduce}) ${produceName} in ${formatToMMSS(timeTillNextProduce)}.`,
                })
            } else if (!villagerEntity && pageStates.hoverInfo().visible) {
                // print($line, "No villager hovered over1.", body, 3, platform?.Name, clientEntity, body, player.GetAttribute("ServerId"), playerData, villagers, villagerModel, target?.hit, villagerPartHovered, villagers && target?.hit?.IsDescendantOf(villagers));
                pageStates.hoverInfo({
                    visible: false,
                    info: "",
                });
            }
        }).catch((err) => warnJecs($line, "Error in hoverBoxUpdate system:", err));
    }

    // prints all villagers changed
    // for (const [_, villagerEntity, change] of world.query(TargetEntity, Changed(Villager))) {
    //     // print(change)
    // }
}