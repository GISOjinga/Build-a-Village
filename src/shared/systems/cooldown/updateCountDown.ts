import { randomPointOnPart } from "shared/utils/functions/partFunctions";
import { Tracer } from "@rbxts/tracer";
import { pair, Wildcard, World } from "@rbxts/jecs";
import { Workspace } from "@rbxts/services";
import paths from "../../utils/paths";
import { Body, CountDown, systemQueue, Changed, DestroyAfterCounting } from "shared/utils/jecs/jecsComponents";
import { Debris } from "@rbxts/services";


// takes down cooldown
export default (world: World) => {
    const delta = systemQueue.getDeltaTime(); // Get the delta time

    // loops through all cooldowns
    for (const [entity, duration] of world.query(CountDown)) {
        // if the duration is less than 0
        if (duration < 0) {
            const destroyAfterCounting = world.get(entity, DestroyAfterCounting); // get the destroy after counting component

            if (destroyAfterCounting) {
                world.delete(entity)
                if (typeIs(destroyAfterCounting, "function")) destroyAfterCounting()
            } else {
                world.remove(entity, CountDown);
            }
        } else {
            world.set(entity, CountDown, (duration - delta)); // insert the entity with the new duration
        }
    }
}