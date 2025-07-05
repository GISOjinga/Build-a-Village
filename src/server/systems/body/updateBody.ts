import ByteNet from "@rbxts/bytenet-fixed";
import { Entity, pair, World } from "@rbxts/jecs";
import { useMemo } from "@rbxts/react";
import { Debris, Players, Workspace } from "@rbxts/services";
import routes from "server/routes";
import { useEvent } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { getCharacterParts } from "shared/utils/functions/characterFunctions";
import { addComponent, getEntity, setEntity } from "shared/utils/functions/jecsHelpFunctions";
import { particlesToggle } from "shared/utils/functions/particlesFunctions";
import { Added, Body, BodyHidden, Changed, NoBodyCollisions, ModelDebugger, Player, PlayerState, TargetEntity, Removed, Platform, Data } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";
import { createInitialPlayerState } from "shared/utils/PlayerState";
import { logTutorialStep, TutorialStep, logGameEvent, GameEvent } from "../../utils/analytics";


// players and their shop page states
const playersShopPageStates = new Map<Player, "Sell" | "Buy" | "None">();

// For all non-player characters, give them a body.
export default (world: World) => {
    const playerModels = paths.Characters.Players.GetChildren<Model>();

    // Listen for players.
    playerModels.forEach(model => {
        const player = Players.GetPlayerFromCharacter(model);

        // If the character is not already a player and has no ServerId attribute, give it a body.
        if (player && !model.GetAttribute("ServerId")) {
            const [humanoid, rootPart, head, animator, rootAttachment] = getCharacterParts(model as Model);

            // Give the character a body if all required parts exist.
            if (model && humanoid && rootPart && animator && rootAttachment && head) {
                const entity = player.GetAttribute<Entity>("ServerId") || world.entity();
                addComponent(entity, Player, player);
                world.set(entity, Body, {
                    head,
                    model,
                    humanoid,
                    rootPart,
                    animator,
                    rootAttachment,
                    platform: undefined,
                });

                world.set(entity, ModelDebugger, model);

                // Set the ServerId attribute on both player and model.
                player.SetAttribute("ServerId", entity);
                model.SetAttribute("ServerId", entity);
            }
        }
    });
    // Listen for changes in Body components and handle death/despawn.
    for (const [_, entity, { model, humanoid }] of world.query(TargetEntity, Added(Body))) {
        const newModel = model as Character<R6> | undefined;
        const player = world.get(entity, Player);

        // sets the player page state
        if (player) playersShopPageStates.set(player, "None"); // reset player shop page state

        // set up
        humanoid.MaxSlopeAngle = 45

        // When the humanoid dies, destroy the model.
        newModel?.Humanoid.Died.Connect(() => {
            newModel.Destroy();
        });

        // When the model is destroying, delete its entity.
        newModel?.Destroying.Connect(() => {
            if (world.contains(entity)) {
                world.remove(entity, Body);
            }
        });
    }

    // if dashing and locked on for side step
    // for (const [bodyEntity, { linearVelocity, totalTime, directions }, { rootAttachment, rootPart, animator }, targetEntity] of world.query(Dashing, Body, LockedOn)) {
    //     const targetRootPart = world.contains(targetEntity) ? world.get(targetEntity, Body)?.rootPart : undefined;
    //     const maxDistanceFromTarget = getEntity.flashStepTargetDistance()
    //     const distanceFromTarget = targetRootPart ? (rootPart.Position.sub(targetRootPart.Position)).Magnitude : maxDistanceFromTarget + 1;

    //     // if distanceFromTarget is less than or equal to maxDistanceFromTarget then
    //     if (distanceFromTarget <= maxDistanceFromTarget) {
    //         // makes sure body is hidden
    //         world.set(bodyEntity, BodyHidden, true);
    //     }
    // }



    // When body spawns, add every part to the character.
    for (const [_, targetEntity, changed] of world.query(TargetEntity, Changed(Body))) {
        const newModel = changed.new?.model || changed.old?.model;
        if (!changed.old && changed.new) {
            newModel?.GetDescendants().forEach(child => {
                if (child.IsA("BasePart")) child.CollisionGroup = world.has(targetEntity, NoBodyCollisions) ? "CharactersNoCollide" : "Characters";
            });
            newModel?.DescendantAdded.Connect(descendant => {
                if (descendant.IsA("BasePart")) descendant.CollisionGroup = world.has(targetEntity, NoBodyCollisions) ? "CharactersNoCollide" : "Characters";
            });
        }
    }

    // when ever NoBodyCollisions added
    for (const [_, targetEntity] of world.query(TargetEntity, Added(NoBodyCollisions))) {
        const body = world.get(targetEntity, Body);

        // if body then
        if (body) body.model.GetDescendants().forEach(child => {
            if (child.IsA("BasePart")) child.CollisionGroup = "CharactersNoCollide";
        });
    }

    // when ever NoBodyCollisions removed
    for (const [_, targetEntity] of world.query(TargetEntity, Removed(NoBodyCollisions))) {
        const body = world.get(targetEntity, Body);

        // if body then
        if (body) body.model.GetDescendants().forEach(child => {
            if (child.IsA("BasePart")) child.CollisionGroup = "Characters";
        });
    }


    // use route watching for village teleport
    useRoute(routes.teleportToVillage, (_, player) => {
        const entity = getEntity.fromInstance(player);
        const body = entity && world.get(entity, Body);
        const platformEntity = entity && world.get(entity, pair(TargetEntity, Platform));
        const platform = platformEntity && world.get(platformEntity, Platform);

        // if platform and body then teleports the players rootpart to the platform spawn
        if (platform && body) {
            routes.togglePage.sendTo("None", player); // close sell menu if open
            routes.playParticle.sendToAll({ particle: paths.Assets.Particles.Poof, location: body.rootPart.Position, forceAmount: 30 })
            body.rootPart.CFrame = platform.SpawnLocation.CFrame.add(Vector3.yAxis.mul(5))
            routes.playParticle.sendToAll({ particle: paths.Assets.Particles.Poof, location: body.rootPart.Position, forceAmount: 30 })
        }
    })

    // use route watching for shop teleport
    useRoute(routes.teleportToShop, (shopName, player) => {
        const entity = getEntity.fromInstance(player);
        const [body, data] = entity ? world.get(entity, Body, Data) : [] as never;
        const shopSpawn = paths.Map.Shops[shopName === "Buy" ? "King" : shopName === "Sell" ? "Merchant" : "Architect"].SpawnLocation

        // if platform and body then teleports the players rootpart to the platform spawn
        if (body) {
            routes.playParticle.sendToAll({ particle: paths.Assets.Particles.Poof, location: body.rootPart.Position, forceAmount: 30 })
            body.rootPart.CFrame = shopSpawn.CFrame
            routes.playParticle.sendToAll({ particle: paths.Assets.Particles.Poof, location: body.rootPart.Position, forceAmount: 30 })
        }

        if (shopName === "Buy" && data && data.Tutorial === 0) {
            logTutorialStep(player, TutorialStep.ShopOpened, "tutorial_shop_opened")
        }

        if (shopName === "Sell") {
            logGameEvent(player, GameEvent.MerchantMenuOpened)
        } else if (shopName === "Wall") {
            logGameEvent(player, GameEvent.ArchitectMenuOpened)
        }
    })
};
