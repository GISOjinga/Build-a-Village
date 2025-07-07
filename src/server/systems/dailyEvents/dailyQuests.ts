import { World } from "@rbxts/jecs";
import routes from "server/routes";
import { Data, Player, Added, TargetEntity, Body, Changed, Removed, GiftTo } from "shared/utils/jecs/jecsComponents";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { useEvent } from "shared/Plugin-Hook";
import { createEntity, getEntity, printJecs } from "shared/utils/functions/jecsHelpFunctions";
import ShopData from "../villagers/ShopData";
import { MarketplaceService, Players } from "@rbxts/services";
import { PlayerData } from "../../../shared/data/defaultData";
import { $line } from "rbxts-transformer-inline";
import dailyQuestsData from "shared/data/dailyQuestsData";

const dayInSeconds = 60 * 60 * 24;

const updateClient = (player: Player, data: PlayerData) => {
    const info = (data.DailyQuests.map(q => {
        const def = dailyQuestsData.find(d => d.id === q.id);
        if (!def) return undefined;
        return { description: def.description, progress: q.progress, target: q.target, reward: def.reward };
    }) as unknown as Array<{ id: number; progress: number; target: number; assigned: number }>).filter((v): v is { id: number; progress: number; target: number; assigned: number } => v !== undefined);
    printJecs($line, `Updating daily quests for ${player.Name}`, info, data.DailyQuests);
    routes.updateDailyQuest.sendTo(info as never, player);
};

type QuestDetails = {
    produce?: ProduceNames;
    villager?: VillagerNames;
    variant?: ProduceVariant;
    value?: number;
    tier?: number;
    filled?: boolean;
};

const questChecks: { [id: number]: (d?: QuestDetails) => boolean } = {
    1: d => d?.produce === "Wheat" && d.villager === "Farmer",
    2: d => d?.produce === "Wheat" && d.villager === "Baker",
    3: d => d?.produce === "Iron" && d.villager === "Miner",
    7: d => d?.variant === "Rainbow",
    9: d => (d?.tier ?? 0) >= 2,
    10: d => d?.variant !== undefined && d.variant !== "Normal",
    20: d => (d?.tier ?? 0) === 1,
    23: d => (d?.value ?? 0) > 300,
    24: d => (d?.tier ?? 0) >= 2 && d?.filled === true,
};

const countProduce = (data: PlayerData, name?: ProduceNames) => {
    if (name) return data.Produce.filter(p => p.Name === name).reduce((a, b) => a + (b.Amount || 0), 0);
    return data.Produce.reduce((a, b) => a + (b.Amount || 0), 0);
};

const countMutated = (data: PlayerData) => data.Produce.filter(p => p.Variant !== "Normal").reduce((a, b) => a + (b.Amount || 0), 0);

const questTrackers: { [id: number]: (oldD: PlayerData, newD: PlayerData) => QuestDetails | undefined } = {
    1: (o, n) => countProduce(n, "Wheat") > countProduce(o, "Wheat") ? { produce: "Wheat", villager: "Farmer" } : undefined,
    2: (o, n) => countProduce(n, "Wheat") < countProduce(o, "Wheat") ? { produce: "Wheat", villager: "Baker" } : undefined,
    3: (o, n) => countProduce(n, "Iron") > countProduce(o, "Iron") ? { produce: "Iron", villager: "Miner" } : undefined,
    4: (o, n) => n.Coins > o.Coins && countProduce(n) < countProduce(o) ? {} : undefined,
    5: () => undefined,
    6: (o, n) => {
        const oldSleeping = o.Villagers.filter(v => v.Progress.Progression.Time.StartTime <= 0).size();
        const newSleeping = n.Villagers.filter(v => v.Progress.Progression.Time.StartTime <= 0).size();
        return newSleeping < oldSleeping ? {} : undefined;
    },
    7: (o, n) => n.Produce.some(p => p.Variant === "Rainbow") && !o.Produce.some(p => p.Variant === "Rainbow") ? { variant: "Rainbow" } : undefined,
    8: (o, n) => countProduce(n) > countProduce(o) ? {} : undefined,
    9: (o, n) => {
        const tier2Produce = new Set<ProduceNames>();
        for (const villager of n.Villagers) {
            const progress = villager.Progress;
            if (progress.Required !== undefined || (progress as unknown as { Tier?: number }).Tier === 2) {
                tier2Produce.add(progress.Produce);
            }
        }

        for (const produce of tier2Produce) {
            const oldCount = o.Produce.filter(p => p.Name === produce).reduce((a, b) => a + (b.Amount || 0), 0);
            const newCount = n.Produce.filter(p => p.Name === produce).reduce((a, b) => a + (b.Amount || 0), 0);
            if (newCount > oldCount) return { tier: 2 };
        }

        return undefined;
    },
    // mutated variants include Gold or Rainbow items
    10: (o, n) => {
        const variants: ProduceVariant[] = ["Gold", "Rainbow"];
        for (const variant of variants) {
            const oldCount = o.Produce.filter(p => p.Variant === variant).reduce((a, b) => a + (b.Amount || 0), 0);
            const newCount = n.Produce.filter(p => p.Variant === variant).reduce((a, b) => a + (b.Amount || 0), 0);
            if (newCount > oldCount) return { variant };
        }
        return undefined;
    },
    11: (o, n) => (o.Walls.find(w => w.Equipped)?.Name !== n.Walls.find(w => w.Equipped)?.Name) ? {} : undefined,
    12: (o, n) => n.Walls.filter(w => w.Owned).size() >= 2 && n.Walls.filter(w => w.Owned).size() > o.Walls.filter(w => w.Owned).size() ? {} : undefined,
    13: (o, n) => n.Walls.find(w => w.Equipped && w.Name === "Ironwood Fence") && !o.Walls.find(w => w.Equipped && w.Name === "Ironwood Fence") ? {} : undefined,
    14: (o, n) => n.Walls.size() > o.Walls.size() ? {} : undefined,
    15: (o, n) => n.Villagers.size() > o.Villagers.size() ? {} : undefined,
    16: () => undefined,
    17: () => undefined,
    18: (o, n) => countProduce(o) > countProduce(n) ? {} : undefined,
    19: () => undefined,
    20: () => undefined,
    21: (o, n) => countProduce(n) > countProduce(o) ? {} : undefined,
    22: () => undefined,
    23: (o, n) => n.Coins > o.Coins && countProduce(o) > countProduce(n) ? { value: n.Coins - o.Coins } : undefined,
    24: (o, n) => {
        for (const [index, newVillager] of pairs(n.Villagers)) {
            const oldVillager = o.Villagers[index as number];
            const reqNew = newVillager.Progress.Required;
            const reqOld = oldVillager && oldVillager.Progress.Required;
            if (reqNew && reqOld && reqOld.Amount < reqOld.Max && reqNew.Amount >= reqNew.Max) {
                return { tier: 2, filled: true };
            }
        }
        return undefined;
    },
};

