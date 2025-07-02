import { Entity, World } from "@rbxts/jecs";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { Body, LoadedAnimations, SetAnimation, systemQueue, Changed, StopAnimationsExcept } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";
import { savedAnimationTracks } from "./loadAnimations";
import Net from "@rbxts/yetanothernet";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";






export default (world: World) => {

    // stop all other animations
    for (const [bodyEntity, body, exceptions] of world.query(Body, StopAnimationsExcept)) {
        // Remove the StopAnimations component after processing
        world.remove(bodyEntity, StopAnimationsExcept)

        // Stop all animations except for the specified exceptions if any
        for (const [index, track] of pairs(body.animator.GetPlayingAnimationTracks())) {
            if (!track.Animation?.IsDescendantOf(paths.Assets.Animations) || exceptions?.includes(track)) continue
            print("Stopping ALL")
            track.Stop();
        }
    }

    // Play animations based on SetAnimation component
    // for (const [entity, body, { state, transition, stopAllOtherAnimations, path, speed, weight, timePosition }] of world.query(Body, SetAnimation, LoadedAnimations)) {
    //     const animations = savedAnimationTracks.get(body.animator)!;
    //     const animationTrack = animations.get(path)

    //     // Remove the SetAnimation component after processing
    //     world.remove(entity, SetAnimation);

    //     if (!animationTrack) {
    //         warn(`Missing animation track for ${path} on ${body.model.Name}`);
    //         return;
    //     } else {
    //         // Adjust animation properties
    //         animationTrack.AdjustSpeed(speed || animationTrack.Speed);
    //         animationTrack.AdjustWeight(weight || animationTrack.WeightTarget);
    //         animationTrack.TimePosition = timePosition || animationTrack.TimePosition;

    //         // Stop all other animations if specified
    //         if (stopAllOtherAnimations) {
    //             for (const track of body.animator.GetPlayingAnimationTracks()) {
    //                 if (track !== animationTrack) {
    //                     track.Stop();
    //                 }
    //             }
    //         }

    //         // Play or stop the animation
    //         if (state === "Play") {
    //             animationTrack.Play(transition || 0);
    //         } else if (state === "Stop") {
    //             animationTrack.Stop(transition || 0);
    //         }
    //     }
    // }
}