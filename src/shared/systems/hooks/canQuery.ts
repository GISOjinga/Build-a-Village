import { Entity, World, pair } from "@rbxts/jecs"
import { SystemTable } from "@rbxts/planck/out/types"
import { appendJecs } from "./append"
import { Phases, Pending, pendingQuery, Villager } from "shared/utils/jecs/jecsComponents"

const defaultMax = 10

const componentsMax = {
    [Villager]: 5,
}

const queryData = new Map<Entity<unknown>, { queue: Entity[]; current: Entity[] }>()

export default {
    phase: Phases.First,
    system: (world: World) => {
        pendingQuery.forEach((component) => {
            let data = queryData.get(component)
            if (!data) {
                data = { queue: [], current: [] }
                queryData.set(component, data)
            }

            // remove pending marks from last cycle
            data.current.forEach((entity) => {
                if (world.contains(entity)) appendJecs(() => world.remove(entity, pair(Pending, component)))
            })
            data.current = []

            // prune queue of invalid entities
            data.queue = data.queue.filter((entity) => world.contains(entity) && world.get(entity, component) !== undefined)

            // add new entities not present in queue
            for (const [entity] of world.query(component)) {
                if (!data.queue.includes(entity)) data.queue.push(entity)
            }

            let processed = 0
            while (processed < (componentsMax[component] || defaultMax) && data.queue.size() > 0) {
                const entity = data.queue.shift()!
                appendJecs(() => world.add(entity, pair(Pending, component) as never))
                data.current.push(entity)
                data.queue.push(entity)
                processed++
            }
        })
    },
} as SystemTable<[World]>
