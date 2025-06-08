import { World } from "@rbxts/jecs";
import { useDestructor, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Players, Workspace } from "@rbxts/services";
import { camshake } from "shared/utils/functions/camShakeFunctions";
import { particlesEmit } from "shared/utils/functions/particlesFunctions";
import { CountDown, EmitParticles, systemQueue, Changed } from "shared/utils/jecs/jecsComponents";




// emits the particles
export default (world: World) => {
    for (const [emitEntity, emitParticle] of world.query(EmitParticles).without(CountDown)) {
        const { particles, amount, delay } = emitParticle

        // emits the particles
        particles.forEach(particle => particle.Emit(amount))

        // adds cooldown and updates the emit
        world.set(emitEntity, EmitParticles, ({
            ...emitParticle
        }))
        world.set(emitEntity, CountDown, delay)
    }
}