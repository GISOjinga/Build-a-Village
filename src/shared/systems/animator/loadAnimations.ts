import { Entity, World } from "@rbxts/jecs";
import { ContentProvider, RunService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { addComponent, removeComponent, warnJecs } from "shared/utils/functions/jecsHelpFunctions";
import { Body, LoadedAnimations, LoadingAnimations, systemQueue, Changed, Villager, VillagerAnimator, Removed, TargetEntity } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";


task.spawn(() => ContentProvider.PreloadAsync(paths.Assets.Animations.GetDescendants().filter(asset => asset.IsA("Animation"))))

// list of all animations
export const savedAnimationTracks = new WeakMap<Animator, Map<Animation, AnimationTrack>>()

// to get the animation
export function getAnimation(animator: Animator, animation: Animation): AnimationTrack | undefined {
    let track = savedAnimationTracks.get(animator)?.get(animation);

    if (!track) {
        track = animator.LoadAnimation(animation);

        if (!savedAnimationTracks.has(animator)) {
            savedAnimationTracks.set(animator, new Map());
        }
        savedAnimationTracks.get(animator)!.set(animation, track);
    }
    return track
}

export default (world: World) => {
    // villagers without loading animations
    for (const [entity, { villagerModel }] of world.query(Villager).without(LoadingAnimations)) {
        Promise.try(() => {
            if (!villagerModel.FindFirstChild("Npc")) return
            const animator = new Instance("Animator", villagerModel.Npc.Humanoid);
            const animations = new Map<Animation, AnimationTrack>();
            let totalToLoad = 0

            // loops through all assets for animations to load
            paths.Assets.Animations.GetDescendants().forEach(asset => {
                if (asset.IsA("Animation")) {
                    const loadedAnimation = animator.LoadAnimation(asset)

                    // saves the animation
                    totalToLoad++
                    animations.set(
                        asset,
                        loadedAnimation,
                    )
                }
            })

            // saves it to the entity
            addComponent(entity, LoadedAnimations)
            addComponent(entity, LoadingAnimations)
            addComponent(entity, VillagerAnimator, animator)
            savedAnimationTracks.set(animator, animations)
        }).catch((err) => warnJecs($line, "Error loading animations for villager: ", entity));
    }

    // for all bodies with out loaded animations
    for (const [entity, { animator }] of world.query(Body).without(LoadingAnimations)) {
        Promise.try(() => {
            const animations = new Map<Animation, AnimationTrack>();
            let totalToLoad = 0

            // loops through all assets for animations to load
            paths.Assets.Animations.GetDescendants().forEach(asset => {
                if (asset.IsA("Animation")) {
                    const loadedAnimation = animator.LoadAnimation(asset)

                    // saves the animation
                    totalToLoad++
                    animations.set(
                        asset,
                        loadedAnimation,
                    )
                }
            })

            // saves it to the entity
            addComponent(entity, LoadingAnimations)
            addComponent(entity, LoadedAnimations)
            savedAnimationTracks.set(animator, animations)
        }).catch((err) => warnJecs($line, "Error loading animations for body: ", entity));
    }

    // if body gets removed then remove loading animation and loaded animations
    for (const [_, entity, { animator }] of world.query(TargetEntity, Removed(Body))) {
        Promise.try(() => {
            if (!animator) return

            // remove loading animations
            if (world.contains(entity)) removeComponent(entity, LoadingAnimations, LoadedAnimations)
            // remove saved animations
            savedAnimationTracks.delete(animator)
        }).catch((err) => warnJecs($line, "Error removing animations for body: ", entity));
    }
}