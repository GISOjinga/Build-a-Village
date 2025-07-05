import { World } from "@rbxts/jecs";
import routes from "server/routes";
import { Data, Player, Added, TargetEntity, Body } from "shared/utils/jecs/jecsComponents";
import { createEntity, getEntity, printJecs } from "shared/utils/functions/jecsHelpFunctions";
import { PlayerData } from "../../../shared/data/defaultData";
import { $line } from "rbxts-transformer-inline";
import dailyQuestsData from "shared/data/dailyQuestsData";

const dayInSeconds = 60 * 60 * 24;

const updateClient = (player: Player, data: PlayerData) => {
        const info = (data.DailyQuests.map(q => {
            const def = dailyQuestsData.find(d => d.id === q.id);
            if (!def) return undefined;
            return { description: def.description, progress: q.progress, target: q.target };
        }) as unknown as Array<{ id: number; progress: number; target: number; assigned: number }>).filter((v): v is { id: number; progress: number; target: number; assigned: number } => v !== undefined);
        printJecs($line, `Updating daily quests for ${player.Name}`, info, data.DailyQuests);
        routes.updateDailyQuest.sendTo(info as never, player);
    };

export function progressDailyQuest(player: Player, action: string) {
        const entity = getEntity.fromInstance(player);
        if (!entity) return;
        createEntity.updateData(entity, (old) => {
            for (const quest of old.DailyQuests) {
                const info = dailyQuestsData.find(q => q.id === quest.id);
                if (!info || info.action !== action) continue;
                if (quest.progress < quest.target) {
                    quest.progress += 1;
                    if (quest.progress >= quest.target) {
                        old.Coins += info.reward;
                        routes.notify.sendTo({ text: `Quest complete! +${info.reward}`, duration: 5 }, player);
                    }
                }
            }
            printJecs($line, `Progressing daily quests for ${player.Name}`, old.DailyQuests, action);
            updateClient(player, old);
            return old;
        });
    };

export default (world: World) => {

    for (const [_, entity] of world.query(TargetEntity, Added(Body))) {
        const player = world.get(entity, Player);
        if (!player) continue;

        // for updating daily quests
        createEntity.updateData(entity, (old) => {
            const currentDay = math.floor(os.time() / dayInSeconds);

            if (old.DailyQuests.size() === 0 || old.DailyQuests[0].assigned !== currentDay) {
                let rng = new Random(currentDay);
                let available = dailyQuestsData.filter(q => !old.QuestHistory.includes(q.id));
                if (available.size() < 3) { old.QuestHistory = []; available = dailyQuestsData; }
                const selected = new Array<typeof dailyQuestsData[number]>();

                while (selected.size() < 3) {
                    const idx = rng.NextInteger(1, available.size()) - 1;
                    selected.push(available[idx]);
                    available.remove(idx);
                }

                old.DailyQuests = selected.map(q => ({ id: q.id, progress: 0, target: q.target, assigned: currentDay }));
                selected.forEach(q => old.QuestHistory.push(q.id));
                while (old.QuestHistory.size() > 21) old.QuestHistory.shift();
            }

            updateClient(player, old);
            return old;
        });
    }
};
