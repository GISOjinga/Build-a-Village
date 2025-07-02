import { Entity, World } from "@rbxts/jecs"
import type { Scheduler } from "./modules/types"

interface Applet<T> {
    add_to_public: (name: string, config: T) => void
}

interface WorldConfig {
    world: World,
    entities?: Map<Instance, Entity>,
    get_entity_from_part?: ((part: BasePart) => LuaTuple<[Entity, Part]>)
}

interface SchedulerConfig {
    scheduler: Scheduler
}

interface Jabby {
    set_check_function: (callback: (player: Player) => boolean) => void
    obtain_client: () => typeof import("./client")

    vm_id: number

    scheduler: typeof import("./server/scheduler")
    broadcast_server: typeof import("./server")["broadcast"]

    applets: {
        world: Applet<WorldConfig>
        scheduler: Applet<SchedulerConfig>
    }

    register: <T>(info: { name: string, applet: Applet<T>, configuration: T }) => void
}

declare const jabby: Jabby
export = jabby
