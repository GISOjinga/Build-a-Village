import { CenturionType, Command, CommandGuard, Guard, Register } from "@rbxts/centurion";
import { CommandContext } from "@rbxts/cmdr";

const isAdmin: CommandGuard = (ctx) => {
    if (ctx.executor.GetRankInGroup(36086761) < 254 && ctx.executor.UserId >= 0) {
        ctx.error("Insufficient permission!");
        return false;
    }

    return true;
};

@Register()
export class KickCommand {
    @Command({
        name: "kick",
        description: "Kick a player",
        arguments: [
            {
                name: "player",
                description: "Player to kick",
                type: CenturionType.Player
            }
        ]
    })
    @Guard(isAdmin)
    kick(ctx: CommandContext, player: Player) {
        player.Kick("You have been kicked from the server.");
        ctx.Reply(`Successfully kicked ${player.Name}`);
    }
}