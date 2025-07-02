import { Entity, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { useEvent } from "shared/Plugin-Hook";
import { routes } from "shared/data/network";
import { getEntity, printJecs, warnJecs } from "shared/utils/functions/jecsHelpFunctions";
import { ReplicatedComponent, Villager } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";

const player = Players.LocalPlayer;

export default (world: World) => {
    const playerEntity = player.GetAttribute<Entity>("ServerId")

    for (const [_, villagerEntity, villagerComp] of world.query(ReplicatedComponent, Villager)) {
        Promise.try(() => {
            const villagerModel = villagerComp.villagerModel;
            const owner = villagerComp.playerEntity === playerEntity;
            const required = villagerComp.villagerData.Progress.Required;
            const requirementPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt;
            const totalResources = villagerComp.villagerData.Progress.Progression.Resources.size();

            requirementPrompt.ActionText = (owner && required && required.Amount < required.Max)
                ? `Requires ${required.Produce}`
                : "";
            requirementPrompt.Enabled = owner && required ? ((required.Amount + totalResources) < required.Max) : false;

            if (owner) for (const [] of useEvent(requirementPrompt.Triggered, debug.traceback() + villagerEntity)) routes.supplyVillager.send(villagerEntity)

            villagerModel.Station.Parts.Resources.GetChildren().forEach((model, index) => {
                const proximityPromptPart = model.FindFirstChild("ProximityPromptPart");
                const prompt = proximityPromptPart && (proximityPromptPart.FindFirstChild<ProximityPrompt>("ResourcesPrompt") || paths.Assets.ProximityPrompts.ResourcesPrompt.Clone())
                if (!prompt) return;
                if (!owner) prompt.ActionText = "Steal";
                else prompt.ActionText = "Collect";

                // print(owner)
                prompt.Enabled = model.GetAttribute("Ready") || false
                prompt.Parent = proximityPromptPart
                for (const [] of useEvent(prompt.Triggered, debug.traceback() + index + villagerEntity)) {
                    printJecs($line, `Collecting ${model.Name} from villager: `, villagerEntity);
                    routes.collectVillagerProduce.send({ villagerEntity, resourceModelName: model.Name as ProduceNames });
                }
            });
        }).catch((promiseError) => warnJecs($line, "Error in villager prompt handler: ", promiseError, "Villager Entity: ", villagerEntity));
    }
};
