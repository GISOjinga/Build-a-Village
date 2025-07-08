import { Entity, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { Body, Data, UpdateData, systemQueue, Changed } from "shared/utils/jecs/jecsComponents";
import { getPlayerData, setPlayerData } from "../player/extra/playersData";
import { deepCopy, deepEquals } from "@rbxts/object-utils";
import defaultData, { PlayerData } from "shared/data/defaultData";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import routes from "server/routes";
import Net from "@rbxts/yetanothernet";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { createEntity } from "shared/utils/functions/jecsHelpFunctions";

// function to call when data changes
const funcToCallOnUpdate = new Map<keyof PlayerData, (character: Character<R15>, newData: Partial<PlayerData>, oldData: PlayerData, entity: Entity) => void>([
    // sends coin updates to client
    ["Coins", (character, newData, oldData) => {
        const player = Players.GetPlayerFromCharacter(character);
        if (player && newData.Coins !== undefined) routes.updatePlayerCoins.sendTo(newData.Coins, player);
    }],

    // sends daily streak updates to client
    ["DailyStreak", (character, newData, oldData) => {
        const player = Players.GetPlayerFromCharacter(character);
        if (player && newData.DailyStreak !== undefined) routes.updateDailyStreak.sendTo(newData.DailyStreak, player);
    }],

    // sends daily reward day updates to client
    ["LastDailyReward", (character, newData, oldData) => {
        const player = Players.GetPlayerFromCharacter(character);
        if (player && newData.LastDailyReward !== undefined) routes.updateLastDailyReward.sendTo(newData.LastDailyReward, player);
    }],

    // sends tutorial progress updates to client
    ["Tutorial", (character, newData, oldData) => {
        const player = Players.GetPlayerFromCharacter(character);
        if (player && newData.Tutorial !== undefined) routes.updateTutorialProgress.sendTo(newData.Tutorial, player);
    }],

    // sends walls updates to client
    ["Walls", (character, newData, oldData) => {
        const player = Players.GetPlayerFromCharacter(character);
        if (player && newData.Walls !== undefined) routes.updatePlayerWalls.sendTo(newData.Walls, player);
    }],
]);

// updates data
export default (world: World) => {

    // listens to updates
    for (const [updateEntity, update] of world.query(UpdateData)) {
        const bodyEntity = update.bodyEntity;
        const updateFunction = update.updateFunction;
        const hasEntity = world.contains(bodyEntity);
        const [body, oldData] = hasEntity ? world.get(bodyEntity, Body, Data) : [];

        // remove the update entity
        world.delete(updateEntity);
        if (body && oldData) {
            const { model } = body;
            const player = Players.GetPlayerFromCharacter(model);
            const updatedData = updateFunction(deepCopy(oldData));
            const changedIndexes = new Array<keyof PlayerData>();

            // Update the Data component.
            world.set(bodyEntity, Data, updatedData);

            // Execute update functions if a key has changed.
            for (const [key, newValue] of pairs(updatedData)) {
                const oldValue = oldData[key]
                if ((typeIs(newValue, "table") && typeIs(oldValue, "table") && !deepEquals(newValue, oldValue)) || oldValue !== newValue) changedIndexes.push(key)
            }

            // If no keys changed, skip further processing.
            funcToCallOnUpdate.forEach((func, key) => {
                if (update.updateAll || changedIndexes.includes(key)) {
                    func(model as Character<R15>, updatedData, oldData, bodyEntity);
                }
            });

            // Save updated data on player.
            if (player) setPlayerData(player, updatedData);
        }
    }

    // gives bodies data
    for (const [bodyEntity, { model }] of world.query(Body).without(Data)) {
        const player = Players.GetPlayerFromCharacter(model);

        if (player) {
            const playerData = getPlayerData(player);

            if (playerData) {
                // Send initial player data to client via network routes
                routes.updatePlayerCoins.sendTo(playerData.Coins, player);
                routes.updateDailyStreak.sendTo(playerData.DailyStreak, player);
                routes.updateLastDailyReward.sendTo(playerData.LastDailyReward, player);
                routes.updateTutorialProgress.sendTo(playerData.Tutorial, player);
                routes.updatePlayerWalls.sendTo(playerData.Walls, player);

                // Set the Data component on server but don't replicate it
                world.set(bodyEntity, Data, playerData);
                world.set(world.entity(), UpdateData, { updateFunction: () => playerData, bodyEntity, updateAll: true });
            } else {
                warn(`No player data found for ${player.Name}`);
            }
        } else {
            // For non-player entities, just set default data without replication
            world.set(bodyEntity, Data, deepCopy(defaultData));
            world.set(world.entity(), UpdateData, { updateFunction: () => defaultData, bodyEntity, updateAll: true });
        }
    }
};
