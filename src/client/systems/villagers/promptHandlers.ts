import { Entity, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { useEvent } from "shared/Plugin-Hook";
import routes from "client/routes";
import { getEntity, printJecs, warnJecs } from "shared/utils/functions/jecsHelpFunctions";
import { Added, Changed, ReplicatedComponent, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";

const player = Players.LocalPlayer;

export default (world: World) => {
    const playerEntity = player.GetAttribute<Entity>("ServerId")

    // when villager gets added into the game conencts the triggered event regurally
    for (const [_, clientVillagerEntity, villagerComp] of world.query(TargetEntity, Added(Villager))) {
        const villagerEntity = world.get(clientVillagerEntity, ReplicatedComponent);
        Promise.try(() => {
            if (villagerEntity) {
                const villagerModel = villagerComp.villagerModel;
                const owner = villagerComp.playerEntity === playerEntity;
                const requirementPrompt = villagerModel.Station.Interaction.SupplyProduce.ProximityPrompt;

                // changes the binmdings
                requirementPrompt.KeyboardKeyCode = Enum.KeyCode.R;

                // for collecting
                villagerModel.Station.Parts.Resources.GetChildren().forEach((model, index) => {
                    const proximityPromptPart = model.WaitForChild("ProximityPromptPart");
                    const prompt = proximityPromptPart && (proximityPromptPart.FindFirstChild<ProximityPrompt>("ResourcesPrompt") || paths.Assets.ProximityPrompts.ResourcesPrompt.Clone());

                    // set up
                    prompt.ActionText = owner ? "Collect" : "Steal";
                    prompt.Parent = proximityPromptPart;
                    prompt.Enabled = model.GetAttribute("Ready") || false;

                    // when triggered
                    prompt.Triggered.Connect(() => {
                        printJecs($line, `Collecting ${model.Name} from villager: `, villagerEntity);
                        routes.collectVillagerProduce.send({ villagerEntity, resourceModelName: model.Name as ProduceNames });
                    })

                    // when attribute ready changes
                    model.GetAttributeChangedSignal("Ready").Connect(() => {
                        prompt.Enabled = model.GetAttribute("Ready") || false;
                    })
                })

                // for supplying
                if (owner) requirementPrompt.Triggered.Connect(() => {
                    printJecs($line, "Supplying villager produce for: ", villagerEntity);
                    routes.supplyVillager.send(villagerEntity);
                })
            }
        }).catch((promiseError) => warnJecs($line, "Error in villager prompt handler: ", promiseError, "Villager Entity: ", villagerEntity));
    }

    for (const [_, clientVillagerEntity, changedVillager] of world.query(TargetEntity, Changed(Villager))) {
        const villagerEntity = world.get(clientVillagerEntity, ReplicatedComponent);
        const villagerComp = changedVillager.new

        if (villagerEntity && villagerComp) {
            Promise.try(() => {
                const villagerModel = villagerComp.villagerModel;
                const owner = villagerComp.playerEntity === playerEntity;
                const required = villagerComp.villagerData.Progress.Required;
                const requirementPrompt = villagerModel.Station.Interaction.SupplyProduce.ProximityPrompt;
                const totalResources = villagerComp.villagerData.Progress.Progression.Resources.size();

                requirementPrompt.ActionText = (owner && required && required.Amount < required.Max)
                    ? `Requires ${required.Produce}`
                    : "";
                requirementPrompt.Enabled = owner && required ? ((required.Amount + totalResources) < required.Max) : false;
            }).catch((promiseError) => warnJecs($line, "Error in villager prompt handler: ", promiseError, "Villager Entity: ", villagerEntity));
        }
    }
};
