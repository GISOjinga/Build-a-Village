/*****************************************************************************************
 * Damage Status Effects System using Matter ECS and Roblox Services.
 *
 * This system processes damage events for entities. If the attacker exists in the world,
 * and the entity that took damage is a mob named "ExpDummy", it awards experience points
 * to the attacker. Finally, the damage component is removed from the entity.
 *
 * Debug information including line numbers is printed, and operations are wrapped in
 * Promise.try with catch to ensure robust error management.
 *****************************************************************************************/

// Matter and Roblox Imports
import { Entity, OnRemove, World } from "@rbxts/jecs" // Matter framework functions and types.
import { useMemo } from "@rbxts/react" // React hooks for state management.
import { $line } from "rbxts-transformer-inline" // Inline transformer for debug line numbers.
import { Changed, componentsToReplicate, Phases, Player, TargetEntity, TargetReplication } from "shared/utils/jecs/jecsComponents" // Matter components.

import paths from "shared/utils/paths" // Module paths.
import { Widgets } from "@rbxts/plasma" // UI Widgets for debugging and display.
import { useEvent } from "shared/Plugin-Hook"
import { createEntity, printJecs, printTS, warnTS } from "shared/utils/functions/jecsHelpFunctions"
import { isPointInView } from "shared/utils/functions/vector3Functions"
import { defineCleanupCallback } from "@rbxts/hot-reloader"
import { useRoute, useRoute2 } from "shared/Plugin-Hook/hooks/use-route"
import { routes } from "shared/data/network"
import { Phase } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { Players } from "@rbxts/services"
import { appendJecs } from "shared/systems/hooks/append"
import { remotes } from "shared/data/network"


// sets up a instance with a unique id path
const registeredInstance = new WeakMap<Instance, { instance: Instance }>();

export function setInstanceWithUniqueId(instance: Instance | undefined, uniqueIdPath: string[] = []): (string[]) | undefined {
    if (instance === game) return uniqueIdPath
    if (instance === undefined) error(instance + "Doesn't exist"); // If the instance is undefined, return undefined
    const uniqueId = instance.GetAttribute<string>("__UniqueInstanceId");

    // if it already has a unique id then uses it
    if (uniqueId !== undefined) {
        uniqueIdPath.unshift(uniqueId);
        return setInstanceWithUniqueId(instance.Parent as Instance, uniqueIdPath); // Recursively set for parent instances
    } else {
        const newUniqueId = { instance: instance };
        uniqueIdPath.unshift(tostring(newUniqueId));
        registeredInstance.set(instance, newUniqueId);
        instance.SetAttribute("__UniqueInstanceId", tostring(newUniqueId));
        return setInstanceWithUniqueId(instance.Parent as Instance, uniqueIdPath); // Recursively set for parent instances
    }
}

// to replicate to a certian player
function replicateAllToPlayer(world: World, player: Player) {
    // loops through each
    for (const [componentName, component] of pairs(componentsToReplicate)) {
        // for each entity with the component
        for (const [serverEntity, data] of world.query(component)) {
            const route = routes[componentName]

            // if not route then error that you are missing the route for component replication
            if (!route) {
                error(`Missing route for component replication: ${componentName}`)
            } else {
                const targetReplication = world.get(serverEntity, TargetReplication)
                if (targetReplication && targetReplication[component] && !targetReplication[component].includes(player)) continue
                const payload = serializeForReplication(data) as unknown;
                routes[componentName].sendTo({ serverEntity, data: payload as never }, player);
            }
        }
    }
}

/*****************************************************************************************
 * Helper: Recursively serialize any Instance references in `data` into
 * `{ __JingaNetInstancePath: string }` tables, preserving all other values.
 *****************************************************************************************/
function serializeForReplication(data: unknown): unknown {
    // 1) If it's an Instance, replace with its FullName path
    if (typeIs(data, "Instance")) {
        return {
            __JingaNetInstancePath: getUniqueIdPathFromInstance(data as Instance),
        } as never
    }

    // 2) If it's a table, recurse into each key/value
    if (typeIs(data, "table")) {
        const out = {} as Record<any, unknown>
        for (const [key, val] of pairs(data as Map<any, any>)) {
            // preserve the key, serialize the value
            out[key as never] = serializeForReplication(val)
        }
        return out as never
    }

    // 3) Primitives (number, string, etc.) pass through unchanged
    return data
}


/*****************************************************************************************
 * Damage Status Effects System Entry Point.
 *****************************************************************************************/
export default {
    phase: Phases.First,
    system: (world) => {

        // loops through each component that needs replication
        for (const [componentName, component] of pairs(componentsToReplicate)) {

            // for each entity whose component just changed
            for (const [_, serverEntity, changed] of world.query(TargetEntity, Changed(component as Entity))) {
                const route = routes[componentName]
                // const messageEnum = Messages[componentName]
                const targetReplication = world.get(serverEntity, TargetReplication)
                const players = (targetReplication && targetReplication[component]) || Players.GetPlayers()

                // if the component is not a table then replicate to all players
                if (!route) {
                    error(`Missing route for component replication: ${componentName}`)
                } else {
                    if (!world.contains(serverEntity)) {
                        routes.deleteReplicatedEntity.sendToAll(serverEntity)
                    } else {
                        // Wrap in Promise.try for robust error handling
                        Promise.try(() => {
                            const payload = serializeForReplication(changed.new);
                            printTS($line, `Replicating ${componentName} for serverEntity:`, serverEntity, "to players:", players);
                            route.sendToList({ serverEntity, data: payload as never }, players);
                        }).catch((err) => {
                            warnTS($line, `Replication error for ${componentName} at line ${$line}: ${tostring(err)}`)
                        })
                    }
                }
            }
        }

        // when ever getReplicatedComponents is called
        useRoute(routes.getReplicatedComponents, (_, player) => replicateAllToPlayer(world, player))

        // when ever player gets added
        useRoute2(remotes.jecsSetup, (_, player) => replicateAllToPlayer(world, player))
    }
} as SystemTable<[World]>