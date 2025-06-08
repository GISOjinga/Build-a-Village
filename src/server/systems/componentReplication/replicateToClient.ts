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
import { createDebugger } from "shared/utils/functions/matterFunctions" // Utility to create a debugger.
import paths from "shared/utils/paths" // Module paths.
import { Widgets } from "@rbxts/plasma" // UI Widgets for debugging and display.
import { useEvent } from "shared/Plugin-Hook"
import { createEntity } from "shared/utils/functions/jecsHelpFunctions"
import { isPointInView } from "shared/utils/functions/vector3Functions"
import { defineCleanupCallback } from "@rbxts/hot-reloader"
import { useRoute } from "shared/Plugin-Hook/hooks/use-route"
import { routes } from "shared/data/network"
import { Phase } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { Players } from "@rbxts/services"


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
                routes[componentName].sendTo({ serverEntity, data: serializeForReplication(data) as never }, player);
            }
        }
    }
}

/*****************************************************************************************
 * Helper: Recursively serialize any Instance references in `data` into
 * `{ __ByteNetInstancePath: string }` tables, preserving all other values.
 *****************************************************************************************/
function serializeForReplication(data: unknown): unknown {
    // 1) If it's an Instance, replace with its FullName path
    if (typeIs(data, "Instance")) {
        return { __ByteNetInstancePath: (data as Instance).GetFullName() } as never
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
        const debugEnabled = createDebugger(script.Name);

        // when ever getReplicatedComponents is called
        useRoute(routes.getReplicatedComponents, (_, player) => replicateAllToPlayer(world, player))

        // when ever player gets added
        for (const [player] of useEvent(Players.PlayerAdded)) replicateAllToPlayer(world, player)

        // loops through each component that needs replication
        for (const [componentName, component] of pairs(componentsToReplicate)) {
            // for each entity whose component just changed
            for (const [_, serverEntity, changed] of world.query(TargetEntity, Changed(component as Entity))) {
                const route = routes[componentName]
                const targetReplication = world.get(serverEntity, TargetReplication)
                const players = (targetReplication && targetReplication[component]) || Players.GetPlayers()

                // if the component exists in targetReplication and the table is empty then replicate to no players
                if (targetReplication && targetReplication[component]?.isEmpty()) continue

                // if the component is not a table then replicate to all players
                if (!route) {
                    error(`Missing route for component replication: ${componentName}`)
                } else {
                    // Wrap in Promise.try for robust error handling
                    Promise.try(() => {
                        // Use our serializer for ANY data shape
                        const payload = serializeForReplication(changed.new)

                        // send the serialized payload to all target players
                        route.sendToList({ serverEntity, data: payload as never }, players)
                    }).catch((err) => {
                        warn(`Replication error for ${componentName} at line ${$line}: ${tostring(err)}`)
                    })

                    // ensure delete events are propagated
                    world.set(serverEntity, OnRemove, () => {
                        routes.deleteReplicatedEntity.sendToAll(serverEntity)
                    })
                }
            }
        }
    }
} as SystemTable<[World]>