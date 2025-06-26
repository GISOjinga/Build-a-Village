import { World } from "@rbxts/jecs";
import paths from "shared/utils/paths";






let chosenTrack: GameMusicNames | undefined = undefined;
let playingTrack: number = 0;

// tells you if the track has been completed
function trackCompleted() {
    const trackFolder = chosenTrack && paths.SFX.GameMusic[chosenTrack]
    return !trackFolder || playingTrack > trackFolder.GetChildren().size()
}

export default (world: World) => {
    const trackFolder = chosenTrack && paths.SFX.GameMusic[chosenTrack]
    const playingSound = trackFolder && trackFolder.FindFirstChild<Sound>("Sound" + playingTrack);
    if (trackCompleted()) {
        const trackFoldersToChoseFrom = paths.SFX.GameMusic.GetChildren().filter((child) => child.Name !== chosenTrack)
        const folderToPlayMusicFrom = trackFoldersToChoseFrom[math.floor(trackFoldersToChoseFrom.size() * math.random())] as Folder;

        // sets the new chosen track
        chosenTrack = folderToPlayMusicFrom.Name as GameMusicNames;
        playingTrack = 0;
    } else if (!playingSound?.IsPlaying && trackFolder) {
        playingTrack += 1;
        trackFolder.FindFirstChild<Sound>("Sound" + playingTrack)?.Play();
    }
}