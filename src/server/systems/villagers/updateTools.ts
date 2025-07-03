import { Entity, World } from "@rbxts/jecs";
import { deepEquals } from "@rbxts/object-utils";
import { $line } from "rbxts-transformer-inline";
import { PlayerData } from "shared/data/defaultData";
import { printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Added, Body, Changed, Data, Player, Removed, TargetEntity } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";







export default (world: World) => {
    // call to fix tools
    const fixTools = (bodyEntity: Entity, dataChange: { new?: PlayerData, old?: PlayerData }) => {
        const data = dataChange.new
        const player = data && world.get(bodyEntity, Player)
        const backpack = player && player.FindFirstChild("Backpack");

        // if the player has a backpack and data is available then
        if (backpack && data && ((!dataChange.old || (!deepEquals(data.Villagers, dataChange.old?.Villagers || []) || !deepEquals(data.Produce, dataChange.old?.Produce || []))))) {
            const body = data && world.get(bodyEntity, Body);
            const alltools = backpack && body && [...backpack.GetChildren(), ...body.model.GetChildren()].filter((v) => v.IsA("Tool")).filterUndefined();

            if (alltools) {
                // organize existing tools
                const villagerTools = new Map<number, Tool>();
                const produceTools = new Map<string, Tool>();
                let digTool = undefined as Tool | undefined;

                alltools.forEach((invTool) => {
                    const attrType = invTool.GetAttribute("ItemType") as any as "Villager" | "Commodity" | "DigTool" | undefined;
                    if (attrType === "Villager") {
                        const id = invTool.GetAttribute<number>("UniqueId");
                        if (id !== undefined) villagerTools.set(id, invTool);
                    } else if (attrType === "Commodity") {
                        const name = invTool.GetAttribute<string>("ItemName") || "";
                        const variant = invTool.GetAttribute<string>("ItemVariant") || "";
                        produceTools.set(`${name}|${variant}`, invTool);
                    } else if (attrType === "DigTool") {
                        digTool = invTool;
                    }
                });

                // ensure dig tool exists
                if (!digTool) {
                    digTool = new Instance("Tool");
                    printJecs($line, "Adding Dig Tool to Backpack");
                    digTool.Name = "Dig Tool";
                    digTool.SetAttribute("ItemType", "DigTool");
                    digTool.SetAttribute("ItemName", "DigTool");
                    digTool.RequiresHandle = false;
                    digTool.Parent = backpack;
                }

                // sync villager tools
                const validVillagers = new Set<number>();
                data.Villagers.forEach((villagerData) => {
                    if (villagerData.RelativeLocation) return;
                    const id = villagerData.UniqueId;
                    validVillagers.add(id);
                    if (!villagerTools.has(id)) {
                        const tool = new Instance("Tool");
                        tool.RequiresHandle = false;
                        tool.Name = villagerData.Name;
                        tool.SetAttribute("ItemType", "Villager");
                        tool.SetAttribute("ItemName", villagerData.Name);
                        tool.SetAttribute("UniqueId", id);
                        tool.Parent = backpack;
                        tool.Activated.Connect(() => {});
                    }
                });
                villagerTools.forEach((tool, id) => {
                    if (!validVillagers.has(id)) tool.Destroy();
                });

                // sync produce tools
                const validProduce = new Set<string>();
                data.Produce.forEach((produceData) => {
                    const key = `${produceData.Name}|${produceData.Variant}`;
                    validProduce.add(key);
                    const existing = produceTools.get(key);
                    const realTool = paths.Assets.Tools.Produce.FindFirstChild<Tool>(produceData.Name);
                    if (existing) {
                        existing.Name = `${produceData.Variant === 'Normal' ? produceData.Name : produceData.Variant + ' ' + produceData.Name} (${produceData.Amount})`;
                    } else {
                        const tool = realTool ? realTool.Clone() : new Instance("Tool");
                        const variantParticles = paths.Assets.Particles.FindFirstChild(produceData.Variant)?.Clone();
                        const partToplaceIn = tool.FindFirstChildOfClass("Part");
                        tool.RequiresHandle = realTool ? realTool.RequiresHandle : false;
                        tool.Name = `${produceData.Variant === 'Normal' ? produceData.Name : produceData.Variant + ' ' + produceData.Name} (${produceData.Amount})`;
                        tool.SetAttribute("ItemType", "Commodity");
                        tool.SetAttribute("ItemVariant", produceData.Variant);
                        tool.SetAttribute("ItemName", produceData.Name);
                        if (variantParticles && partToplaceIn) variantParticles.Parent = partToplaceIn;
                        tool.Parent = backpack;
                        tool.Activated.Connect(() => {});
                    }
                });
                produceTools.forEach((tool, key) => {
                    if (!validProduce.has(key)) tool.Destroy();
                });
            }
        }
    }

    // if body gets removed then removes data
    for (const [_, bodyEntity] of world.query(TargetEntity, Added(Body))) fixTools(bodyEntity, { new: world.get(bodyEntity, Data) })

    // when ever data gets updated makes sure the player has all the nesscary tools
    for (const [_, bodyEntity, dataChange] of world.query(TargetEntity, Changed(Data))) fixTools(bodyEntity, dataChange)
}