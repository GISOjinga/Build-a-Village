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
        const data = change.new
        if (data) {
            pageStates.coins(data.Coins || 0)
            pageStates.dailyRewardStreak(data.DailyStreak || 0)
            pageStates.lastDailyRewardDay(data.LastDailyReward || 0)
        }
    }
}