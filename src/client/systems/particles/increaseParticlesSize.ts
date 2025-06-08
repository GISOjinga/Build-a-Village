import { World } from "@rbxts/jecs";
import { useDestructor, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players, Workspace } from "@rbxts/services";
import { camshake } from "shared/utils/functions/camShakeFunctions";
import { particlesEmit } from "shared/utils/functions/particlesFunctions";
import { IncreaseParticlesSize, systemQueue, Changed, CountDown } from "shared/utils/jecs/jecsComponents";




// emits the particles
export default (world: World) => {
    for (const [emitEntity, emitParticle] of world.query(IncreaseParticlesSize).without(CountDown)) {
        const { particles, multiplier, size, delay, max } = emitParticle
        const newSize = size * multiplier

        // emits the particles
        particles.forEach(particle => particle.Size = new NumberSequence(size))

        // adds cooldown and updates the emit
        world.set(emitEntity, IncreaseParticlesSize, ({
            ...emitParticle,
            size: math.min(newSize, max || newSize)
        }))
        world.set(emitEntity, CountDown, delay)
    }
}