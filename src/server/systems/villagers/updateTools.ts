import { World } from "@rbxts/jecs";
import { deepEquals } from "@rbxts/object-utils";
import { $line } from "rbxts-transformer-inline";
import { printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Changed, Data, Player, TargetEntity } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";







export default (world: World) => {
    // when ever data gets updated makes sure the player has all the nesscary tools
    for (const [_, bodyEntity, dataChange] of world.query(TargetEntity, Changed(Data))) {
        const data = dataChange.new
        const player = data && world.get(bodyEntity, Player)
        const backpack = player && player.FindFirstChild("Backpack");

        // if the player has a backpack and data is available then
        if (backpack && data && ((!dataChange.old || (!deepEquals(data.Villagers, dataChange.old?.Villagers || []) || !deepEquals(data.Produce, dataChange.old?.Produce || []))))) {
            const body = data && world.get(bodyEntity, Body);
            const alltools = backpack && body && [...backpack.GetChildren(), ...body.model.GetChildren()].filter((v) => v.IsA("Tool")).filterUndefined();

            if (alltools) {
                const digTool = new Instance("Tool");

                // deletes all tools
                alltools.forEach((tool) => tool.Destroy());

                // sets up the dig tool
                printJecs($line, "Adding Dig Tool to Backpack");
                digTool.Name = "Dig Tool";
                digTool.SetAttribute("ItemType", "DigTool");
                digTool.SetAttribute("ItemName", "DigTool");
                digTool.RequiresHandle = false;
                digTool.Parent = backpack;

                // adds all the villager tools
                data.Villagers.forEach((villagerData) => {
                    if (villagerData.RelativeLocation) return; // skip if the villager is placed
                    const villagerName = villagerData.Name
                    const tool = new Instance("Tool");

                    // set up and parenting
                    tool.RequiresHandle = false
                    tool.Name = villagerName;
                    tool.SetAttribute("ItemType", "Villager");
                    tool.SetAttribute("ItemName", villagerName);
                    tool.SetAttribute("UniqueId", villagerData.UniqueId);
                    tool.Parent = backpack

                    // when the tool is activated
                    tool.Activated.Connect(() => {
                        // printTS($line, "Activated")
                    })
                })

                // for all produce
                data.Produce.forEach((produceData) => {
                    const produceName = produceData.Name;
                    const realTool = paths.Assets.Tools.Produce.FindFirstChild<Tool>(produceName);
                    const tool = realTool ? realTool.Clone() : new Instance("Tool");
                    const variantParticles = paths.Assets.Particles.FindFirstChild(produceData.Variant)?.Clone()
                    const partToplaceIn = tool.FindFirstChildOfClass("Part");

                    // set up and parenting
                    tool.RequiresHandle = realTool ? realTool.RequiresHandle : false;
                    tool.Name = `${produceData.Variant === 'Normal' ? produceName : produceData.Variant + ' ' + produceName} (${produceData.Amount})`;
                    tool.SetAttribute("ItemType", "Commodity");
                    tool.SetAttribute("ItemVariant", produceData.Variant);
                    tool.SetAttribute("ItemName", produceName);
                    if (variantParticles && partToplaceIn) variantParticles.Parent = partToplaceIn
                    tool.Parent = backpack

                    // when the tool is activated
                    tool.Activated.Connect(() => {
                        // printTS($line, "Activated")
                    })
                })
            }
        }
    }
}