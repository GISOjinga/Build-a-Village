import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { routes } from "shared/data/network";
import { useChange, useEffect, useMemo, useThrottle } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import robuxStoreData from "shared/data/robuxStoreData";
import { Changed, Data, HoverBoxAttachment, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";
import pageStates from "shared/utils/Animations/pageStates";


// variables
const player = Players.LocalPlayer
let tmeTillRestock = 0;
let robuxStore = robuxStoreData;




export default (world: World) => {
    useRoute(routes.updateVillagersShop, ({ TimeTillRestock, Villagers }) => {
        tmeTillRestock = TimeTillRestock;
        pageStates.villagersShop(Villagers);
    })

    useRoute(routes.updateRobuxStore, (data) => {
        robuxStore = data;
        pageStates.robuxStore(data);
    })

    // updates the totalTimeForNewVillager
    if (useThrottle(.1)) pageStates.totalTimeForNewVillager(math.max(0, tmeTillRestock - os.time()))
}