import { Entity, World } from "@rbxts/jecs";
import Plasma, { Widgets } from "@rbxts/plasma";
import { RunService, ReplicatedStorage, CollectionService, Players } from "@rbxts/services";
import { hotReloader, JecsTagged, ModelDebugger, Phases, systemQueue, world } from "./jecsComponents";
import Object from "@rbxts/object-utils";
import Net from "@rbxts/yetanothernet";
import jabby from "@rbxts/jabby";
import { Plugin, System, SystemFn, SystemTable } from "@rbxts/planck/out/types";
import PlankJabbyPlugin from "@rbxts/planck-jabby";
import { PlanckHooksPlugin } from "shared/Plugin-Hook";
import { Phase } from "@rbxts/planck";
import { getInstanceByName } from "../functions/instanceFunctions";
import { createDebugger } from "../functions/jecsHelpFunctions";
import { sharedRoutes } from "shared/data/network";





// tags
const matterTag = <T extends Instance>(tag: string, world: World, callback: JecsTagged<T>) => {
    const allInstancesTagged = CollectionService.GetTagged(tag)

    // calls initally on all tagged instances
    for (const instance of allInstancesTagged) callback(true, instance as T, world)

    // when a new instance is tagged
    CollectionService.GetInstanceRemovedSignal(tag).Connect((instance) => callback(false, instance as T, world))
    CollectionService.GetInstanceAddedSignal(tag).Connect((instance) => callback(true, instance as T, world))
}





// "Players.GIS_jinga.PlayerScripts.TS.systems.camera.updateCamera"
// "StarterPlayer.StarterPlayerScripts.TS.systems.camera.updateCamera"
function transformPath(inputPath: string) {
    const startIndexOfP1 = (inputPath.find("PlayerScripts.")[0] || 0) + ("PlayerScripts.".size() - 1)
    const endIndexOfP1 = inputPath.size()
    const newString = inputPath.sub(startIndexOfP1, endIndexOfP1)

    return "StarterPlayer.StarterPlayerScripts" + newString
}


// loads in the client systems with hot reloading
function hotReload(systems: Array<SystemTable<[World]>>) {
    systems.forEach(systemStruct => {
        let systemMod = getInstanceByName(debug.info(systemStruct.system, "s")[0])

        // if system mod descendant of players
        if (systemMod) {
            if (systemMod.IsDescendantOf(Players)) {
                let systemToRemove: SystemFn<[World]> | SystemTable<[World]>
                const scriptToWatch = getInstanceByName(transformPath(debug.info(systemStruct.system, "s")[0]))
                let oldSystem: Instance

                // for reloading the system
                hotReloader.listen(scriptToWatch as ModuleScript, (newSystemMod) => {
                    if (!newSystemMod.IsA("ModuleScript")) return
                    const theSystem = (require(newSystemMod) as { default: SystemFn<[World]> | SystemTable<[World]> }).default
                    const toInput = !typeIs(theSystem, "function") ? theSystem : {
                        ...systemStruct,
                        phase: systemStruct.phase || Phases.Update,
                        system: theSystem
                    } as SystemTable<[World]>

                    // adds the system
                    systemQueue.addSystem(toInput)
                    systemToRemove = toInput
                    if (oldSystem) sharedRoutes.getReplicatedComponents.send()
                    // systemQueue.addSystem(systemStruct.system, systemStruct.phase || Phase.Update)
                }, (oldSystemMod) => {
                    if (!oldSystemMod.IsA("ModuleScript")) return

                    // removes the system
                    systemQueue.removeSystem(systemToRemove)
                    oldSystem = oldSystemMod
                })
            } else {
                let systemToRemove: SystemFn<[World]> | SystemTable<[World]>

                // for reloading the system
                hotReloader.listen(systemMod as ModuleScript, (newSystemMod) => {
                    if (!newSystemMod.IsA("ModuleScript")) return
                    const theSystem = (require(newSystemMod) as { default: SystemFn<[World]> | SystemTable<[World]> }).default
                    const toInput = !typeIs(theSystem, "function") ? theSystem : {
                        ...systemStruct,
                        phase: systemStruct.phase || Phases.Update,
                        system: theSystem
                    } as SystemTable<[World]>

                    // adds the system
                    systemQueue.addSystem(toInput)
                    systemToRemove = toInput
                    // systemQueue.addSystem(systemStruct.system, systemStruct.phase || Phase.Update)
                }, (oldSystemMod) => {
                    if (!oldSystemMod.IsA("ModuleScript")) return

                    // removes the system
                    systemQueue.removeSystem(systemToRemove)
                })
            }
        }
    })
}

// setup matter
export const setupMatter = (systems: Array<SystemTable<[World]>> = [], tags: { [key in string]: JecsTagged<any> } = {}) => {
    const startUpsOrdered = [Phases.PreStartup, Phases.Startup, Phases.PostStartup]
    if (RunService.IsServer()) jabby.broadcast_server()

    systems = systems.reduce((acc, system) => {
        const scriptToWatch = getInstanceByName(transformPath(debug.info(system.system, "s")[0]))
        const systemName = scriptToWatch ? scriptToWatch.Name : "UnknownSystem"
        const oldSystem = system.system
        // print(systemName, scriptToWatch, transformPath(debug.info(system.system, "s")[0]))
        acc.push(scriptToWatch ? {
            ...system,
            name: systemName,
        } : system);
        return acc
    }, new Array<SystemTable<[World]>>())
    print(systems)

    // registers the world
    jabby.register({
        name: "World " + (RunService.IsClient() ? "Client" : "Server"),
        applet: jabby.applets.world,
        configuration: {
            world, get_entity_from_part: (part) => {
                for (const [entity, model] of world.query(ModelDebugger)) {
                    if (part.IsDescendantOf(model) || part === model) {
                        return [entity, (model.IsA("Model") && model.PrimaryPart) || part] as LuaTuple<[Entity, Part]>
                    }
                }

                return [undefined, part] as unknown as LuaTuple<[Entity, Part]>
            }
        },
    })

    // Create
    jabby.set_check_function(player => {
        if (player.GetRankInGroup(36086761) >= 254 || player.UserId < 0) {
            return true
        } else {
            return false
        }
    })

    // sets up the tagging
    for (const [key, value] of pairs(tags)) {
        matterTag(key, world, value)
    }

    // steps it
    systemQueue.addPlugin(new PlankJabbyPlugin()).addPlugin(new PlanckHooksPlugin())
    // loops through all the start up systems and creates a debugger for them
    systems.forEach((systemStruct) => {
        let systemMod = getInstanceByName(debug.info(systemStruct.system, "s")[0])
        // if (systemMod) createDebugger(false, systemMod.Name)
    })

    // adds the systems for initial start up
    startUpsOrdered.forEach((phase) => {
        systems.forEach((system) => {
            if (system.phase === phase) {
                systemQueue.addSystem(system.system, system.phase || phase)
                systemQueue.run(system.system)
            }
        })
    })

    // adds the rest of the systems
    hotReload(systems)


    if (RunService.IsClient()) sharedRoutes.jecsSetup.send()

    // return the debugger
    return debug
}
