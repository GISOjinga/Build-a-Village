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
const shops = paths.Map.WaitForChild("Shops")
const king = shops.WaitForChild("King").WaitForChild("Npc")
const merchant = shops.WaitForChild("Merchant").WaitForChild("Npc")
const architect = shops.WaitForChild("Architect").WaitForChild("Npc")
const witch = paths.Map.WaitForChild("Villagers").WaitForChild("Witch").WaitForChild("Npc")
const beekeeper = paths.Map.WaitForChild("Villagers").WaitForChild("Beekeeper").WaitForChild("Npc")
const animationsFolder = paths.Assets.WaitForChild("Animations")
const kingIdleTrack = king.WaitForChild("Humanoid").WaitForChild<Animator>("Animator").LoadAnimation(animationsFolder.WaitForChild("Shop").WaitForChild("King"));
const merchantIdleTrack = merchant.WaitForChild("Humanoid").WaitForChild<Animator>("Animator").LoadAnimation(animationsFolder.WaitForChild("Shop").WaitForChild("Merchant"));
const architectIdleTrack = architect.WaitForChild("Humanoid").WaitForChild<Animator>("Animator").LoadAnimation(animationsFolder.WaitForChild("Shop").WaitForChild("Architect"));
const witchIdleTrack = witch.WaitForChild("Humanoid").WaitForChild<Animator>("Animator").LoadAnimation(animationsFolder.WaitForChild("Villager").WaitForChild("Witch").WaitForChild("Production"));
const beekeeperIdleTrack = beekeeper.WaitForChild("Humanoid").WaitForChild<Animator>("Animator").LoadAnimation(animationsFolder.WaitForChild("Villager").WaitForChild("Beekeeper").WaitForChild("Production"));

export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player);
    const equippedTool = body && body.model.FindFirstChildOfClass("Tool");
    const tooType = equippedTool?.GetAttribute<ToolType>("ItemType")

    // makes sure animation is playing
    if (!kingIdleTrack?.IsPlaying) kingIdleTrack?.Play();
    if (!merchantIdleTrack?.IsPlaying) merchantIdleTrack?.Play();
    if (!architectIdleTrack?.IsPlaying) architectIdleTrack?.Play();
    if (!beekeeperIdleTrack?.IsPlaying) beekeeperIdleTrack?.Play();
    if (!witchIdleTrack?.IsPlaying) witchIdleTrack?.Play();

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