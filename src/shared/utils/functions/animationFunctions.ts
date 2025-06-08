import { Janitor } from "@rbxts/janitor";
import Signal from "@rbxts/signal";
import { createInterval } from "./threadsFunctions";




// this function will create a fake remote event that fires based on if a marker is reached or animation end
export function animationMarkerForced(animationTrack: AnimationTrack, markerName: string): Signal {
    const trash = new Janitor()
    const signal = new Signal()

    // adds animation track marker to trash
    signal.Connect(() => {
        print("Cleaning up animationMarkerForced")
        trash.Destroy()
    })
    trash.Add(animationTrack.GetMarkerReachedSignal(markerName).Connect(() => signal.Fire()))
    trash.Add(animationTrack.Stopped.Connect(() => signal.Fire()))
    trash.Add(animationTrack.Ended.Connect(() => signal.Fire()))
    trash.Add(animationTrack.Destroying.Connect(() => signal.Fire()))
    // trash.Add(createInterval(() => {
    //     if (!animationTrack.IsPlaying) signal.Fire();;
    // }, .1))

    return signal
}