import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { Changed, HoverBoxAttachment, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";


// variables
const player = Players.LocalPlayer
const mouse = player.GetMouse()


export default (world: World) => {
    const hoverAttachment = world.get(HoverBoxAttachment, HoverBoxAttachment)!

    // when the mouse moves
    hoverAttachment.Position = hoverAttachment.Position.Lerp(mouse.Hit.Position, 0.2);

    // prints all villagers changed
    for (const [_, villagerEntity, change] of world.query(TargetEntity, Changed(Villager))) {
        // print(change)
    }
}