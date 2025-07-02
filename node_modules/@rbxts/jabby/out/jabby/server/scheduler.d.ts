import { Scheduler } from "../modules/types"

interface SchedulerExports {
    create: () => Scheduler
    schedulers: Scheduler[]
}

declare const scheduler: SchedulerExports
export = scheduler
