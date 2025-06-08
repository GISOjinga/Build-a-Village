import { Debris, Workspace } from "@rbxts/services"
import paths from "../paths"
import { particlesEmit, particlesToggle } from "./particlesFunctions"



// the effects functions
export default {
    // // the explosion
    // Explosion: ({ position }) => {
    //     const fireBreathFolder = paths.Assets.Justus.FireBreath
    //     const explosion = fireBreathFolder.EndOfFireBreath.Explosion.Clone()

    //     // to emit the particle
    //     explosion.Parent = Workspace.Terrain
    //     explosion.Position = position
    //     particlesEmit(explosion, 3)
    //     Debris.AddItem(explosion, 2)
    // },

    // // the flame thrower
    // FlameThrower: ({ target, state }) => {
    //     if (target.IsA("BasePart")) {
    //         if (state === "Start") {
    //             const fireBreathFolder = paths.Assets.Justus.FireBreath
    //             const flameThrower = fireBreathFolder.FlameThrower.FaceAttachment.Clone()

    //             // the set up
    //             flameThrower.Parent = target
    //             flameThrower.Visible = state === "Start"
    //         } else if (state === "Stop") {
    //             const attachment = target.FindFirstChild("FaceAttachment")

    //             // destroys the attachment
    //             if (attachment) {
    //                 particlesToggle(attachment, false)
    //                 Debris.AddItem(attachment, 2)
    //             }
    //         }
    //     }
    // }
} as { [key in string]: (data: { target: Instance, position: Vector3, state?: "Start" | "Stop" }) => void }