import { World } from "@rbxts/jecs";
import routes from "server/routes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { Data, Player, Added, TargetEntity, Body } from "shared/utils/jecs/jecsComponents";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import dailyRewardsData, { DailyRewardItem } from "shared/data/dailyRewardsData";
import paths from "shared/utils/paths";

const dayInSeconds = 60 * 60 * 24;

export default (world: World) => {
    for (const [_, entity] of world.query(TargetEntity, Added(Body))) {
        const player = world.get(entity, Player);
        if (!player) continue;
        task.delay(5, () => {
            createEntity.updateData(entity, (old) => {
                const currentDay = math.floor(os.time() / dayInSeconds);
                if (currentDay - old.LastDailyReward > 1) old.DailyStreak = 0;
                return old;
            });
        });
    }

    useRoute(routes.claimDailyReward, (_, player) => {
        const ent = getEntity.fromInstance(player);
        if (!ent) return;
        const body = world.get(ent, Body);
        let rewards: DailyRewardItem[] | undefined;
        createEntity.updateData(ent, (old) => {
            const currentDay = math.floor(os.time() / dayInSeconds);
            if (currentDay <= old.LastDailyReward) return old;
            const diff = currentDay - old.LastDailyReward;
            const newStreak = diff === 1 ? (old.DailyStreak || 0) + 1 : 1;
            old.DailyStreak = newStreak;
            old.LastDailyReward = currentDay;
            rewards = dailyRewardsData[math.clamp(newStreak, 1, dailyRewardsData.size()) - 1];
            if (rewards) {
                for (const reward of rewards) {
                    if (reward.type === "Coins") {
                        old.Coins += reward.amount;
                    } else if (reward.type === "Villager") {
                        createEntity.inventoryVillager(ent, reward.name);
                    } else if (reward.type === "Produce") {
                        createEntity.insertProduce(ent, reward.name as ProduceNames, "Normal", 1);
                    }
                }
            }
            return old;
        });
        if (rewards) {
            let d = 0;
            for (const reward of rewards) {
                const msg = reward.type === "Coins" ? `Daily reward: $${reward.amount}` : `Daily reward: ${reward.name}`;
                task.delay(d, () => routes.notify.sendTo({ text: msg, duration: 3 }, player));
                d += 1;
            }
        }
        if (body) {
            routes.playParticle.sendToAll({ particle: paths.Assets.Particles.Surprise, location: body.rootPart.CFrame });
        }
    });
};
