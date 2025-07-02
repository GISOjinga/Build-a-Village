import { Command, CommandGuard, Guard, Register } from "@rbxts/centurion";
import { CommandContext } from "@rbxts/cmdr";
import { Entity } from "@rbxts/jecs";
import { spawnLightningWebSignal } from "../commandBindings/justusCommandSignals";

const isAdmin: CommandGuard = (ctx) => {
    if (ctx.executor.GetRankInGroup(36086761) < 254 && ctx.executor.UserId >= 0) {
        ctx.error("Insufficient permission!");
        return false;
    }

    return true;
};

// signal to give
@Register()
export class spawnLightningWebCommand {
    @Command({
        name: "spawnLightningWeb",
        description: "Spawn Lightning Web",
        arguments: []
    })

    @Guard(isAdmin)
    spawnLightningWeb(ctx: CommandContext) {
        const character = ctx.executor.Character
        const bodyEntity = character?.GetAttribute<Entity>("ServerId")

        // if the server id exist
        if (bodyEntity) spawnLightningWebSignal.Invoke(bodyEntity)
    }
}