function progressDailyQuest(player: Player, details?: QuestDetails) {
    const entity = getEntity.fromInstance(player);
    if (!entity) return;
    createEntity.updateData(entity, (old) => {
        for (const quest of old.DailyQuests) {
            const info = dailyQuestsData.find(q => q.id === quest.id);
            if (!info) continue;
            const checker = questChecks[info.id];
            if (checker && !checker(details)) continue;
            if (quest.progress < quest.target) {
                quest.progress += 1;
                if (quest.progress >= quest.target) {
                    const reward = info.reward;
                    if (reward.type === "Coins") {
                        old.Coins += reward.amount;
                        routes.notify.sendTo({ text: `Quest complete! +${reward.amount}`, duration: 5 }, player);
                    } else if (reward.type === "Villager") {
                        createEntity.inventoryVillager(entity, reward.name);
                        routes.notify.sendTo({ text: `Quest complete! +${reward.name}`, duration: 5 }, player);
                    } else if (reward.type === "Produce") {
                        createEntity.insertProduce(entity, reward.name, "Normal", 1);
                        routes.notify.sendTo({ text: `Quest complete! +${reward.name}`, duration: 5 }, player);
                    }
                }
            }
        }
        printJecs($line, `Progressing daily quests for ${player.Name}`, old.DailyQuests, details);
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

    for (const [_, playerEntity, changed] of world.query(TargetEntity, Changed(Data))) {
        const player = world.get(playerEntity, Player);
        if (!player) continue;
        const oldData = changed.old;
        const newData = changed.new;
        if (!oldData || !newData) continue;
        for (const quest of newData.DailyQuests) {
            const tracker = questTrackers[quest.id];
            if (!tracker) continue;
            const details = tracker(oldData, newData);
            if (details) progressDailyQuest(player, details);
        }
    }

    for (const [_, playerEntity, gift] of world.query(TargetEntity, Removed(GiftTo))) {
        const player = world.get(playerEntity, Player);
        if (player && gift.gifted) progressDailyQuest(player, {});
    }

    for (const [playerEntity] of world.query(Added(Player))) {
        const player = world.get(playerEntity, Player);
        if (player && Players.GetPlayers().size() >= 3) {
            for (const [pEnt] of world.query(Player)) {
                const plr = world.get(pEnt, Player);
                if (plr) progressDailyQuest(plr, {});
            }
        }
    }

    useRoute(routes.confirmSellOptions, (option, player) => {
        if (option === "Option3") progressDailyQuest(player, {});
    });

    useRoute(routes.giftToPlayer, ({ produceTool }, player) => {
        if (!produceTool) return;
        progressDailyQuest(player, {});
        const itemName = (produceTool as never as Tool).GetAttribute<ProduceNames>("ItemName");
        const entity = getEntity.fromInstance(player);
        const data = entity && world.get(entity, Data);
        if (itemName && data) {
            const tier1 = data.Villagers.some(v => v.Progress.Produce === itemName && v.Progress.Required === undefined);
            if (tier1) progressDailyQuest(player, { tier: 1 });
        }
    });

    useRoute(routes.buyVillager, ({ villagerIndex }, player) => {
        const villager = ShopData.Villagers[villagerIndex];
        if (villager && villager.Rarity === "Rare") progressDailyQuest(player, {});
    });

    for (const [userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        if (wasPurchased && productId === 3308848691) {
            const player = Players.GetPlayerByUserId(userId) as Player | undefined;
            if (player) progressDailyQuest(player, {});
        }
    }
};
