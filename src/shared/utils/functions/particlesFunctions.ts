import { copy } from "@rbxts/object-utils";
import { createMotion } from "@rbxts/ripple";
import { Workspace } from "@rbxts/services";

// this will loop through all descendannts for particles and emit a certian amount
export function particlesEmit(instance: Instance, amount?: number) {
    instance.GetDescendants().forEach((descendant) => { if (descendant.IsA("ParticleEmitter")) descendant.Emit(amount || descendant.GetAttribute("EmitCount") || 1); })
}

// loops through particles toggling their ennabledd
export function particlesToggle(instance: Instance, toggle: boolean) {
    instance.GetDescendants().forEach((descendant) => { if (descendant.IsA("ParticleEmitter")) descendant.Enabled = toggle; })
}

// loops through particles toggling their ennabledd
export function pointLightToggle(instance: Instance, toggle: boolean) {
    instance.GetDescendants().forEach((descendant) => { if (descendant.IsA("PointLight")) descendant.Enabled = toggle; })
}

// adds a parrticle to a location and emits it
export function addParticleAttachmentToLocation(attachment: Attachment, amount: number, CFrame: CFrame, destroyTime: number) {
    const newParticle = attachment.Clone()

    // setup
    newParticle.Parent = Workspace.Terrain
    newParticle.CFrame = CFrame
    particlesEmit(newParticle, amount)
}

// function to get you the keypoints mapped
function getKeyPointsMapped(particles: ParticleEmitter[], property: "Size" | "Transparency") {
    const originalKeyPoints = new Map<ParticleEmitter, NumberSequenceKeypoint[]>();

    // loops through all the particles and maps the original key points
    particles.forEach((particle) => {
        // sets the particle
        originalKeyPoints.set(particle, [])

        // loops through each keypoint to be added
        particle[property].Keypoints.forEach((keypoint) => {
            originalKeyPoints.get(particle)?.push(keypoint)
        })
    })

    return originalKeyPoints
}

// update particles Keypoints
function updateParticlesKeypoints(percentile: number, property: "Size" | "Transparency", originalKeyPoints: Map<ParticleEmitter, NumberSequenceKeypoint[]>) {
    originalKeyPoints.forEach((keypoints, particle) => {
        const newKeyPoints: NumberSequenceKeypoint[] = []

        // loops through each keypoint to be added
        keypoints.forEach((keypoint, index) => { // sets the keypoint
            newKeyPoints[index] = new NumberSequenceKeypoint(
                keypoint.Time,
                property === "Size" ? (keypoint.Value * percentile) : (keypoint.Value + ((1 - keypoint.Value) * (1 - percentile))),
                keypoint.Envelope
            )
        })

        // sets the keypoints
        particle[property] = new NumberSequence(newKeyPoints)
    })
}

// particles tween to 0
export function particlesTweenToZero(properties: ("Size" | "Transparency")[], particles: ParticleEmitter[], time: number) {
    const originalSizeKeyPoints = properties.includes("Size") && getKeyPointsMapped(particles, "Size")
    const originalTransparencyKeyPoints = properties.includes("Transparency") && getKeyPointsMapped(particles, "Transparency")
    const fakeTween = createMotion(1, { start: true })


    // for each step lerps each keypoint to 0
    fakeTween.onStep((percentile) => {
        // loops through all the particles and maps the original key points
        if (originalSizeKeyPoints) updateParticlesKeypoints(percentile, "Size", originalSizeKeyPoints)
        if (originalTransparencyKeyPoints) updateParticlesKeypoints(percentile, "Transparency", originalTransparencyKeyPoints)
    })

    // when completed destroys itself
    fakeTween.onComplete(() => fakeTween.destroy())

    // plays the tween
    fakeTween.tween(0, { time: time })
}