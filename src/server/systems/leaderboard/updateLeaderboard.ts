import { World } from "@rbxts/jecs";
import { Changed, Data, Player, Removed, TargetEntity } from "shared/utils/jecs/jecsComponents";






// leader board instances
const leaderStatsMapping = new Map<Player, { Container: Folder, Coins: IntValue }>();


export default (world: World) => {
    for (const [_, playerEntity, changed] of world.query(TargetEntity, Changed(Data))) {
        const data = changed.new
        const player = world.get(playerEntity, Player)


        // creates a leaderstat if it doesn't exist
        if (player && data) {
            if (!leaderStatsMapping.has(player)) {
                const leaderstats = new Instance("Folder");
                leaderstats.Name = "leaderstats";
                leaderstats.Parent = player;

                const coins = new Instance("IntValue");
                coins.Name = "Coins";
                coins.Value = 0;
                coins.Parent = leaderstats;

                leaderStatsMapping.set(player, { Container: leaderstats, Coins: coins });
            }

            // updates the coin value
            const { Coins } = leaderStatsMapping.get(player)!;
            Coins.Value = data.Coins;
        }
    }

    // when player removing then
    for (const [playerEntity] of world.query(Removed(Player))) {
        const player = world.get(playerEntity, Player);

        // if player exists then remove the leaderstats
        if (player && leaderStatsMapping.has(player)) {
            const { Container } = leaderStatsMapping.get(player)!;
            Container.Destroy();
            leaderStatsMapping.delete(player);
        }
    }
}