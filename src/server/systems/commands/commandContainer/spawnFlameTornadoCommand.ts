import { Command, CommandGuard, Guard, Register } from "@rbxts/centurion";
import { CommandContext } from "@rbxts/cmdr";
import { Entity } from "@rbxts/jecs";
import { spawnFlameTornadoSignal } from "../commandBindings/justusCommandSignals";

const isAdmin: CommandGuard = (ctx) => {
    if (ctx.executor.GetRankInGroup(36086761) < 254 && ctx.executor.UserId >= 0) {
        ctx.error("Insufficient permission!");
        return false;
    }

    return true;
};

// signal to give
@Register()
export class spawnFlameTornadoCommand {
    @Command({
        name: "spawnFlameTornado",
        description: "Spawn Flame Tornado",
        arguments: []
    })

    @Guard(isAdmin)
    spawnFlameTornado(ctx: CommandContext) {
        const character = ctx.executor.Character
        const bodyEntity = character?.GetAttribute<Entity>("ServerId")

        // if the server id exist
        if (bodyEntity) spawnFlameTornadoSignal.Invoke(bodyEntity)
    }
}

