import { World } from "@rbxts/jecs";
import routes from "server/routes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { Data, Player, Added, TargetEntity, Body } from "shared/utils/jecs/jecsComponents";
import { createEntity, getEntity, printJecs } from "shared/utils/functions/jecsHelpFunctions";
import { PlayerData } from "../../../shared/data/defaultData";
import { $line } from "rbxts-transformer-inline";
import dailyRewardsData from "shared/data/dailyRewardsData";

const dayInSeconds = 60 * 60 * 24;

export default (world: World) => {
    for (const [_, entity] of world.query(TargetEntity, Added(Body))) {
        const player = world.get(entity, Player);
        if (!player) continue;
        // for updating daily rewards
        task.delay(5, () => {
            createEntity.updateData(entity, (old) => {
                const currentDay = math.floor(os.time() / dayInSeconds);
                if (old.LastDailyReward !== currentDay) {
                    const diff = currentDay - old.LastDailyReward;
                    old.DailyStreak = diff === 1 ? (old.DailyStreak || 0) + 1 : 1;
                    old.LastDailyReward = currentDay;
                    const reward = dailyRewardsData[math.clamp(old.DailyStreak, 1, dailyRewardsData.size()) - 1];
                    if (reward) {
                        if (reward.type === "Coins") {
                            old.Coins += reward.amount;
                            routes.notify.sendTo({ text: `Daily reward: $${reward.amount}`, duration: 5 }, player)
                            printJecs($line, `Daily reward for ${player.Name}: $${reward.amount}`);
                        } else if (reward.type === "Villager") {
                            createEntity.inventoryVillager(entity, reward.name);
                            routes.notify.sendTo({ text: `Daily reward: ${reward.name}`, duration: 5 }, player);
                            printJecs($line, `Daily reward for ${player.Name}: ${reward.name}`);
                        } else if (reward.type === "Produce") {
                            createEntity.insertProduce(entity, reward.name as ProduceNames, "Normal", 1);
                            routes.notify.sendTo({ text: `Daily reward: ${reward.name}`, duration: 5 }, player);
                            printJecs($line, `Daily reward for ${player.Name}: ${reward.name}`);
                        }
                    }
                }

                return old;
            });
        })
    }
};
