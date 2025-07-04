import { World } from "@rbxts/jecs";
import routes from "server/routes";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { Data, Player, Added } from "shared/utils/jecs/jecsComponents";
import { createEntity, getEntity } from "shared/utils/functions/jecsHelpFunctions";
import dailyQuests from "../../../shared/data/dailyQuests";
import dailyRewards from "../../../shared/data/dailyRewards";
import { PlayerData } from "../../../shared/data/defaultData";

const DAY_SECONDS = 60 * 60 * 24;

export default (world: World) => {
    const updateClient = (player: Player, data: PlayerData) => {
        const info = (data.DailyQuests.map(q => {
            const def = dailyQuests.find(d => d.id === q.id);
            if (!def) return undefined;
            return { description: def.description, progress: q.progress, target: q.target };
        }) as unknown as Array<{ id: number; progress: number; target: number; assigned: number }>).filter((v): v is { id: number; progress: number; target: number; assigned: number } => v !== undefined);
        routes.updateDailyQuest.sendTo(info as never, player);
    };

    const progress = (player: Player, action: string) => {
        const entity = getEntity.fromInstance(player);
        if (!entity) return;
        createEntity.updateData(entity, (old) => {
            for (const quest of old.DailyQuests) {
                const info = dailyQuests.find(q => q.id === quest.id);
                if (!info || info.action !== action) continue;
                if (quest.progress < quest.target) {
                    quest.progress += 1;
                    if (quest.progress >= quest.target) {
                        old.Coins += info.reward;
                        routes.notify.sendTo({ text: `Quest complete! +${info.reward}`, duration: 5 }, player);
                    }
                }
            }
            return old;
        });
        const data = world.get(entity, Data);
        if (data) updateClient(player, data);
    };

    useRoute(routes.collectVillagerProduce, (_, player) => progress(player, "collect"));
    useRoute(routes.placeVillager, (_, player) => progress(player, "place"));
    useRoute(routes.digVillager, (_, player) => progress(player, "dig"));
    useRoute(routes.supplyVillager, (_, player) => progress(player, "supply"));
    useRoute(routes.confirmSellOptions, (_, player) => progress(player, "sell"));
    useRoute(routes.giftToPlayer, (_, player) => progress(player, "gift"));

    for (const [entity, player] of world.query(Added(Player))) {
        const data = world.get(entity, Data);
        if (!data) continue;
        createEntity.updateData(entity, (old) => {
            const currentDay = math.floor(os.time() / DAY_SECONDS);
            if (old.LastDailyReward !== currentDay) {
                const diff = currentDay - old.LastDailyReward;
                old.DailyStreak = diff === 1 ? (old.DailyStreak || 0) + 1 : 1;
                old.LastDailyReward = currentDay;
                const reward = dailyRewards[math.clamp(old.DailyStreak, 1, dailyRewards.size()) - 1];
                if (reward) {
                    if (reward.type === "Coins") {
                        old.Coins += reward.amount;
                        routes.notify.sendTo({ text: `Daily reward: $${reward.amount}`, duration: 5 }, player);
                    } else if (reward.type === "Villager") {
                        createEntity.inventoryVillager(entity, reward.name);
                        routes.notify.sendTo({ text: `Daily reward: ${reward.name}`, duration: 5 }, player);
                    } else if (reward.type === "Produce") {
                        createEntity.insertProduce(entity, reward.name as ProduceNames, "Normal", 1);
                        routes.notify.sendTo({ text: `Daily reward: ${reward.name}`, duration: 5 }, player);
                    }
                }
            }

            if (old.DailyQuests.size() === 0 || old.DailyQuests[0].assigned !== currentDay) {
                let rng = new Random(currentDay);
                let available = dailyQuests.filter(q => !old.QuestHistory.includes(q.id));
                if (available.size() < 3) { old.QuestHistory = []; available = dailyQuests; }
                const selected = new Array<typeof dailyQuests[number]>();
                while (selected.size() < 3) {
                    const idx = rng.NextInteger(1, available.size()) - 1;
                    selected.push(available[idx]);
                    available.remove(idx);
                }
                old.DailyQuests = selected.map(q => ({ id: q.id, progress: 0, target: q.target, assigned: currentDay }));
                selected.forEach(q => old.QuestHistory.push(q.id));
                while (old.QuestHistory.size() > 21) old.QuestHistory.shift();
            }
            return old;
        });
        const updated = world.get(entity, Data);
        if (updated) updateClient(player, updated);
    }
};
