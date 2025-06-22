import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import wallsData from "shared/data/wallsData";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Changed, Data, TargetEntity } from "shared/utils/jecs/jecsComponents";






// variables
const player = Players.LocalPlayer;







export default (world: World) => {

    // if data changes then
    for (const [_, clientEntity, changed] of world.query(TargetEntity, Changed(Data))) {
        const data = changed.new

        // makes a list of walls for sale
        if (data) {
            pageStates.wallsShop(wallsData.map((wall) => ({
                ...(data.Walls.find((w) => w.Name === wall.Name) || wall)
            })))
        }
    }
}