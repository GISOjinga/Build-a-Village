import { World } from "@rbxts/jecs";
import { useDestructor, useEvent, useMemo, useThrottle } from "shared/Plugin-Hook";
import { Debris, Players, Workspace } from "@rbxts/services";
import { camshake } from "shared/utils/functions/camShakeFunctions";
import { particlesEmit } from "shared/utils/functions/particlesFunctions";
import { CountDown, EmitParticles, systemQueue, Changed, IncreaseParticlesSize, Added, Data, Body, CastParticle, CanQuery } from "shared/utils/jecs/jecsComponents";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import paths from "shared/utils/paths";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import routes from "client/routes";


// variables
const player = Players.LocalPlayer



// emits the particles
export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player)

    // listens for when the particle is called
    useRoute(routes.playParticle, createEntity.particle)

    // when cast particles are emitted
    for (const [particleEntity, { particle: _particle, forceAmount, location, color }] of world.query(CastParticle).with(CanQuery(CastParticle))) {
        const particle = location ? _particle.Clone() : _particle

        // if particle is an attachment with a location then clone and place
        if (location && particle.IsA("Attachment")) {
            particle.Parent = Workspace.Terrain

            // changes color
            particle.GetDescendants().forEach(descendant => { if (descendant.IsA("ParticleEmitter") && color) { descendant.Color = color } })

            // places it
            if (typeIs(location, "CFrame")) {
                particle.CFrame = location
            } else {
                particle.Position = location
            }

            // emits it
            particlesEmit(particle, forceAmount)
            Debris.AddItem(particle, 10)
        }

        // deletes the entity
        world.delete(particleEntity)
    }

    // when data changes
    for (const [_, changedData] of world.query(Changed(Data))) {
        const oldData = changedData.old
        const newData = changedData.new

        // if body and total new produce is greeater than total old produce then
        if (body && oldData && newData) {
            const oldTutorial = oldData.Tutorial
            const newTutorial = newData.Tutorial

            // if old and new tutorial arent the same and new tutorial is done then do the surprise particles
            if (oldTutorial !== newTutorial && newTutorial === "Done") {
                const collectEffect = paths.Assets.Particles.Surprise.Clone()

                // parents then places it at the body
                collectEffect.Parent = Workspace.Terrain
                collectEffect.CFrame = body.rootPart.CFrame
                particlesEmit(collectEffect, 30)
                Debris.AddItem(collectEffect, 5)
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