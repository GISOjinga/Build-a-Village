import { Delete, Entity, Name, OnAdd, OnRemove, OnChange, Pair, pair, Wildcard, World } from "@rbxts/jecs"
import { Phase, Scheduler } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { useMemo, useState } from "shared/Plugin-Hook"
import { Added, addedQuery, Append, Changed, changedQuery, Phases, Removed, removedQuery, TargetEntity, world } from "shared/utils/jecs/jecsComponents"



// for change
export default {
    phase: Phases.AppendHook,
    system: (world) => {
        // when appends are removed
        for (const [appendedEntity, callback] of world.query(Append)) {
            world.delete(appendedEntity)
            callback()
        }
    }
} as SystemTable<[World]>