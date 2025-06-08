import { pair, World } from "@rbxts/jecs";
import { useAsync, useMemo, useThrottle } from "shared/Plugin-Hook";
import { DisableAutoRotate, systemQueue, Changed, Added, Removed } from "shared/utils/jecs/jecsComponents";


// for all the ones with disable auto rotate, disable it
export default (world: World) => {
    const delta = systemQueue.getDeltaTime()

    // when auto rotate is disabled
    for (const [entity, { humanoid, duration, destroyEntityOnComplete }] of world.query(DisableAutoRotate)) {
        humanoid.AutoRotate = false

        // handles the count down
        if (duration) {
            if (duration > 0) {
                world.set(entity, DisableAutoRotate, ({
                    duration: duration - delta,
                    humanoid: humanoid
                }));
            } else if (destroyEntityOnComplete) {
                humanoid.AutoRotate = true
                world.delete(entity);
            } else {
                humanoid.AutoRotate = true
                world.remove(entity, DisableAutoRotate);
            }
        }
    }

}