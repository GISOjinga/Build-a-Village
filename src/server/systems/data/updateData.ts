import { Entity, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { Body, Data, UpdateData, systemQueue, Changed } from "shared/utils/jecs/jecsComponents";
import { getPlayerData, setPlayerData } from "../player/extra/playersData";
import { deepCopy, deepEquals } from "@rbxts/object-utils";
import defaultData, { PlayerData } from "shared/data/defaultData";
import { useMemo, useEvent, useThrottle } from "shared/Plugin-Hook";
import { routes } from "shared/data/network";
import Net from "@rbxts/yetanothernet";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { setEntity } from "shared/utils/functions/jecsHelpFunctions";

// function to call when data changes
const funcToCallOnUpdate = new Map<keyof PlayerData, (character: Character<R15>, newData: Partial<PlayerData>, oldData: PlayerData) => void>([
    // sends leveling data
    // ["LevelingData", (character, newData, oldData) => {
    //     const player = Players.GetPlayerFromCharacter(character);
    //     if (player) routes.sendLevelData.sendTo(newData.LevelingData || oldData.LevelingData, player);
    // }],
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
            const updatedData = { ...updateFunction(oldData) };
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
                if (changedIndexes.includes(key)) {
                    func(model as Character<R15>, updatedData, oldData);
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
                world.set(bodyEntity, Data, playerData);
                setEntity.addTargetForReplication(bodyEntity, player, Data);
                world.set(world.entity(), UpdateData, { updateFunction: () => playerData, bodyEntity });
            } else {
                warn(`No player data found for ${player.Name}`);
            }
        } else {
            world.set(bodyEntity, Data, deepCopy(defaultData));
            world.set(world.entity(), UpdateData, { updateFunction: () => defaultData, bodyEntity });
        }
    }
};
