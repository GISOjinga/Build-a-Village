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

        if (backpack && data && !deepEquals(data.Villagers, dataChange.old || {})) {
            const body = data && world.get(bodyEntity, Body);
            const alltools = backpack && body && [...backpack.GetChildren(), ...body.model.GetChildren()].filter((v) => v.IsA("Tool")).filterUndefined();

            if (alltools) {
                // deletes all tools
                alltools.forEach((tool) => tool.Destroy());

                // adds all the villager tools
                for (const [index, villagersData] of pairs(data.Villagers)) {
                    if (villagersData.RelativeLocation) continue; // skip if the villager is placed
                    const villagerName = villagersData.Name
                    const tool = new Instance("Tool");

                    // set up and parenting
                    tool.RequiresHandle = false
                    tool.Name = villagerName;
                    tool.SetAttribute("ItemType", "Villager");
                    tool.SetAttribute("ItemName", villagerName);
                    tool.SetAttribute("UniqueId", villagersData.UniqueId);
                    tool.Parent = backpack

                    // when the tool is activated
                    tool.Activated.Connect(() => {
                        // printTS($line, "Activated")
                    })
                }
            }
        }
    }
}