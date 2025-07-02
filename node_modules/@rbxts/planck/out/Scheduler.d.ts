import Phase from "./Phase";
import Pipeline from "./Pipeline";
import { Hooks, EventInstance, EventLike, System, Plugin, HookFunctionMap, HookFunctionArgs } from "./types";

declare class Scheduler<T extends unknown[]> {
    /** @hidden */
    _orderedPhases: Phase[]
    Hooks: Hooks["Hooks"]
    cleanup(): void
    addRunCondition(dependent: System<T>, fn: (...args: T) => boolean): Scheduler<T>
    replaceSystem(oldSystem: System<T>, newSystem: System<T>): Scheduler<T>
    removeSystem(system: System<T>): Scheduler<T>
    editSystem(system: System<T>, phase: Phase): Scheduler<T>
    addSystem(system: System<T>, phase?: Phase): Scheduler<T>
    addSystems(systems: System<T>[], phase?: Phase): Scheduler<T>
    insertBefore(dependent: Phase, before: Phase): Scheduler<T>
    insertBefore(dependent: Pipeline, before: Phase): Scheduler<T>
    insertAfter(phase: Phase, after: Phase | Pipeline): Scheduler<T>
    insertAfter(pipeline: Pipeline, after: Phase | Pipeline): Scheduler<T>
    insert(dependent: Phase | Pipeline, instance: EventInstance, event?: string): Scheduler<T>
    insert(dependent: Phase | Pipeline): Scheduler<T>
    runAll(): Scheduler<T>
    run(dependent: System<T> | Phase | Pipeline): Scheduler<T>
    getDeltaTime(): number
    addPlugin(plugin: Plugin): Scheduler<T>
    /** @hidden */
    _addHook<K extends keyof HookFunctionMap>(hook: K, fn: (info: HookFunctionArgs<K, T>) => void): void
    constructor(...args: T)
}

export = Scheduler;