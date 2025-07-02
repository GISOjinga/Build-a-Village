import { Delete, Entity, Name, OnAdd, OnRemove, OnChange, Pair, pair, Wildcard, World } from "@rbxts/jecs"
import { Phase, Scheduler } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { useMemo, useState } from "shared/Plugin-Hook"
import { createDebugger } from "shared/utils/functions/jecsHelpFunctions"
import { Added, addedQuery, Changed, changedQuery, Debug, Phases, Removed, removedQuery, TargetEntity, world } from "shared/utils/jecs/jecsComponents"

const waitingList = new Array<Callback>()
const appendList = new Array<Callback>()


// adds it to a waiting list then when the cycle finaly sees it then calls it as a group with the others appends
export const appendJecs = (callback: Callback) => waitingList.push(callback)

// for change
export default {
    phase: Phases.DebuggerHook,
    system: (world) => {
        // goes through all the debuggers
        // for (const [_, { name }] of world.query(Debug)) createDebugger(true, name)
    }
} as SystemTable<[World]>