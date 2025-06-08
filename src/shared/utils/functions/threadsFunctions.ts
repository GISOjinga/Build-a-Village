import { RunService } from "@rbxts/services";



// table of intervals to run through
type RunFunction = (delta: number, totalTimePassed: number) => void
const intervals = new Map<any, { Init: number, Delta: number, Delay: number, Time: number, DeleteAfter?: number, Run: RunFunction }>()
const timeOuts = new Map<any, { Init: number, Delta: number, EndTime: number, Run: RunFunction }>()


export function createInterval(run: RunFunction, delay: number, extra: { immediate?: boolean, deleteAfter?: number } = {}) {
    intervals.set(run, { Init: tick(), Delta: tick(), Delay: delay, Time: extra.immediate ? 0 : tick() + delay, Run: run, DeleteAfter: extra.deleteAfter ? tick() + extra.deleteAfter : undefined })

    // returns a function to destroy it 
    return () => {
        intervals.delete(run)
    }
}


// creates a time out
export function createTimeout(run: RunFunction, delay: number) {
    timeOuts.set(run, { Init: tick(), Delta: tick(), EndTime: tick() + delay, Run: run })

    return () => {
        if (timeOuts.has(run)) timeOuts.delete(run)
    }
}


// on heartbeat
RunService.Heartbeat.Connect(() => {
    timeOuts.forEach((timeOut, key) => {
        const tickTime = tick()

        // if the time is greater than the delay
        if (timeOut.EndTime <= tick()) {
            task.spawn(timeOut.Run, tickTime - timeOut.Delta, tickTime - timeOut.Init)
            timeOuts.delete(key)
        }
    })

    intervals.forEach((interval) => {
        const tickTime = tick()

        // if the time is greater than the delay
        if (interval.Time < tickTime) {
            task.spawn(interval.Run, tickTime - interval.Delta, tickTime - interval.Init)
            interval.Time = tickTime + interval.Delay
            interval.Delta = tickTime

            // if delete after is not -1
            if (interval.DeleteAfter && interval.DeleteAfter < tickTime) {
                intervals.delete(interval.Run)
            }
        }
    })
})