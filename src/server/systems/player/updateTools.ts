import { World } from "@rbxts/jecs";
import { deepEquals } from "@rbxts/object-utils";
import { $line } from "rbxts-transformer-inline";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Changed, Data, Player, TargetEntity } from "shared/utils/jecs/jecsComponents";







export default (world: World) => {
    // when ever data gets updated makes sure the player has all the nesscary tools
    for (const [_, bodyEntity, dataChange] of world.query(TargetEntity, Changed(Data))) {
        const data = dataChange.new
        const player = data && world.get(bodyEntity, Player)
        const backpack = player && player.FindFirstChild("Backpack");

        print(dataChange, bodyEntity)
        if (backpack && data && ((!dataChange.old || (!deepEquals(data.Villagers, dataChange.old?.Villagers || []) || !deepEquals(data.Produce, dataChange.old?.Produce || []))))) {
            const body = data && world.get(bodyEntity, Body);
            const alltools = backpack && body && [...backpack.GetChildren(), ...body.model.GetChildren()].filter((v) => v.IsA("Tool")).filterUndefined();

            if (alltools) {
                // deletes all tools
                alltools.forEach((tool) => tool.Destroy());

                // adds all the villager tools
                // print(data.Villagers)
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
                    const tool = new Instance("Tool");

                    // set up and parenting
                    tool.RequiresHandle = false
                    tool.Name = `${produceName} (${produceData.Amount})`;
                    tool.SetAttribute("ItemType", "Commodity");
                    tool.SetAttribute("ItemName", produceName);
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