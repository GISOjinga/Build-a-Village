import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { useEvent, useMemo, useThrottle } from "shared/Plugin-Hook";
import { getEntity, printJecs } from "shared/utils/functions/jecsHelpFunctions";
import { Raycast } from "shared/utils/functions/rayFunctions";
import { Added, Body, TargetEntity } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";



// variables
const player = Players.LocalPlayer
const giftingPrompts = new WeakMap<Player, ProximityPrompt>();
const friendPrompts = new WeakMap<Player, ProximityPrompt>();

export default (world: World) => {
    const kingIdle = paths.Assets.Animations.Shop.King;
    const merchantIdle = paths.Assets.Animations.Shop.Merchant;
    const architectIdle = paths.Assets.Animations.Shop.Architect
    const king = paths.Map.Shops.King.Npc
    const merchant = paths.Map.Shops.Merchant.Npc
    const architect = paths.Map.Shops.Architect.Npc
    const kingIdleTrack = useMemo(() => king.Humanoid.Animator.LoadAnimation(kingIdle), [king]);
    const merchantIdleTrack = useMemo(() => merchant.Humanoid.Animator.LoadAnimation(merchantIdle), [merchant]);
    const architectIdleTrack = useMemo(() => architect.Humanoid.Animator.LoadAnimation(architectIdle), [architect]);
    const body = getEntity.bodyFromPlayer(player);
    const equippedTool = body && body.model.FindFirstChildOfClass("Tool");

    // makes sure animation is playing
    if (!kingIdleTrack.IsPlaying || !merchantIdleTrack.IsPlaying || !architectIdleTrack.IsPlaying) {
        printJecs($line, "Setting up animations for player: ", player.Name);
        kingIdleTrack.Play();
        merchantIdleTrack.Play();
        architectIdleTrack.Play();
    }

    // casts a ray down if body and if standing on a platform floor then increase walkspeed on humanoid to 20 else 16 with tracer
    if (useThrottle(.1) && body) {
        const rootCFrame = body.rootPart.CFrame;
        const results = Tracer.ray(rootCFrame.Position, Vector3.yAxis, -6).useRaycastParams(Raycast.Include.Floors).run()

        // sets the walkspeed
        body.humanoid.WalkSpeed = results.hit ? 16 : 20;
    }

    // loops through all the gifting prompts watching
    giftingPrompts.forEach((prompt, playerToGift) => {
        const tooType = equippedTool?.GetAttribute<ToolType>("ItemType")

        // toggiles the prompts visibility
        prompt.Enabled = tooType === "Commodity";

        // watches for the prompt to be activated
        for (const [] of useEvent(prompt.Triggered, debug.traceback() + playerToGift.UserId)) {
            // if the player is not the local player, we send a gift request
            if (playerToGift !== Players.LocalPlayer && equippedTool) {
                printJecs($line, "Gifting to player: ", playerToGift.Name, " with tool: ", equippedTool?.Name);
                routes.giftToPlayer.send({
                    playerToGift,
                    produceTool: equippedTool
                })
            }
        }
    })

    // friendPrompts.forEach((prompt, otherPlayer) => {
    //     prompt.Enabled = true;
    //     for (const [] of useEvent(prompt.Triggered, debug.traceback() + otherPlayer.UserId)) {
    //         if (otherPlayer !== Players.LocalPlayer) {
    //             printJecs($line, "Adding friend: ", otherPlayer.Name);
    //             routes.requestAddFriend.send(otherPlayer);
    //         }
    //     }
    // })

    // when a body is added, we add a proximity prompt to it
    for (const [_, clientEntity, body] of world.query(TargetEntity, Added(Body))) {
        const giftingPrompt = paths.Assets.ProximityPrompts.GiftingProximityPrompt.Clone();
        // const friendPrompt = paths.Assets.ProximityPrompts.AddFriend.Clone();
        const player = body && Players.GetPlayerFromCharacter(body.model)

        // when added it sets the client id property
        body?.model.SetAttribute("ClientId", clientEntity)
        player?.SetAttribute("ClientId", clientEntity)
        if (player && player !== Players.LocalPlayer) {
            giftingPrompts.set(player, giftingPrompt)
            // friendPrompts.set(player, friendPrompt)
            giftingPrompt.Parent = body.rootPart
            // friendPrompt.Parent = body.rootPart
            // friendPrompt.ActionText = `Add ${player.Name} as a Friend?`;
        }
    }
}