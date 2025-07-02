import Phase from "./Phase";
import Pipeline from "./Pipeline";
import Scheduler from "./Scheduler";

export type SystemInfo<T extends unknown[]> = {
    readonly system: SystemFn<T>;
    readonly phase: Phase;
    readonly name: string;
    readonly logs: string[];
}


export interface Hooks {
    readonly Hooks: {
        readonly SystemAdd: "SystemAdd";
        readonly SystemRemove: "SystemRemove";
        readonly SystemReplace: "SystemReplace";
        readonly SystemError: "SystemError";

        readonly OuterSystemCall: "OuterSystemCall";
        readonly InnerSystemCall: "InnerSystemCall";
        readonly SystemCall: "SystemCall";

        readonly PhaseAdd: "PhaseAdd";
        readonly PhaseBegan: "PhaseBegan";
    }
    systemAdd: <T extends unknown[] = unknown[]>(scheduler: Scheduler<T>, systemInfo: SystemInfo<T>) => void;
    systemRemove: <T extends unknown[] = unknown[]>(scheduler: Scheduler<T>, systemInfo: SystemInfo<T>) => void;
    systemReplace: <T extends unknown[] = unknown[]>(scheduler: Scheduler<T>, oldSystemInfo: SystemInfo<T>, newSystemInfo: SystemInfo<T>) => void;
    systemCall: <T extends unknown[] = unknown[]>(scheduler: Scheduler<T>, hookName: "OuterSystemCall" | "InnerSystemCall" | "SystemCall", systemInfo: SystemInfo<T>, nextFn: () => void) => void;
    systemError: <T extends unknown[] = unknown[]>(scheduler: Scheduler<T>, systemInfo: SystemInfo<T>, error: string) => void;
    phaseAdd: <T extends unknown[] = unknown[]>(scheduler: Scheduler<T>, phase: Phase) => void;
    phaseBegan: <T extends unknown[] = unknown[]>(scheduler: Scheduler<T>, phase: Phase) => void;
}
type SystemAddHookArgs<T extends unknown[]> = {
    scheduler: Scheduler<T>,
    system: SystemInfo<T>
}
type SystemRemoveHookArgs<T extends unknown[]> = SystemAddHookArgs<T>;
type SystemReplaceHookArgs<T extends unknown[]> = {
    scheduler: Scheduler<T>,
    old: SystemInfo<T>,
    new: SystemInfo<T>
}
type SystemErrorHookArgs<T extends unknown[]> = SystemAddHookArgs<T> & { error: string };
type SystemCallHookArgs<T extends unknown[]> = {
    scheduler: undefined;
    system: SystemInfo<T>;
    nextFn: () => void;
}
type PhaseAddHookArgs<T extends unknown[]> = {
    scheduler: Scheduler<T>;
    phase: Phase;
}
type PhaseBeganHookArgs<T extends unknown[]> = PhaseAddHookArgs<T>;
type HookFunctionMap<T extends unknown[] = unknown[]> = {
    SystemAdd: SystemAddHookArgs<T>;
    SystemRemove: SystemRemoveHookArgs<T>;
    SystemReplace: SystemReplaceHookArgs<T>;
    SystemError: SystemErrorHookArgs<T>;
    OuterSystemCall: SystemCallHookArgs<T>;
    InnerSystemCall: SystemCallHookArgs<T>;
    SystemCall: SystemCallHookArgs<T>;
    PhaseAdd: PhaseAddHookArgs<T>;
    PhaseBegan: PhaseBeganHookArgs<T>;
}
// Utility type to get the correct function type based on the hook name
type HookFunctionArgs<K extends keyof HookFunctionMap, T extends unknown[]> = HookFunctionMap<T>[K];

export type SystemFn<T extends unknown[]> = ((...args: T) => unknown[]) | ((...args: T) => void);

export interface SystemTable<T extends unknown[]> {
    readonly system: SystemFn<T>;
    readonly phase?: Phase
    readonly [key: string]: unknown
}

export type System<T extends unknown[]> = SystemFn<T> | SystemTable<T>;

export type EventLike<T extends unknown[] = unknown[]> =  {
    connect(callback: (...args: T) => void): void;
} | {
    Connect(callback: (...args: T) => void): void;
} | {
    on(callback: (...args: T) => void): void;
} | {
    On(callback: (...args: T) => void): void;
} 

export type EventInstance<T extends unknown[] = unknown[]> = Instance | EventLike<T> | RBXScriptSignal;
export type Disconnectable = RBXScriptConnection | { Disconnect(): void } | { disconnect(): void } | { Destroy(): void } | { destroy(): void; }
export type ConnectFn = (callback: (...args: unknown[]) => void) => Disconnectable;


export interface Utils {
    getSystem: <T extends unknown[]>(system: System<T>) => SystemFn<T> | undefined   
    getSystemName: <T extends unknown[]>(system: SystemFn<T>) => string
    isPhase: (phase: Phase) => Phase | undefined
    isPipeline: (pipeline: Pipeline) => Pipeline | undefined
    getEventIdentifier: <T extends unknown[]>(instance: EventInstance<T>, event?: string) => string
    isValidEvent: <T extends unknown[]>(instance: EventInstance<T>, event?: string) => boolean
    getConnectedFunction: <T extends unknown[]>(instance: EventInstance<T>, event?: string) => ConnectFn | undefined
    disconnectEvent: (disconectable: Disconnectable) => void
}

export interface Plugin {
    build(schedular: Scheduler<unknown[]>): void
}





