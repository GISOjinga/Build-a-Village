import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import pageStates from "shared/utils/Animations/pageStates";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import routes from "client/routes";


// variables
const player = Players.LocalPlayer
const mouse = player.GetMouse()


export default (world: World) => {
    // Listen for coin updates
    useRoute(routes.updatePlayerCoins, (coins) => {
        pageStates.coins(coins);
    });
    
    // Listen for daily streak updates
    useRoute(routes.updateDailyStreak, (streak) => {
        pageStates.dailyRewardStreak(streak);
    });
    
    // Listen for daily reward updates
    useRoute(routes.updateLastDailyReward, (lastDay) => {
        pageStates.lastDailyRewardDay(lastDay);
    });
}