import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import pageStates from "shared/utils/Animations/pageStates";
import { Changed, Data, HoverBoxAttachment, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";


// variables
const player = Players.LocalPlayer
const mouse = player.GetMouse()


export default (world: World) => {
    // prints all villagers changed
    for (const [_, __, change] of world.query(TargetEntity, Changed(Data))) {
        pageStates.coins(change.new?.Coins || 0)
        pageStates.autoSkipRoll(change.new?.AutoSkipRoll ?? false)
    }
}