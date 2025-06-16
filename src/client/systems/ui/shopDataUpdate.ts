import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { routes } from "shared/data/network";
import { useChange, useEffect, useMemo, useThrottle } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import pageStates from "shared/utils/Animations/pageStates";
import { Changed, Data, HoverBoxAttachment, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";


// variables
const player = Players.LocalPlayer
let tmeTillRestock = 0;


export default (world: World) => {
    useRoute(routes.updateVillagersShop, ({ TimeTillRestock, Villagers }) => {
        tmeTillRestock = TimeTillRestock;
        pageStates.villagersShop(Villagers);
    })

    // updates the totalTimeForNewVillager
    if (useThrottle(.1)) pageStates.totalTimeForNewVillager(math.max(0, tmeTillRestock - os.time()))
}