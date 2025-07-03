import { Delete, Entity, Name, OnAdd, OnRemove, OnChange, Pair, pair, Wildcard, World } from "@rbxts/jecs"
import { Phase, Scheduler } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { $line } from "rbxts-transformer-inline"
import { useMemo, useState } from "shared/Plugin-Hook"
import { printTS } from "shared/utils/functions/jecsHelpFunctions"
import { Added, addedQuery, Changed, changedQuery, Data, Phases, Removed, removedQuery, TargetEntity, world } from "shared/utils/jecs/jecsComponents"
import { appendJecs } from "./append"
import { deepCopy } from "@rbxts/object-utils"


// components
const previousValue = new Map<Pair<unknown, unknown>, unknown>()

// one time
for (const [comp, name] of world.query(Name)) {
    if (name.find("jecs.").size() > 0 || name === "Added" || name === "Removed" || name === "Changed" || name === "Append") continue

    removedQuery.add(comp)
    addedQuery.add(comp)
    changedQuery.add(comp)
}

// function to create a change save
function createChangeSave(world: World, target: Entity, comp: Entity, oldValue?: unknown, newValue?: unknown) {

    // appends the entity into the world
    appendJecs(() => {
        const entityChanged = world.entity()

        // applies the changed component to the entity
        world.set(entityChanged, TargetEntity, target)
        world.set(entityChanged, Changed(comp), { old: oldValue, new: newValue })

        // when it comes back full circle: Removed changed entity so it doesn't show twice
        appendJecs(() => world.delete(entityChanged))
    })
}

// function hasChanged(changed: { old: unknown, new: unknown }): boolean {
//     // does a deep comparision telling whats different
//     const oldData = changed.old as Record<string, unknown>
//     const newData = changed.new as Record<string, unknown>
//     const differences = new Array<string>()

//     function recursiveCheck(tabl1: unknown, tabl2: unknown, path = "", differences: string[] = []) {
//         if (typeIs(tabl1, "table") && typeIs(tabl2, "table")) {
//             for (const [key, value1] of pairs(tabl1)) {
//                 const value2 = (tabl2 as Record<string, unknown>)[key as string];
//                 const fullPath = path === "" ? `${key}` : `${path}.${key}`;

//                 if (typeIs(value1, "table") && typeIs(value2, "table")) {
//                     recursiveCheck(value1, value2, fullPath, differences);
//                 } else if (value1 !== value2) {
//                     differences.push(`Changed: ${fullPath} from ${value1} to ${value2}`);
//                 }
//             }
//         } else {
//             // If they are not both tables, we compare directly
//             if (tabl1 !== tabl2) {
//                 differences.push(`Changed: ${path} from ${tabl1} to ${tabl2}`);
//             }
//         }

//         return differences;
//     }

//     recursiveCheck(oldData, newData, "", differences)
//     return differences.size() > 0
// }


// for change
export default {
    phase: Phases.ChangeHook,
    system: (world) => {
        // disconnects all the components
        for (const [comp] of world.query(OnAdd)) world.remove(comp, OnAdd)
        for (const [comp] of world.query(OnRemove)) world.remove(comp, OnRemove)
        for (const [comp] of world.query(OnChange)) world.remove(comp, OnChange)

        // for all added query
        addedQuery.forEach((comp) => {
            world.set(comp, OnAdd, (entity) => {
                const pairing = pair(entity, comp)
                const value = world.get(entity, comp)
                const entityAdded = world.entity()

                // sets the value
                previousValue.set(pairing, typeIs(value, "table") ? deepCopy(value) : value)

                // append
                appendJecs(() => {
                    // applies the added component to the entity && updates the previous value
                    world.set(entityAdded, TargetEntity, entity)
                    world.set(entityAdded, Added(comp), value)
                    createChangeSave(world, entity, comp, undefined, value)

                    // when it comes back full circle: Removed added entity so it doesn't show twice
                    appendJecs(() => world.delete(entityAdded))
                })
            })
        })

        // for all changed query
        changedQuery.forEach((comp) => {
            world.set(comp, OnChange, (entity, comp, newValue) => {
                const pairing = pair(entity, comp)
                const oldValue = previousValue.get(pairing)

                // if (hasChanged({ old: oldValue, new: newValue })) {
                // sets the new value
                previousValue.set(pairing, typeIs(newValue, "table") ? deepCopy(newValue) : newValue)

                // calls it
                createChangeSave(world, entity, comp, oldValue, newValue)
                // }
            })
        })

        // for all removed query
        removedQuery.forEach((comp) => {
            world.set(comp, OnRemove, (entity) => {
                const pairing = pair(entity, comp)
                const oldValue = world.get(entity, comp)

                // destroys the previous value
                previousValue.delete(pairing)

                // appends the entity into the world
                appendJecs(() => {
                    const entityRemoved = world.entity()

                    // applies the removed component to the entity
                    world.set(entityRemoved, Removed(comp), oldValue)
                    world.set(entityRemoved, TargetEntity, entity)
                    createChangeSave(world, entity, comp, oldValue)

                    // when it comes back full circle: Removed removed entity so it doesn't show twice
                    appendJecs(() => world.delete(entityRemoved))
                })
            })
        })

        // clears removed added and changed
        removedQuery.clear()
        addedQuery.clear()
        changedQuery.clear()
    }
} as SystemTable<[World]>