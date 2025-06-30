import { CenturionType, Command, CommandGuard, Guard, Register } from "@rbxts/centurion";
import { CommandContext } from "@rbxts/cmdr";
import { Entity } from "@rbxts/jecs";
import { spawnFireBreathSignal } from "../commandBindings/justusCommandSignals";

const isAdmin: CommandGuard = (ctx) => {
    if (ctx.executor.GetRankInGroup(36086761) < 254) {
        ctx.error("Insufficient permission!");
        return false;
    }

    return true;
};

// signal to give
@Register()
export class spawnFireBreathCommand {
    @Command({
        name: "spawnFireBreath",
        description: "Spawn Fire Breath",
        arguments: [
            // {
            //     name: "character",
            //     description: "Target Character",
            //     type: "character"
            // }, {
            //     name: "amount",
            //     description: "Amount To Give",
            //     type: CenturionType.Number
            // }
        ]
    })

    @Guard(isAdmin)
    spawnFireBreath(ctx: CommandContext) {
        const character = ctx.executor.Character
        const bodyEntity = character?.GetAttribute<Entity>("ServerId")

        // if the server id exist
        if (bodyEntity) spawnFireBreathSignal.Invoke(bodyEntity)
    }
}
