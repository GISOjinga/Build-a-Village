import { Entity, World } from "@rbxts/jecs";
import { ContentProvider } from "@rbxts/services";
import { addComponent } from "shared/utils/functions/jecsHelpFunctions";
import { Body, LoadedAnimations, LoadingAnimations, systemQueue, Changed } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";


task.spawn(() => ContentProvider.PreloadAsync(paths.Assets.Animations.GetDescendants().filter(asset => asset.IsA("Animation"))))

// list of all animations
export const savedAnimationTracks = new WeakMap<Animator, Map<string, AnimationTrack>>()

// to get the animation
export function getAnimation(animator: Animator, animation: Animation): AnimationTrack | undefined {
    let track = savedAnimationTracks.get(animator)?.get(animation.GetFullName());

    if (!track) {
        track = animator.LoadAnimation(animation);

        if (!savedAnimationTracks.has(animator)) {
            savedAnimationTracks.set(animator, new Map());
        }
        savedAnimationTracks.get(animator)!.set(animation.GetFullName(), track);
    }
    return track
}

export default (world: World) => {
    // for all bodies with out loaded animations
    for (const [entity, { animator }] of world.query(Body).without(LoadingAnimations)) {
        const animations = new Map<string, AnimationTrack>();
        let totalToLoad = 0

        // loops through all assets for animations to load
        paths.Assets.Animations.GetDescendants().forEach(asset => {
            if (asset.IsA("Animation")) {
                const loadedAnimation = animator.LoadAnimation(asset)

                // plays the animation
                // task.defer(() => {
                //     while (animator.GetPlayingAnimationTracks().size() > 200) {
                //         for (const track of animator.GetPlayingAnimationTracks()) { if (track.Length > 0 || track.TimePosition > 0) track.Stop() }
                //         task.wait(.01)
                //     }

                //     loadedAnimation.Play()
                //     task.wait(.01)
                //     loadedAnimation.Stop()
                //     totalToLoad--
                //     if (totalToLoad <= 0) world.set(entity, LoadedAnimations, true)
                // })

                // saves the animation
                totalToLoad++
                animations.set(
                    asset.GetFullName(),
                    loadedAnimation,
                )
            }
        })

        // saves it to the entity
        addComponent(entity, LoadedAnimations)
        savedAnimationTracks.set(animator, animations)
    }
}