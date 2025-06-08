import { ByteNetType, packet } from "@rbxts/bytenet-fixed"
import { Janitor } from "@rbxts/janitor"
import { Delete, Entity, Name, OnAdd, OnRemove, OnChange, Pair, pair, Wildcard, World } from "@rbxts/jecs"
import Object from "@rbxts/object-utils"
import { Phase, Scheduler } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { RunService } from "@rbxts/services"
import { routes } from "shared/data/network"
import { useMemo, useState } from "shared/Plugin-Hook"
import { Added, addedQuery, Append, Changed, changedQuery, Phases, Removed, removedQuery, TargetEntity, world } from "shared/utils/jecs/jecsComponents"


export const routesData = new Map<packet<ByteNetType<unknown>>, (unknown[])[]>()


// for change
export default {
    phase: Phases.PreStartup,
    system: (world) => {
        // connected routes
        const connectedRoutes = new Array<Callback>()
        const trash = new Janitor()

        // links the trash
        trash.LinkToInstance(script, true)
        trash.Add(() => connectedRoutes.forEach((routeCallback) => routeCallback()))

        // loops through all the routes to listen to them
        for (const [_, route] of Object.entries(routes)) {
            const dataCalled = [] as (unknown[])[]

            // if route data doesnt have the route then adds it
            routesData.set(route as never, dataCalled)

            // listens to it
            route.listen((routeData, player) => {
                world.set(world.entity(), Append, () => {
                    dataCalled.push([routeData, player])
                    world.set(world.entity(), Append, () => dataCalled.shift())
                })
            })
        }
    }
} as SystemTable<[World]>