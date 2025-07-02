import Phase from "./Phase";

declare class Pipeline {
    constructor(debugName?: string)
    insert(phase: Phase) : Pipeline
    insertAfter(phase: Phase, after: Phase): Pipeline
    insertBefore(phase: Phase, before: Phase): Pipeline
    static readonly Startup: Pipeline
}

export = Pipeline;