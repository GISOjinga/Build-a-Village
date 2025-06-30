import { World } from "@rbxts/jecs";
import { Changed, Data } from "shared/utils/jecs/jecsComponents";






// leader board instances



export default (world: World) => {
    for (const [_, data] of world.query(Changed(Data))) {

    }
}