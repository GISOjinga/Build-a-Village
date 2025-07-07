import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import routes from "client/routes";
import { useChange, useEffect, useMemo, useThrottle } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import robuxStoreData from "shared/data/robuxStoreData";
import { Changed, Data, HoverBoxAttachment, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";


// variables
const player = Players.LocalPlayer
let tmeTillRestock = 0;
let robuxStore = robuxStoreData;




export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player);

    // updates the villager shop data
    useRoute(routes.updateVillagersShop, (Villagers) => {
        pageStates.villagersShop(Villagers as unknown as VillagerInfo[]);
    })

    // update restock time
    useRoute(routes.updateRestockTime, (time) => {
        tmeTillRestock = time;
    })

    // updates the walls shop data
    useRoute(routes.updateRobuxStore, (data) => {
        robuxStore = data as typeof robuxStoreData;
        pageStates.robuxStore(data as typeof robuxStoreData);
    })

    // updates the totalTimeForNewVillager
    if (useThrottle(.1)) pageStates.totalTimeForNewVillager(math.max(0, tmeTillRestock - os.time()))

    // this can open and close the shop menus based on distance
    if (body) {
        const openPage = pageStates.openPage();
        const distanceFromBuyNoob = body.rootPart.Position.sub(paths.Map.Shops.King.Npc.HumanoidRootPart.Position).Magnitude;
        const distanceFromSellNoob = body.rootPart.Position.sub(paths.Map.Shops.Merchant.Npc.HumanoidRootPart.Position).Magnitude;
        const distanceFromArchitectNoob = body.rootPart.Position.sub(paths.Map.Shops.Architect.Npc.HumanoidRootPart.Position).Magnitude;
        const distanceFromShetchyNoob = body.rootPart.Position.sub(paths.Map.Shops.SketchyGuy.Npc.HumanoidRootPart.Position).Magnitude;
        const maxDistance = 20

        // makes sure the player is within range of the buy/sell noob
        if (openPage === "Buy" && distanceFromBuyNoob > maxDistance) {
            pageStates.openPage("None");
        } else if (openPage === "Sell" && distanceFromSellNoob > maxDistance) {
            pageStates.openPage("None");
        } else if (openPage === "Rolls" && distanceFromShetchyNoob > maxDistance) {
            pageStates.openPage("None");
        } else if (openPage === "Wall" && distanceFromArchitectNoob > maxDistance) {
            pageStates.openPage("None");
        }
    }
}