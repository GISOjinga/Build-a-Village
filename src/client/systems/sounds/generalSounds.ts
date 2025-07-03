import { World } from "@rbxts/jecs";
import { SoundService, Workspace } from "@rbxts/services";
import routes from "client/routes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";












export default (world: World) => {
    // when ever sounds is called to play
    useRoute(routes.playSound, (data) => {
        const soundPosition = data.position
        const sound = data.sound.Clone() as Sound
        const goalParent = soundPosition ? new Instance("Attachment", Workspace.Terrain) : SoundService

        // if the sound has a position, it will create an attachment in the terrain
        if (soundPosition && goalParent.IsA("Attachment")) {
            goalParent.Position = soundPosition
            goalParent.Name = "SoundAttachment"
            sound.Destroying.Connect(() => goalParent.Destroy())
        }

        // parents and plays it
        sound.Parent = goalParent
        sound.Play()
        sound.Stopped.Connect(() => sound.Destroy())
    })
}