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
    for (const [updateEntity, newData] of world.query(UpdateData)) {
        const bodyEntity = newData.bodyEntity;
        const hasEntity = world.contains(bodyEntity);
        const [body, oldData] = hasEntity ? world.get(bodyEntity, Body, Data) : [];

        // remove the update entity
        world.delete(updateEntity);

        if (body && oldData) {
            const { model } = body;
            const player = Players.GetPlayerFromCharacter(model);

            // Update the Data component.
            world.set(bodyEntity, Data, { data: { ...oldData.data, ...newData.data } });

            // Execute update functions if a key has changed.
            funcToCallOnUpdate.forEach((func, key) => {
                if (newData.data[key]) {
                    func(model as Character<R15>, newData.data, oldData.data);
                }
            });

            // Save updated data on player.
            if (player) setPlayerData(player, { ...oldData.data, ...newData.data });
        }
    }

    // gives bodies data
    for (const [bodyEntity, { model }] of world.query(Body).without(Data)) {
        const player = Players.GetPlayerFromCharacter(model);
        if (player) {
            const playerData = getPlayerData(player);
            if (playerData) {
                world.set(bodyEntity, Data, { data: playerData });
                world.set(world.entity(), UpdateData, { data: playerData, bodyEntity });
            } else {
                warn(`No player data found for ${player.Name}`);
            }
        } else {
            world.set(bodyEntity, Data, { data: deepCopy(defaultData) });
            world.set(world.entity(), UpdateData, { data: defaultData, bodyEntity });
        }
    }
};
