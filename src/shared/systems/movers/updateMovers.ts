import { World } from "@rbxts/jecs";
import { Debris } from "@rbxts/services";
import { Body, DisableAutoRotate, Float, MoveTo, TurnTo, systemQueue, Changed, AlignPosition, Removed, ZeroOutVelocity } from "shared/utils/jecs/jecsComponents";



export default (world: World) => {
    const delta = systemQueue.getDeltaTime();

    // makes you float
    for (const [entity, floatInfo] of world.query(Float)) {
        const { duration, linearVelocity, bodyEntity } = floatInfo;
        const body = world.get(bodyEntity, Body)

        // sets up the floater
        linearVelocity.ForceLimitMode = Enum.ForceLimitMode.PerAxis
        linearVelocity.MaxAxesForce = new Vector3(0, 1e10, 0)
        linearVelocity.VectorVelocity = Vector3.zero;
        linearVelocity.Attachment0 = body?.rootAttachment;
        linearVelocity.Name = "FloaterBodyVelocity"
        linearVelocity.Parent = body?.rootPart;

        // counts down the floater
        if (duration > 0) {
            world.set(entity, Float, ({ ...floatInfo, duration: duration - delta }));
        } else {
            // destroys the floater
            linearVelocity.Destroy()

            // destroys the entity
            world.delete(entity)
        }
    }

    // for all zerooutvelocity entites
    for (const [_, basePart] of world.query(ZeroOutVelocity)) {
        basePart.AssemblyLinearVelocity = Vector3.zero
    }

    // updates AlignPosition
    for (const [entity, { attachment1, attachment0, velocity, alignPosition }] of world.query(AlignPosition)) {
        alignPosition.Attachment0 = attachment0;
        alignPosition.Attachment1 = attachment1;
        alignPosition.MaxForce = 1e6
        alignPosition.Responsiveness = 200
        alignPosition.MaxVelocity = velocity
    }

    // when align position is removed
    for (const [entity, { alignPosition }] of world.query(Removed(AlignPosition))) {
        alignPosition.MaxVelocity = 0
        Debris.AddItem(alignPosition, .1)
    };

    // Loop through all entities with the TurnTo component
    for (const [entity, moveTo] of world.query(MoveTo)) {
        const { direction, destroyEntityOnComplete, forceLimitMode, linearVelocity, attachment, duration, decelerationRate, maxAxesForce, maxForce, relativeTo, onDestroyedCallback } = moveTo;

        // Setup align orientation
        linearVelocity.RelativeTo = relativeTo || Enum.ActuatorRelativeTo.World;
        linearVelocity.ForceLimitMode = forceLimitMode || linearVelocity.ForceLimitMode
        linearVelocity.VectorVelocity = direction;
        linearVelocity.MaxAxesForce = maxAxesForce || Vector3.one.mul(1e6)
        linearVelocity.MaxForce = maxForce || 1e6
        linearVelocity.Attachment0 = attachment;
        pcall(() => linearVelocity.Parent = attachment)

        // does the count down
        if (duration && duration > 0) {
            const currentSpeed = direction.Magnitude;
            const newSpeed = decelerationRate ? math.max(currentSpeed - decelerationRate * delta, 0) : currentSpeed

            // destroys the align orientation
            world.set(entity, MoveTo, ({ ...moveTo, duration: duration - delta, direction: currentSpeed > 0 ? direction.Unit.mul(newSpeed) : new Vector3(0, 0, 0) }));
        } else if (duration === 0 || (duration && duration <= 0)) {
            // destroys the align orientation
            pcall(() => linearVelocity.Destroy())

            // destroys the entity
            if (destroyEntityOnComplete) {
                onDestroyedCallback?.()
                world.delete(entity);
            } else {
                world.remove(entity, MoveTo);
            }
        }
    }

    // Loop through all entities with the TurnTo component
    for (const [entity, turnTo] of world.query(TurnTo)) {
        const { destroyEntityOnComplete, maxTorque, target, responsiveness, alignOrientation, attachment } = turnTo;

        // Setup align orientation 
        alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
        alignOrientation.MaxTorque = maxTorque || 1e6;
        alignOrientation.Responsiveness = responsiveness || 100;
        alignOrientation.CFrame = attachment.WorldCFrame;
        alignOrientation.Attachment0 = attachment;

        // Update the align orientation
        alignOrientation.CFrame = CFrame.lookAt(
            attachment.WorldPosition,
            typeIs(target, "Instance") ? target.Position : target
        )

        // does the count down
        if (turnTo.duration > 0) {
            world.set(entity, TurnTo, ({ ...turnTo, duration: turnTo.duration - delta }));
        } else {
            // destroys the align orientation
            alignOrientation.Destroy();

            // destroys the entity
            if (destroyEntityOnComplete) {
                world.delete(entity);
            } else {
                world.remove(entity, TurnTo);
            }
        }
    }
}