import { EmitParticles, systemQueue, Changed } from "shared/utils/jecs/jecsComponents";
import { World } from "@rbxts/jecs";
import paths from "shared/utils/paths";
import { Debris, TweenService, Workspace } from "@rbxts/services";
import { particlesEmit, particlesToggle } from "shared/utils/functions/particlesFunctions";
import { beamsTweenToZero } from "shared/utils/functions/beamsFunction";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import { $line } from "rbxts-transformer-inline";


// highlights for each platform
const highlight = new Instance("Highlight", Workspace.Terrain);

// sets up highlight
highlight.Name = "ResourcePromptHighlight";
highlight.FillTransparency = 1
highlight.OutlineTransparency = 0;
highlight.OutlineColor = new Color3(1, 1, 1);

// varibles
export default (isTagged: boolean, resourcePrompt: ProximityPrompt, world: World) => {
    const resourcePromptPart = resourcePrompt.Parent as BasePart;
    const model = resourcePromptPart?.Parent as Model;

    if (isTagged && resourcePromptPart && model) {
        const produceInfo = paths.Assets.UI.ProduceInfo.Clone();

        // parents it to the resource prompt
        produceInfo.Enabled = false
        produceInfo.Adornee = resourcePromptPart;
        produceInfo.Parent = resourcePromptPart

        // when the prompt is activated
        resourcePrompt.PromptShown.Connect(() => {
            task.wait()
            const produceName = model.GetAttribute("ProduceName") as ProduceNames;
            const produceVariant = model.GetAttribute("Variant") as ProduceVariant;

            // sets up the ui
            produceInfo.Frame.ProduceName.GetChildren().forEach((child) => { if (child.IsA("UIGradient")) { child.Enabled = child.Name === produceVariant } })
            produceInfo.Frame.Rarity.GetChildren().forEach((child) => { if (child.IsA("UIGradient")) { child.Enabled = child.Name === produceVariant } })
            produceInfo.Frame.ProduceName.Visible = true;
            produceInfo.Frame.Rarity.Visible = produceVariant === "Gold" || produceVariant === "Rainbow";
            produceInfo.Frame.ProduceName.Text = produceName;
            produceInfo.Frame.Rarity.Text = produceVariant;
            produceInfo.Enabled = true;
            highlight.Adornee = model;
        })

        // when the prompt is hidden
        resourcePrompt.PromptHidden.Connect(() => {
            produceInfo.Enabled = false;
            highlight.Adornee = undefined;
        })
    } else {

    }
}