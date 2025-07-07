import { World } from "@rbxts/jecs";
import { SoundService, Workspace } from "@rbxts/services";
import routes from "client/routes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";












export default (world: World) => {
    // when ever sounds is called to play
    useRoute(routes.playSound, (data) => {
        const soundPosition = data.position
        const sound = (data.sound as Sound).Clone() as Sound
        const goalParent = soundPosition ? new Instance("Attachment", Workspace.Terrain) : SoundService

        // if the sound has a position, it will create an attachment in the terrain
        if (soundPosition && goalParent.IsA("Attachment")) {
            goalParent.Position = soundPosition as never as Vector3
            goalParent.Name = "SoundAttachment"
            sound.Destroying.Connect(() => goalParent.Destroy())
        }

        // parents and plays it
        sound.Parent = goalParent

        if (data.pitch !== undefined) {
            let remainingPitch = data.pitch
            while (remainingPitch > 2) {
                const shift = new Instance("PitchShiftSoundEffect")
                shift.Octave = 2
                shift.Parent = sound
                remainingPitch /= 2
            }
            if (remainingPitch !== 1) {
                const shift = new Instance("PitchShiftSoundEffect")
                shift.Octave = remainingPitch
                shift.Parent = sound
            }
        }

        sound.Play()
        sound.Stopped.Connect(() => sound.Destroy())
    })
}