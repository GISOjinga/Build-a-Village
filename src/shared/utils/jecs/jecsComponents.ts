import { Entity, Name, Pair, pair, Wildcard, World } from "@rbxts/jecs";
import { Widgets } from "@rbxts/plasma";
import { number } from "@rbxts/react/src/prop-types";
import Signal from "@rbxts/signal"; import { PlayerData } from "shared/data/defaultData";
import { basePart } from "../functions/partFunctions";
import { boolean } from "@rbxts/squash";
import { Janitor } from "@rbxts/janitor";
import { Phase, Scheduler } from "@rbxts/planck";
import { HotReloader } from "@rbxts/hot-reloader";
import { ReplicatedStorage, RunService, ServerScriptService, Workspace } from "@rbxts/services";
import { ByteNetType, packet } from "@rbxts/bytenet-fixed";
import { PlayerState as PlayerStateType } from "../PlayerState";
import pageStates, { PageStates } from "../Animations/pageStates";



// variables
export const world = new World()
export const systemQueue = new Scheduler(world)
export const hotReloader = new HotReloader()
world.set(Name, Name, "Name")
const component = <T = undefined>(name: string, defaultValue?: T) => {
    const theComponent = world.component<T>()

    // Create a new component with the given name
    world.set(theComponent, Name, name)
    if (defaultValue) world.set(theComponent, theComponent, defaultValue)

    // returns it
    return theComponent
};

// types
export type JecsTagged<T extends Instance> = (isTagged: boolean, instance: T, world: World) => void;



// unorginized components
export const Route = component("Route");
export const ModelDebugger = component<Model | BasePart>("ModelDebugger");
export const Destroyed = component("Destroyed");
export const MaxedOut = component("MaxedOut"); // Assuming it's a boolean flag for maxed-out spawns
export const Spawned = component("Spawned");
export const Trash = component<{ trash: Janitor }>("Trash");
export const Debug = component<{ name: string, debug: boolean }>("Debug")
export const TargetEntity = component<Entity>("TargetEntity");
export const ReplicatedComponent = component<Entity>("ReplicatedComponent");
export const TargetReplication = component<{ [key in typeof componentsToReplicate[keyof typeof componentsToReplicate]]?: (Player[]) }>("TargetReplication"); // allows you to specify what players see what components (if it doesnt exist sends to all players)
export const Platform = component<PlatformExample>("Platform");
export const PlatformOccupied = component<Entity>("PlatformOccupied");

// a hook to watch for a route to be called
export const RouteEntities = new Map<packet<ByteNetType<unknown>>, Entity>()

/*************** game settinngs ***************/

// setting name
export const Settings = component("Settings")
const createSetting = <T = undefined>(name: string, defaultValue?: T) => {
    const theComponent = component<T>(name, defaultValue)

    // Create a new component with the given name
    world.set(theComponent, Settings, undefined)

    // returns it
    return theComponent
};

// example setting
export const ExampleSetting = createSetting<number>("ExampleSetting", 20);


// hooks
const _changedComponent = component<Changed<unknown>>("Changed")
const _addedComponent = component<Entity>("Added")
const _removedComponent = component<Entity>("Removed")

// for changes
type Changed<T> = { readonly old?: T, readonly new?: T }
export const [changedQuery, addedQuery, removedQuery] = [new Set<Entity>(), new Set<Entity>(), new Set<Entity>()]
export const Changed = <T>(comp: Entity<T>) => { changedQuery.add(comp); Added(comp); Removed(comp); return pair<Changed<T>, T>(_changedComponent as unknown as Entity<Changed<T>>, comp as unknown as Entity<T>) }
export const Added = <T>(comp: Entity<T>) => { addedQuery.add(comp); return pair<T, undefined>(_addedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>) }
export const Removed = <T>(comp: Entity<T>) => { removedQuery.add(comp); return pair<T, undefined>(_removedComponent as unknown as Entity<T>, comp as unknown as Entity<undefined>) }


/************************ Player ************************/
// Player data
export const Data = component<PlayerData>("Data");

// update data
export const UpdateData = component<{ updateFunction: (oldData: PlayerData) => PlayerData, bodyEntity: Entity }>("UpdateData");

// Player states
export const PlayerState = component<PlayerStateType>("PlayerState");

// player component
export const Player = component<Player>("Player");

// is alive
export const Alive = component("Alive");

// to gift to
export const GiftTo = component<Player>("GiftTo");

/*************** Villagers ***************/

// the hover box attachment
export const HoverBoxAttachment = component<Attachment>("HoverBoxAttachment", new Instance("Attachment", Workspace.Terrain));

// use to contain the active villagers entity
export const ActiveVillagers = component<Array<{ uniqueId: number, entity: Entity }>>("ActiveVillagers");

// villager
export const Villager = component<{
    villagerData: VillagerData,
    villagerModel: VillagerModel,
    playerEntity: Entity,
}>("Villager");

// to produce all
export const ProduceAll = component("ProduceAll");

/*************** Physics ***************/

