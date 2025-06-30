import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { useEvent } from "shared/Plugin-Hook";
import { routes } from "shared/data/network";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Villager } from "shared/utils/jecs/jecsComponents";

const player = Players.LocalPlayer;
const playerEntity = getEntity.fromInstance(player);
const connected = new WeakSet<ProximityPrompt>();

export default (world: World) => {
    for (const [villagerEntity, villagerComp] of world.query(Villager)) {
        const villagerModel = villagerComp.villagerModel;
        const owner = villagerComp.playerEntity === playerEntity;
        const required = villagerComp.villagerData.Progress.Required;
        const requirementPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt;

        requirementPrompt.ActionText = (owner && required && required.Amount < required.Max)
            ? `Requires ${required.Produce}`
            : "";
        requirementPrompt.Enabled = owner && required ? required.Amount < required.Max : false;
        if (!owner) requirementPrompt.Enabled = false;

        if (owner && !connected.has(requirementPrompt)) {
            connected.add(requirementPrompt);
            for (const [] of useEvent(requirementPrompt.Triggered, debug.traceback())) {
                routes.supplyVillager.send(villagerEntity);
            }
        }

        villagerModel.Station.Parts.Resources.GetChildren().forEach((model) => {
            const prompt = model.FindFirstChild("ProximityPromptPart")?.FindFirstChild<ProximityPrompt>("ResourcesPrompt");
            if (!prompt) return;
            if (!owner) prompt.ActionText = "Steal";
            else prompt.ActionText = "Collect";

            if (!connected.has(prompt)) {
                connected.add(prompt);
                for (const [] of useEvent(prompt.Triggered, debug.traceback())) {
                    routes.collectVillagerProduce.send({ villagerEntity, resourceModelName: model.Name });
                }
            }
        });
    }
};
