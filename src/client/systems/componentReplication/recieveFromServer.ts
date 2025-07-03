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
import { Entity, World } from "@rbxts/jecs" // Matter framework functions and types.
import { $line } from "rbxts-transformer-inline" // Inline transformer for debug line numbers.
import { componentsToReplicate, Phases } from "shared/utils/jecs/jecsComponents" // Matter components.

import paths from "shared/utils/paths" // Module paths.
import { Widgets } from "@rbxts/plasma" // UI Widgets for debugging and display.
import { useEffect, useEvent, useMemo } from "shared/Plugin-Hook"
import { ComponentValue, createEntity, getEntity, printJecs, warnJecs, warnTS } from "shared/utils/functions/jecsHelpFunctions"
import { isPointInView } from "shared/utils/functions/vector3Functions"
import { defineCleanupCallback } from "@rbxts/hot-reloader"
import { useRoute } from "shared/Plugin-Hook/hooks/use-route"
import { Phase } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { deepCopy } from "@rbxts/object-utils"
import { appendJecs } from "shared/systems/hooks/append"
import { getInstanceByUniqueIdPath } from "shared/utils/functions/instanceFunctions"
import routes from "client/routes"



// checks data for __ByteNetInstancePath to make sure it has all the instances replicated
function checkData(data?: unknown) {
    // recursive check/fix
    function check(path: object, index: never, value: unknown): [boolean, object] {
        // if data is a table then check each value
        if (typeIs(value, "table")) {
            if ("__ByteNetInstancePath" in value) {
                const instance = getInstanceByUniqueIdPath(value.__ByteNetInstancePath as string[])

                if (!instance) {
                    return [false, path]
                } else {
                    path[index] = instance as never
                }
            } else {
                // saves it
                path[index] = {} as never

                // if the value is a table then check each value
                for (const [key, val] of pairs(value)) {
                    const [passed, newPath] = check(path[index], key as never, val as never)

                    // if passed then continue
                    if (!passed) {
                        return [false, newPath]
                    }
                }
            }
        } else {
            path[index] = value as never
        }

        return [true, path]
    }

    // if data is a table and has __ByteNetInstancePath then return true
    if (typeIs(data, "table")) {
        if ("__ByteNetInstancePath" in data) {
            const instance = getInstanceByUniqueIdPath(data.__ByteNetInstancePath as string[])

            // if instance is not in the world then return false
            if (!instance) {
                return $tuple(false, data)
            } else {
                return $tuple(true, instance as never)
            }
        } else {
            const newData = deepCopy(data) as object
            for (const [key, value] of pairs(data)) {
                const [passed, newPath] = check(newData, key as never, value as never)

                // if passed then continue
                if (!passed) return $tuple(false, data)
            }

            return $tuple(true, newData)
        }
    } else {
        return $tuple(true, data)
    }
}

/*****************************************************************************************
 * Damage Status Effects System Entry Point.
 *****************************************************************************************/
export default {
    phase: Phases.First,
    system: (world) => {

        // loops through each
        for (const [componentName, component] of pairs(componentsToReplicate)) {

            // function to replicate
            const replicate = ({ serverEntity, data }: { serverEntity: Entity, data?: unknown }) => {
                const [passed, newData] = checkData(data)

                // if passed then continue
                if (passed) {
                    const clientEntity = getEntity.replicatedFromServerEntity(serverEntity) || createEntity.replicated(serverEntity)

                    // if client entity and not newData then delete entity
                    if (!newData) {
                        world.remove(clientEntity, component)
                    } else {
                        printJecs($line, `Replicating ${componentName} for ${serverEntity}: ${newData}`)
                        world.set(clientEntity, component, newData as never)
                    }
                } else {
                    warnTS($line, `Failed to replicate ${componentName} for ${serverEntity}: ${newData}. Some parts arent fully replicated will try again.`)
                    appendJecs(() => replicate({ serverEntity, data: newData }))
                }
            }

            // when ever data gets updated it updates the server entity
            useRoute(routes[componentName], replicate as never)
        }

        // when the deleteReplicatedEntity is called
        useRoute(routes.deleteReplicatedEntity, (serverEntity) => {
            const clientEntity = getEntity.replicatedFromServerEntity(serverEntity)

            // if client entity then remove
            if (clientEntity) world.delete(clientEntity)
        })


        // request to get it all
        useMemo(() => routes.getReplicatedComponents.send(), [])
    }
} as SystemTable<[World]>