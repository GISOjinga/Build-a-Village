declare class Phase {
    constructor(debugName?: string)
    static readonly PreStartup: Phase
    static readonly Startup: Phase
    static readonly PostStartup: Phase
}

export = Phase;