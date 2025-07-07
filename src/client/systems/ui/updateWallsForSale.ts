import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import wallsData from "shared/data/wallsData";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import routes from "client/routes";






// variables
const player = Players.LocalPlayer;







export default (world: World) => {

    // Listen for walls updates
    useRoute(routes.updatePlayerWalls, (playerWalls) => {
        // makes a list of walls for sale by merging player owned walls with default walls data
        pageStates.wallsShop(wallsData.map((wall) => ({
            ...(playerWalls.find((w) => w.Name === wall.Name) || wall)
        })));
    });
}