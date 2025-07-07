import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { $line } from "rbxts-transformer-inline";
import routes from "client/routes";
import { useChange, useEvent, useMemo, useThrottle } from "shared/Plugin-Hook";
import { addComponent, createEntity, getEntity, printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Raycast } from "shared/utils/functions/rayFunctions";
import { Added, Body, CanQuery, TargetEntity, WalkEffect } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";



// variables
const player = Players.LocalPlayer
const giftingPrompts = new Map<Player, ProximityPrompt>();

export default (world: World) => {
    const kingIdle = paths.Assets.Animations.Shop.King;
    const merchantIdle = paths.Assets.Animations.Shop.Merchant;
    const architectIdle = paths.Assets.Animations.Shop.Architect
    const king = paths.Map.Shops.King.Npc
    const merchant = paths.Map.Shops.Merchant.Npc
    const architect = paths.Map.Shops.Architect.Npc
    const beekeeper = paths.Map.Villagers.FindFirstChild("Beekeeper") as Model | undefined;
    const witch = paths.Map.Villagers.FindFirstChild("Witch") as Model | undefined;

    // const kingIdleTrack = useMemo(() => {
    //     const humanoid = king.FindFirstChildOfClass("Humanoid");
    //     const animator = humanoid?.FindFirstChildOfClass("Animator");
    //     return animator ? animator.LoadAnimation(kingIdle) : undefined;
    // }, [king]);

    // const merchantIdleTrack = useMemo(() => {
    //     const humanoid = merchant.FindFirstChildOfClass("Humanoid");
    //     const animator = humanoid?.FindFirstChildOfClass("Animator");
    //     return animator ? animator.LoadAnimation(merchantIdle) : undefined;
    // }, [merchant]);

    // const architectIdleTrack = useMemo(() => {
    //     const humanoid = architect.FindFirstChildOfClass("Humanoid");
    //     const animator = humanoid?.FindFirstChildOfClass("Animator");
    //     return animator ? animator.LoadAnimation(architectIdle) : undefined;
    // }, [architect]);

    // const beekeeperIdleTrack = useMemo(() => {
    //     if (!beekeeper) return undefined;
    //     const humanoid = beekeeper.FindFirstChildOfClass("Humanoid") as Humanoid | undefined;
    //     if (!humanoid) return undefined;
    //     const animator = humanoid.FindFirstChildOfClass("Animator") as Animator | undefined;
    //     if (!animator) return undefined;
    //     return animator.LoadAnimation(paths.Assets.Animations.Villager.Beekeeper.Production);
    // }, [beekeeper]);

    // const witchIdleTrack = useMemo(() => {
    //     if (!witch) return undefined;
    //     const humanoid = witch.FindFirstChildOfClass("Humanoid") as Humanoid | undefined;
    //     if (!humanoid) return undefined;
    //     const animator = humanoid.FindFirstChildOfClass("Animator") as Animator | undefined;
    //     if (!animator) return undefined;
    //     return animator.LoadAnimation(paths.Assets.Animations.Villager.Witch.Production);
    // }, [witch]);
    const body = getEntity.bodyFromPlayer(player);
    const equippedTool = body && body.model.FindFirstChildOfClass("Tool");
    const tooType = equippedTool?.GetAttribute<ToolType>("ItemType")

    // makes sure animation is playing
    // if (!kingIdleTrack?.IsPlaying) kingIdleTrack?.Play();
    // if (!merchantIdleTrack?.IsPlaying) merchantIdleTrack?.Play();
    // if (!architectIdleTrack?.IsPlaying) architectIdleTrack?.Play();
    // if (!beekeeperIdleTrack?.IsPlaying) beekeeperIdleTrack?.Play();
    // if (!witchIdleTrack?.IsPlaying) witchIdleTrack?.Play();

    // casts a ray down if body and if standing on a platform floor then increase walkspeed on humanoid to 20 else 16 with tracer
    if (useThrottle(.1) && body) {
        const rootCFrame = body.rootPart.CFrame;
        const results = Tracer.ray(rootCFrame.Position, Vector3.yAxis, -6).useRaycastParams(Raycast.Include.Floors).run()

        // sets the walkspeed
        body.humanoid.WalkSpeed = results.hit ? 16 : 25;
    }

    // when ever tooType changes
    if (useChange([tooType])) giftingPrompts.forEach((prompt, playerToGift) => prompt.Enabled = tooType === "Commodity");

    // friendPrompts.forEach((prompt, otherPlayer) => {
    //     prompt.Enabled = true;
    //     for (const [] of useEvent(prompt.Triggered, debug.traceback() + otherPlayer.UserId)) {
    //         if (otherPlayer !== Players.LocalPlayer) {
    //             printJecs($line, "Adding friend: ", otherPlayer.Name);
    //             routes.requestAddFriend.send(otherPlayer);
    //         }
    //     }
    // })

    // adds a walkeffect to body if without walkeffect
    for (const [bodyEntity] of world.query(Body).without(WalkEffect)) addComponent(bodyEntity, WalkEffect, "Left")

    // for each body
    if (useThrottle(.1)) {
        for (const [bodyEntity, { rootPart, humanoid, model }, selectedFootName] of world.query(Body, WalkEffect).with(CanQuery(Body))) {
            const leftFoot = model.FindFirstChild<BasePart>("LeftFoot");
            const rightFoot = model.FindFirstChild<BasePart>("RightFoot");

            // if both feet then
            if (leftFoot && rightFoot && humanoid.MoveDirection.Magnitude > 0) {
                const selectedFoot = selectedFootName === "Left" ? leftFoot : rightFoot;
                const footHeight = selectedFoot.Size.Y;
                const footPosition = selectedFoot.Position;
                const rayResults = Tracer.ray(footPosition, Vector3.yAxis, -((footHeight / 2) + 1)).useRaycastParams(Raycast.Include.Map).run();

                // if it hit something then switch walk effect
                if (rayResults.hit) {
                    addComponent(bodyEntity, WalkEffect, selectedFootName === "Left" ? "Right" : "Left");
                    createEntity.particle({
                        particle: paths.Assets.Particles.WalkingEffects,
                        color: new ColorSequence(rayResults.hit.Color),
                        location: footPosition,
                        forceAmount: math.random(10, 15)
                    })
                }
            }
        }
    }

    // when a body is added, we add a proximity prompt to it
    for (const [_, clientEntity, body2] of world.query(TargetEntity, Added(Body))) {
        const giftingPrompt = paths.Assets.ProximityPrompts.GiftingProximityPrompt.Clone();
        // const friendPrompt = paths.Assets.ProximityPrompts.AddFriend.Clone();
        const player2 = body2 && Players.GetPlayerFromCharacter(body2.model)

        // when added it sets the client id property
        body2?.model.SetAttribute("ClientId", clientEntity)
        player2?.SetAttribute("ClientId", clientEntity)
        if (player2 && player2 !== Players.LocalPlayer) {
            giftingPrompts.set(player2, giftingPrompt)
            player2.Destroying.Once(() => giftingPrompts.delete(player2))
            giftingPrompt.Parent = body2.rootPart
            giftingPrompt.Enabled = tooType === "Commodity"

            giftingPrompt.Triggered.Connect(() => {
                const body = getEntity.bodyFromPlayer(player);
                const equippedTool = body && body.model.FindFirstChildOfClass("Tool");

                // if the player is not the local player, we send a gift request
                if (player !== player2 && equippedTool) {
                    printJecs($line, "Gifting to player: ", player2.Name, " with tool: ", equippedTool?.Name);
                    routes.giftToPlayer.send({
                        playerToGift: player2,
                        produceTool: equippedTool
                    })
                }
            })
        }
    }
}