import { World } from "@rbxts/jecs";
import paths from "shared/utils/paths";






let chosenTrack: GameMusicNames | undefined = undefined;

// tells you if the track has been completed
function trackCompleted() {
    const trackFolder = chosenTrack && paths.SFX.GameMusic[chosenTrack]
    return !trackFolder || !trackFolder.FindFirstChild<Sound>("Sound" + trackFolder.GetChildren().size())?.IsPlaying;
}

export default (world: World) => {
    if (trackCompleted()) {
        const trackFoldersToChoseFrom = paths.SFX.GameMusic.GetChildren().filter((child) => child.Name !== chosenTrack)
        const folderToPlayMusicFrom = trackFoldersToChoseFrom[math.floor(trackFoldersToChoseFrom.size() * math.random())] as Folder;

        // sets the new chosen track
        chosenTrack = folderToPlayMusicFrom.Name as GameMusicNames;

        // plays through all the tracks
        task.spawn(() => {
            for (let i = 1; i <= folderToPlayMusicFrom.GetChildren().size(); i++) {
                const sound = folderToPlayMusicFrom.FindFirstChild<Sound>("Sound" + i);
                if (sound) {
                    sound.Playing = false;
                    sound.Play();
                    sound.Stopped.Wait()
                }
            }
        })
    }
}