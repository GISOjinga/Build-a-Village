import { Plugin } from "@rbxts/planck/out/types"
import  Scheduler  from "@rbxts/planck/out/Scheduler"

declare class PlankJabbyPlugin implements Plugin {
    build(schedular: Scheduler<unknown[]>): void
}

export = PlankJabbyPlugin;