// body turner rotating
export const TurnTo = component<{
    maxTorque?: number,
    responsiveness?: number,
    destroyEntityOnComplete?: boolean,
    alignOrientation: AlignOrientation,
    duration: number,
    attachment: Attachment
    target: Vector3 | BasePart
}>("TurnTo");

// Velocity
export const Velocity = component<Vector3>("Velocity");

// makes what ever it is floats
export const Float = component<{ linearVelocity: LinearVelocity, duration: number, bodyEntity: Entity }>("Float");

// zero out parts velocity
export const ZeroOutVelocity = component<BasePart>("ZeroOutVelocity");

// body mover for velocity
export const MoveTo = component<{
    relativeTo?: Enum.ActuatorRelativeTo,
    forceLimitMode?: Enum.ForceLimitMode
    maxAxesForce?: Vector3,
    maxForce?: number,
    destroyEntityOnComplete?: boolean,
    decelerationRate?: number,
    linearVelocity: LinearVelocity,
    duration?: number,
    attachment: Attachment,
    direction: Vector3,
    onDestroyedCallback?: () => void,
}>("MoveTo");

// align position to
export const AlignPosition = component<{
    velocity: number
    alignPosition: AlignPosition,
    attachment1: Attachment,
    attachment0: Attachment,
}>("AlignPosition");

// disalbes humanoid auto rotate for a time
export const DisableAutoRotate = component<{
    duration?: number
    destroyEntityOnComplete?: true,
    humanoid: Humanoid
}>("DisableAutoRotate");

// spawned at spawn
export const SpawnedAtSpawn = component("SpawnedAtSpawn");

/*************** body ***************/

// Body components
export const AppearanceLoaded = component("AppearanceLoaded");
export const NoBodyCollisions = component("NoBodyCollisions");
export const Body = component<{
    model: Model,
    head: BasePart,
    humanoid: Humanoid,
    rootPart: BasePart,
    animator: Animator
    rootAttachment: Attachment
    platform: PlatformExample | undefined,
}>("Body");

// body hidden
export const BodyHidden = component("BodyHidden");

// walkspeed
export const WalkSpeed = component<{ walkSpeed: number, defaultWalkSpeed: number }>("WalkSpeed");

// jump height
export const JumpHeight = component<{ jumpHeight: number, defaultJumpHeight: number }>("JumpHeight");

// For spawns
export const Entities = component<{ entities: number[] }>("Entities");

// setting animations
export const SetAnimation = component<{
    path: string,
    state: "Play" | "Stop",
    stopAllOtherAnimations?: boolean,
    transition?: number,
    speed?: number,
    weight?: number,
    timePosition?: number
}>("PlayAnimation");

// stop all animations
export const StopAnimationsExcept = component<AnimationTrack[]>("StopAnimations");

// loading animations
export const LoadingAnimations = component("LoadingAnimations");
// loaded animations
export const LoadedAnimations = component("LoadedAnimations");

// producer
export const ClientUiStates = component<PageStates>("ClientUiProducer", pageStates);

/******************* counting *******************/

// counts down
export const CountDown = component<number>("CountDown");
export const DestroyAfterCounting = component<true | (() => void)>("DestroyAfterCounting");

/******************* Attachment *******************/
// an attachment
export const Attachment = component<{ attachment: Attachment }>("Attach");

// follows a attachment
export const FollowInstance = component<{
    appliedTo: Attachment | BasePart,
    appliedFor: Attachment | BasePart,
    offset?: Vector3,
    speed: number
}>("FollowInstance");


/******************* particles *******************/

// emitting particles
export const EmitParticles = component<{
    particles: ParticleEmitter[],
    amount: number,
    delay: number,
}>("EmitParticles");

// increases particles size
export const IncreaseParticlesSize = component<{
    particles: ParticleEmitter[],
    multiplier: number,
    size: number,
    max?: number,
    delay: number,
}>("IncreaseParticleSize");


export const componentsToReplicate = { Body, Villager, Data };

// list of phases in order
const phaseNamesWithOrder = [
    // start ups
    "PreStartup",
    "Startup",
    "PostStartup",

    // initial
    "ChangeHook",
    "AppendHook",
    "First",

    // regular
    "PreUpdate",
    "Update",
    "PostUpdate",

    // very last
    "Last",
    "Routes",
] as const;

// creates a phase
export const Phases = phaseNamesWithOrder.reduce((acc, phaseName) => {
    acc[phaseName] = (Phase[phaseName as "PreStartup"] || new Phase(phaseName)) as never; // <-- create a Phase (call your constructor or factory here)
    return acc;
}, {} as { [key in typeof phaseNamesWithOrder[number]]: typeof Phase });

// exports the phases but ordered
export const OrderedPhases = phaseNamesWithOrder.reduce((acc, phaseName) => {
    acc.push(Phases[phaseName])
    return acc;
}, [] as (typeof Phase)[]);

// inserts the phases into the system queue
phaseNamesWithOrder.forEach((phaseName) => {
    if (Phase[phaseName as "PreStartup"]) {
        systemQueue.insert(Phases[phaseName])
    } else {
        systemQueue.insert(Phases[phaseName], (RunService.IsClient() ? RunService.RenderStepped : RunService.Stepped))
    }
})