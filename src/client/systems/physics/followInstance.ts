import { World } from "@rbxts/jecs";
import { useDestructor, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players, Workspace } from "@rbxts/services";
import { camshake } from "shared/utils/functions/camShakeFunctions";
import { particlesEmit } from "shared/utils/functions/particlesFunctions";
import { EmitParticles, FollowInstance, systemQueue, Changed } from "shared/utils/jecs/jecsComponents";

// smoots out lerp
function lerpSmoothing<A extends Vector3 | CFrame>(startPos: A, endPos: A, deltaTime: number, smoothFactor: number): A {
    // Ensure smoothFactor is clamped between 0 and 1
    smoothFactor = math.clamp(smoothFactor, 0, 1);

    if (typeIs(startPos, "Vector3") && typeIs(endPos, "Vector3")) {
        return startPos.Lerp(endPos as Vector3, deltaTime * smoothFactor) as A;
    } else if (typeIs(startPos, "CFrame") && typeIs(endPos, "CFrame")) {
        return (startPos as CFrame).Lerp(endPos as CFrame, deltaTime * smoothFactor) as A;
    } else {
        error("lerpSmoothing: startPos and endPos must be of the same type (Vector3 or CFrame)");
    }
}

// emits the particles
export default (world: World) => {
    const delta = systemQueue.getDeltaTime()

    // for every single particle emitter
    for (const [emitEntity, { appliedTo, appliedFor, offset, speed }] of world.query(FollowInstance)) {
        if (!appliedTo.Parent || !appliedFor.Parent) {
            world.delete(emitEntity)
        } else {
            const startPosition = appliedTo.Position
            const goal = appliedFor.CFrame.mul(new CFrame(offset || Vector3.zero))
            const directionToGoal = goal.Position.sub(startPosition)
            const distanceToGo = math.min(delta * speed, directionToGoal.Magnitude)
            const totalDistanceToGo = directionToGoal.Unit.mul(distanceToGo)
            const newPosition = startPosition.add(totalDistanceToGo === totalDistanceToGo ? totalDistanceToGo : Vector3.zero)

            // moves it to goal
            appliedTo.CFrame = new CFrame(newPosition).mul(goal.Rotation)
        }
    }
}