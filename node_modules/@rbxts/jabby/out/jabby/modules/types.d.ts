import jecs from "@rbxts/jecs"

type host = "client" | "server"

export interface IncomingConnector {
	host: Player | "server",
	from_vm: number,
	to_vm: number
}

export interface OutgoingConnector {
	host: Player | "server",
	/**
     * not specifying a vm makes it received by all
     */
    to_vm?: number,
	from_vm: undefined
}

export interface NetEvent<T extends unknown[]> {
	type: "event",

	fire: (connector: OutgoingConnector, ...args: T) => void,
	connect: (callback: (connector: IncomingConnector, ...args: T) => void) => RBXScriptConnection,
}

export type NetCallback<T extends unknown[], U extends unknown[]> = {
	type: "callback",

	invoke: (connector: OutgoingConnector, ...args: T) => LuaTuple<U>,
	set_callback: (callback: (connector: IncomingConnector, ...args: T) => LuaTuple<U>) => void
}

declare const SYSTEM_ID_ARCHTYPE: unique symbol

export type SystemId = number & {
    [SYSTEM_ID_ARCHTYPE]: never
}

export type SystemTag = "processing" | "finished" | "paused"
export interface SystemSettingData {
	name?: string,
	phase?: string,
	layout_order?: number,
	paused?: boolean,
}
export interface SystemData {
	name: string,
	phase?: string,
	layout_order: number,
	paused: boolean
}

type ChangeTypes = "remove" | "clear" | "delete" | "add" | "set" | "entity" | "component"
export interface WatchLoggedChanges {
	types: ChangeTypes[],
	entities: jecs.Entity[],
	component: jecs.Entity[],
	values: string[],
	worlds: jecs.World[]
}

export interface SystemWatch {
	/**
     * enables Lua Object Notation.
     * incurs a significant performance penalty. 
     */
	enable_lon: boolean,
	/**
     * the current frame to process
     */
	frame: number,

	frames: WatchLoggedChanges[]
}

export interface SystemLabel {}

export interface SystemFrame {
	i: number,
	s: number
}

interface WatchData {
    active: boolean,
    watch: SystemWatch,
    untrack: () => void
}

export interface ProcessingFrame {
	started_at: number
}

export declare class Scheduler {
    name: string

    /**
     * contains a map of valid system ids
     */
    valid_system_ids: Set<SystemId>

    /**
     * contains a list of static system data that is updated infrequently
     */
    system_data: Map<SystemId, SystemData>

    /**
     * list of system data that has updated
     */
    system_data_updated: Set<SystemId>

    /**
     * contains a buffer of the last couple frames of system data that is refreshed constantly
     */
    system_frames: Map<SystemId, SystemFrame[]>

    /**
     * stores the frames that have been updated
     */
    system_frames_updated: Map<SystemId, Set<SystemFrame>>

    /**
     * contains the current frame that a system is processing
     */
    processing_frame: Map<SystemId, ProcessingFrame>

    /**
     * contains a list of watches for each system
     */
    system_watches: Map<SystemId, { active: boolean, watch: SystemWatch }[]>

    register_system(settings?: SystemSettingData): SystemId
    set_system_data(id: SystemId, settings: SystemSettingData): void
    get_system_data(id: SystemId): SystemData
    remove_system(id: SystemId): void
    
    private _mark_system_frame_start(id: SystemId): void
    private _mark_system_frame_end(id: SystemId, s?: number): void
    private append_extra_frame_data(id: SystemId, label: unknown): void

    run<T extends unknown[]>(id: SystemId, system: (...args: T) => void, ...args: T): void
    create_watch_for_system(id: SystemId): WatchData
}

export class World {
	class_name: "World"
    name: string
    world: jecs.World

    entities: Map<Instance, jecs.Entity>
    get_entity_from_part?: (part: BasePart) => LuaTuple<[jecs.Entity | undefined, BasePart | undefined]>
}
