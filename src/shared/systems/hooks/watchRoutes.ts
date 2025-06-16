import { ByteNetType, packet } from "@rbxts/bytenet-fixed"
import { Janitor } from "@rbxts/janitor"
import { Delete, Entity, Name, OnAdd, OnRemove, OnChange, Pair, pair, Wildcard, World } from "@rbxts/jecs"
import Object from "@rbxts/object-utils"
import { Phase, Scheduler } from "@rbxts/planck"
import { SystemTable } from "@rbxts/planck/out/types"
import { RunService } from "@rbxts/services"
import { routes } from "shared/data/network"
import { useMemo, useState } from "shared/Plugin-Hook"
import { Added, addedQuery, Changed, changedQuery, Phases, Removed, removedQuery, TargetEntity, world } from "shared/utils/jecs/jecsComponents"
import { appendJecs } from "./append"


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
        for (const [name, route] of Object.entries(routes)) {
            const dataCalled = [] as (unknown[])[]

            // if route data doesnt have the route then adds it
            routesData.set(route as never, dataCalled)

            // listens to it
            connectedRoutes.push(route.listen((routeData, player) => {
                appendJecs(() => {
                    dataCalled.push([routeData, player])
                    appendJecs(() => dataCalled.shift())
                })
            }))
        }
    }
} as SystemTable<[World]>