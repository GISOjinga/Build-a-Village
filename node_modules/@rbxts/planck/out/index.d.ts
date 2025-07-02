import phase from "./Phase";
import pipeline from "./Pipeline";
import schedular from "./Scheduler";
import condition from "./conditions"

interface Planck {
    Phase: typeof phase;
    Pipeline: typeof pipeline; 
    Scheduler: typeof schedular;

    isNot: typeof condition.isNot;
    timePassed: typeof condition.timePassed;
    runOnce: typeof condition.runOnce;
    onEvent: typeof condition.onEvent;
}

declare const planck: Planck;
export = planck;