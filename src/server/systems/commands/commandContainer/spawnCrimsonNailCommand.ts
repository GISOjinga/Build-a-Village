import { Command, CommandGuard, Guard, Register } from "@rbxts/centurion";
import { CommandContext } from "@rbxts/cmdr";
import { Entity } from "@rbxts/jecs";
import { spawnCrimsonNailSignal } from "../commandBindings/justusCommandSignals";

const isAdmin: CommandGuard = (ctx) => {
    if (ctx.executor.UserId === 1) {
        ctx.error("Insufficient permission!");
        return false;
    }

    return true;
};

// signal to give
@Register()
export class spawnCrimsonNailCommand {
    @Command({
        name: "spawnCrimsonNail",
        description: "Spawn Crimson Nail",
        arguments: []
    })

    @Guard(isAdmin)
    spawnCrimsonNail(ctx: CommandContext) {
        const character = ctx.executor.Character
        const bodyEntity = character?.GetAttribute<Entity>("ServerId")

        // if the server id exist
        if (bodyEntity) spawnCrimsonNailSignal.Invoke(bodyEntity)
    }
}

