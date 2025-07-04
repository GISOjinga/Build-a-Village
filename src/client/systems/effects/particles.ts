import { World } from "@rbxts/jecs";
import { useDestructor, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Debris, Players, Workspace } from "@rbxts/services";
import { camshake } from "shared/utils/functions/camShakeFunctions";
import { particlesEmit } from "shared/utils/functions/particlesFunctions";
import { CountDown, EmitParticles, systemQueue, Changed, IncreaseParticlesSize, Added, Data } from "shared/utils/jecs/jecsComponents";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";


// variables
const player = Players.LocalPlayer

// emits the particles
export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player)

    // when data changes
    for (const [_, changedData] of world.query(Changed(Data))) {
        const oldData = changedData.old
        const newData = changedData.new

        // if body and total new produce is greeater than total old produce then
        if (body && oldData && newData) {
            const totalOldProduce = oldData.Produce
            const totalNewProduce = newData.Produce
            const totalAmountOfNewProduce = totalNewProduce.reduce((acc, produce) => acc + produce.Amount, 0)
            const totalAmountOfOldProduce = totalOldProduce.reduce((acc, produce) => acc + produce.Amount, 0)

            // if it increased
            if (totalAmountOfNewProduce > totalAmountOfOldProduce) {
                const collectEffect = paths.Assets.Particles.Collection.Clone()

                // parents then places it at the body
                collectEffect.Parent = Workspace.Terrain
                collectEffect.CFrame = body.rootPart.CFrame
                particlesEmit(collectEffect)
                Debris.AddItem(collectEffect, 10)
            }
        }
    }

    // increases the size of particles
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

    // emits the particles
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