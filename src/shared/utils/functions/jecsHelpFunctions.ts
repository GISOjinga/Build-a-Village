import { Entity, Name, Pair, pair, w, Wildcard, World } from "@rbxts/jecs";
import * as components from "shared/utils/jecs/jecsComponents";
import { AlignPosition, CountDown, DestroyAfterCounting, Float, MoveTo, world, ZeroOutVelocity } from "../jecs/jecsComponents";
import Object, { deepCopy } from "@rbxts/object-utils";
import { Players, RunService, Workspace } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { PlayerState as PlayerStateComponent } from "shared/utils/jecs/jecsComponents";
import { PlayerState } from "../PlayerState";
import { getInstanceByName } from "./instanceFunctions";
import { Janitor } from "@rbxts/janitor";
import { PlayerData } from "shared/data/defaultData";
import paths from "../paths";
import villagersProgressData from "shared/data/villagersProgressData";


export type ComponentValue<C> =
    C extends Entity<infer T> ? T :
    C extends Pair<infer _, infer O> ? O :
    never;
export type AllComponentNames = { [K in keyof typeof components]: (typeof components)[K] extends Entity<any> ? K : never }[keyof typeof components];
export type MappedComponents = { [K in AllComponentNames]: (typeof components)[K] };

export const MappedComponents: MappedComponents = components as MappedComponents;
export const MappedComponentsSwitched = Object.entries(MappedComponents).map(([k, v]) => [v, k] as const).reduce((acc, [k, v]) => { acc[k] = v; return acc }, {} as Record<string, string>) as (
    ReturnType<<CompName extends AllComponentNames>()=>(
        { [K in MappedComponents[CompName]]: CompName }
    )>
)

export const checkEntity = {
    hasCountDown: (entityLink: Entity, component: MappedComponents[AllComponentNames]) => world.query(CountDown, pair(entityLink, component as Entity)).iter()()[0],
}

// for getting
export const getEntity = {
    replicatedFromServerEntity: (serverEntity: Entity) => world.query(components.ReplicatedComponent, serverEntity).iter()()[0],

    // gets you the body from entity
    bodyFromPlayer: (player:Player) => {
        const entity = getEntity.fromInstance(player)
        const body = entity && world.get(entity, components.Body)

        return body
    },

    // gets you the countDown component
    countDownRelationship: (component: MappedComponents[AllComponentNames]) => pair(component as Entity, components.CountDown),

    // entity from instance
    fromInstance: (instance: Instance) => {
        const entity = instance.GetAttribute<Entity>(RunService.IsClient() ? "ClientId" : "ServerId")

        // if entity exists then return it
        return entity !== undefined && world.contains(entity) ? entity : undefined
    },
}

// for setting
export const setEntity = {
    // allows you to adjust all count downs
    countDown: (entityLink: Entity, component: MappedComponents[AllComponentNames], duration:number) => {
        for (const [countDownEntity, countDownInfo] of world.query(CountDown, pair(entityLink, component as Entity))) world.set(countDownEntity, CountDown, duration)
    },

    // adds a target for replication
    addTargetForReplication: (targetEntity: Entity, player: Player | Player[], component: typeof components.componentsToReplicate[keyof typeof components.componentsToReplicate]) => {
        const targetReplication = world.get(targetEntity, components.TargetReplication) || { [component]: [] }
        const oldTargets = targetReplication[component] || []

        // adds the targets to the table
        if (typeIs(player, "Instance")) {
            oldTargets.push(player)
        } else {
            player.forEach((player) => oldTargets.push(player))
        }

        // remove any duplicates
        oldTargets.filter((v, i, a) => a.indexOf(v) === i)

        // sets tje targets in thje target replication
        world.set(targetEntity, components.TargetReplication, { ...targetReplication, [component]: oldTargets })
    },
    
    // set align poistion entity velocity
    alignPositionVelocity: (alignPositionVelocity: Entity, velocity: number) => {
        const alignPositionComponent = world.get(alignPositionVelocity, AlignPosition)

        // sets it
        if (alignPositionComponent) world.set(alignPositionVelocity, AlignPosition, { ...alignPositionComponent, velocity })
    },
}

function getUntakenNumber(villagersData: VillagerData[]): number {
    let number = 0

    // loop through the villagers progress and find the first number that is not taken
    while (true) {
        if (!villagersData.find((v) => v.UniqueId === number)) {
            break;
        } else {
            number++;
        }
    }

    return number
}

export const createEntity = {
    // creates a villager
    villagerNpc: (playerEntity:Entity, villagerData:VillagerData, platform:PlatformExample) => {
        const player = world.get(playerEntity, components.Player)
        const name = villagerData.Name
        const villagerModel = paths.Assets.Villagers[name].Clone() as VillagerModel
        const villagerEntity = world.entity()
        const animateScript = villagerModel.Npc.FindFirstChild("Animate") as Script | undefined;

        // sets the vilalgers unique id
        if (animateScript) animateScript.Enabled = false
        villagerModel.SetAttribute("UniqueId", villagerData.UniqueId)
        villagerModel.PivotTo(platform.Floor.CFrame.mul(villagerData.RelativeLocation || new CFrame(0, 0, 0)))
        villagerModel.Parent = platform.Villagers

        // sets the villager
        addComponent(villagerEntity, components.ModelDebugger, villagerModel)
        addComponent(villagerEntity, components.Villager, {
            villagerModel,
            villagerData,
            playerEntity,
        })

        // if player then adds it to target for replication 
        if (player) setEntity.addTargetForReplication(villagerEntity, player, components.Villager)

        // returns it
        return villagerEntity
    },

    // to adds a villager tool to your inventory
    inventoryVillager: (bodyEntity: Entity, villagerName: VillagerNames) => {
        createEntity.updateData(bodyEntity, (oldData: PlayerData) => {
            // if the villager already exists then return
            oldData.Villagers.push({
                Name: villagerName,
                RelativeLocation: undefined, // villager is not placed yet
                UniqueId: getUntakenNumber(oldData.Villagers), // gets the unique id from the villagersProgressData
                Progress: deepCopy(villagersProgressData.get(villagerName)!),
            })

            // returns the updated data
            return oldData;
        })
    },

    // to adds a villager tool to your inventory randomly includes rarities
    insertProduce: (bodyEntity: Entity, produceName: ProduceNames, variant:ProduceVariant, amount:number = 1) => {
        createEntity.updateData(bodyEntity, (oldData: PlayerData) => {
            // goes through each amount and adds them up
            const produceIndex = oldData.Produce.findIndex((p) => p.Name === produceName && p.Variant === variant) // finds the produce by name and variant
        
            // sets the new amount
            if (produceIndex > -1) {
                oldData.Produce[produceIndex] = {
                    Name:  produceName,
                    Amount: (oldData.Produce[produceIndex]?.Amount || 0) + amount, // if it exists then increase the amount
                    Variant: variant
                }
            } else {
                // for the total amount
                oldData.Produce.push({
                    Name: produceName,
                    Amount: amount, // if it exists then increase the amount
                    Variant: variant
                })
            }

            // returns the updated data
            return oldData;
        })
    },

    // to update data
    updateData: (bodyEntity: Entity, updateFunction: (oldData: PlayerData) => PlayerData) => {
        const updateEntity = world.entity()

        // sets the update data
        world.set(updateEntity, components.UpdateData, { updateFunction, bodyEntity })

        // returns it
        return updateEntity
    },

    // creates a countDown entity given an entity link and a component
    countDown: (entityLink: Entity, component: MappedComponents[AllComponentNames], duration:number) => {
        const countDownEntity = checkEntity.hasCountDown(entityLink, component) || world.entity()
        const countDownRelationship = getEntity.countDownRelationship(component)

        // sets the countDown
        world.set(countDownEntity, pair(entityLink, component as Entity), true)
        world.set(countDownEntity, components.CountDown, duration)
        world.set(entityLink, getEntity.countDownRelationship(component), component)
        world.set(countDownEntity, components.DestroyAfterCounting, () => {
            if (!checkEntity.hasCountDown(entityLink, component)) world.remove(entityLink, countDownRelationship)
        })

        // returns it
        return countDownEntity
    },

    // creates replicated entity
    replicated: (serverEntity: Entity) => {
        const replicatedEntity = world.entity()

        // adds relationship
        world.add(replicatedEntity, serverEntity as Entity<undefined>)
        world.set(replicatedEntity, components.ReplicatedComponent, serverEntity)

        // returns it
        return replicatedEntity
    },

    // creates a ZeroOutVelocity entity
    zeroOutVelocity: (basePart: BasePart, duration: number = 1) => {
        const zeroOutVelocityEntity = world.entity()

        // adds relationship
        world.set(zeroOutVelocityEntity, ZeroOutVelocity, basePart)
        world.set(zeroOutVelocityEntity, CountDown, duration)
        world.set(zeroOutVelocityEntity, DestroyAfterCounting, true)

        // returns it
        return zeroOutVelocityEntity
    },

    // creates an aligment
    alignAttachments: (attachment0: Attachment, attachment1: Attachment, velocity: number) => {
        const alignPositionEntity = world.entity()
        const alignPosition = new Instance("AlignPosition", attachment0)

        // adds relationship
        world.set(alignPositionEntity, AlignPosition, {
            alignPosition,
            attachment0,
            attachment1,
            velocity,
        })

        // returns it
        return alignPositionEntity
    },

    // creates CombatFloat entity
    Float: (bodyEntity: Entity, rootpart: BasePart, duration: number) => {
        const floatEntity = world.entity()

        // spawns float
        world.set(floatEntity, Float, ({
            linearVelocity: new Instance("LinearVelocity"),
            bodyEntity,
            duration
        }));

        // returns it
        return floatEntity
    },

    // velocity in direction
    velocity: (attachment: Attachment, duration: number, direction: Vector3, decelerationRate?: number) => {
        const velocityEntity = world.entity()

        // spawns velocity
        world.set(velocityEntity, MoveTo, ({
            destroyEntityOnComplete: true,
            linearVelocity: new Instance("LinearVelocity", attachment),
            duration,
            attachment,
            direction,
            decelerationRate,
        }))

        // returns it
        return velocityEntity
    },

    // velocity in direction
    velocityToPart: (basePart: BasePart, data:{direction: Vector3, relative?:true, decelerationRate?: number, duration?: number, onDestroyedCallback?:Callback} & XOR<{axesForce?:Vector3}, {magnitudeForce?:number}>) => {
        const velocityEntity = world.entity()
        const attachment = new Instance("Attachment")

        // sets up attachment
        attachment.Name = "VelocityAttachment"
        attachment.Parent = basePart

        // spawns velocity
        world.set(velocityEntity, MoveTo, ({
            destroyEntityOnComplete: true,
            forceLimitMode: "axesForce" in data ? Enum.ForceLimitMode.PerAxis : Enum.ForceLimitMode.Magnitude,
            maxAxesForce: "axesForce" in data ? data.axesForce : Vector3.one.mul(1e6),
            maxForce: "magnitudeForce" in data ? data.magnitudeForce : 1e6,
            relativeTo: data.relative ? Enum.ActuatorRelativeTo.Attachment0 : Enum.ActuatorRelativeTo.World,
            linearVelocity: new Instance("LinearVelocity", attachment),
            duration: data.duration,
            direction: data.direction,
            decelerationRate: data.decelerationRate,
            attachment,
            onDestroyedCallback: () => {
                data.onDestroyedCallback?.()
                attachment.Destroy()
            },
        }))

        // returns it
        return velocityEntity
    },
}

/**
 * Retrieves the source file of the caller function by analyzing the stack trace.
 * @returns {string} The source file path of the caller function, or 'unknown' if not found.
 */
const getCallerSourceFromTraceback = () => {
	const traceback = debug.traceback()
	const lines = [] as string[]
	for (const line of traceback.gmatch("[^\n]+")) {lines.push(line[0] as string)}
	// The third line typically contains the caller information
	const callerLine = lines[2] || ""
	const [source] = callerLine.match("([^:]+):")
	return ((source && (RunService.IsRunning() ? source : string.match(source as string, '%[string%s+"(.-)"%]')[0])) as string) || "unknown"
}



// registered print debug
const jecsPrintRecord = new Map<string, (any[])[]>();
const jecsWarnRecord = new Map<string, (any[])[]>();
const debugRegistry = new Map<string, Entity>()
export const createDebugger = (initial: boolean = false, _systemName?:string) => {
    const scriptPath = getCallerSourceFromTraceback()
    const sourceScript = scriptPath && getInstanceByName(scriptPath)
    const systemName = _systemName || sourceScript && sourceScript.Name || "UnknownSystem";
    const debugEntity = debugRegistry.get(systemName)
    const debugInfo = debugEntity && world.get(debugEntity, components.Debug)
    const jecsPrintMaping = jecsPrintRecord.get(systemName) || new Array();
    const jecsWarnMaping = jecsWarnRecord.get(systemName) || new Array();

    // if the debug entity already exists, return the current state
    if (!debugRegistry.has(systemName)) {
        const debugEntity = world.entity()

        world.set(debugEntity, components.Debug, { name: systemName, debug: initial !== undefined ? initial : false })
        world.set(debugEntity, Name, systemName)
        debugRegistry.set(systemName, debugEntity)
    }

    // for warns++
    if (debugInfo?.debug === true && jecsWarnMaping.size() > 0) {

        // if jecsMaping is greater than 0 then print 
        warn(`Previous Jecs Warnings (${jecsWarnMaping.size()}) On ${systemName}:`);
        for (const [index, previousCall] of pairs(jecsWarnMaping)) {
            warn(...[...previousCall, ` (Previous Call #${index})`] as unknown[]);
        }

        // clears the record
        jecsWarnRecord.set(systemName, []);
    }
    
    // for prints
    if (debugInfo?.debug === true && jecsPrintMaping.size() > 0) {

        // if jecsMaping is greater than 0 then print 
        print(`Previous Jecs Calls (${jecsPrintMaping.size()}) On ${systemName}:`);
        for (const [index, previousCall] of pairs(jecsPrintMaping)) {
            print(...[...previousCall, ` (Previous Call #${index})`] as unknown[]);
        }

        // clears the record
        jecsPrintRecord.set(systemName, []);
    }

    // returns the current state of the print debug for the system
    return debugInfo?.debug || false
}

// for warnings
export const warnJecs = (line:number, ...message:unknown[]) => {
    const fullName = [...message] as string[]
    const scriptPath = getCallerSourceFromTraceback()
    const sourceScript = scriptPath && getInstanceByName(scriptPath)
    const debugEnabled = sourceScript && createDebugger()
    const systemName = sourceScript && sourceScript.Name || "UnknownSystem";
    const firstMessage = sourceScript && `   -   TypeScript(Jecs) ${systemName}:${line}`
    const jecsWarnMaping = jecsWarnRecord.get(systemName)|| new Array();

    // if debug is disabled then return
    if (!sourceScript) {
        warn(`Script not found for line ${line}: ${scriptPath}`);
        return
    } else if (debugEnabled === false) {

        // sets it
        jecsWarnMaping.unshift([...message, firstMessage])
        if (jecsWarnMaping.size() > 200) {
            for (let i = 199; i < jecsWarnMaping.size()-1; i++) {
                jecsWarnMaping.pop()
            }
        }
        jecsWarnRecord.set(systemName, jecsWarnMaping);
        return
    }

    // prints the message
    fullName.push(firstMessage as never);
    warn(...fullName);
}

// for printing
export const printJecs = (line:number, ...message:unknown[]) => {
    const fullName = [...message] as string[]
    const scriptPath = getCallerSourceFromTraceback()
    const sourceScript = scriptPath && getInstanceByName(scriptPath)
    const debugEnabled = sourceScript && createDebugger()
    const systemName = sourceScript && sourceScript.Name || "UnknownSystem";
    const firstMessage = sourceScript && `   -   TypeScript(Jecs) ${systemName}:${line}`
    const jecsMaping = jecsPrintRecord.get(systemName)|| new Array();

    // if debug is disabled then return
    if (!sourceScript) {
        warn(`Script not found for line ${line}: ${scriptPath}`);
        return
    } else if (debugEnabled === false) {

        // sets it
        jecsMaping.unshift([...message, firstMessage])
        if (jecsMaping.size() > 200) {
            for (let i = 199; i < jecsMaping.size()-1; i++) {
                jecsMaping.pop()
            }
        }
        jecsPrintRecord.set(systemName, jecsMaping);
        return
    }

    // prints the message
    fullName.push(firstMessage as never);
    print(...fullName);
}


// prints the message
export const printTS = (line:number, ...message:unknown[]) => {
    const fullName = [...message] as never[]
    const scriptPath = getCallerSourceFromTraceback()
    const sourceScript = scriptPath && getInstanceByName(scriptPath)

    // if debug is disabled then return
    if (!sourceScript) {
        warn(`Script not found for line ${line}: ${scriptPath}`);
        return
    }

    // prints the message
    fullName.push( `   -   TypeScript(File) ${sourceScript.Name}:${line}` as never);
    print(...fullName);
}

// prints the message
export const warnTS = (line:number, ...message:unknown[]) => {
    const fullName = [...message] as never[]
    const scriptPath = getCallerSourceFromTraceback()
    const sourceScript = scriptPath && getInstanceByName(scriptPath)
    
    // if debug is disabled then return
    if (!sourceScript) {
        warn(`Script not found for line ${line}: ${scriptPath}`);
        return
    }

    // prints the message
    fullName.push( `   -   TypeScript(File) ${sourceScript.Name}:${line}` as never);
    warn(...fullName);
}


// Fetch local player context
export interface LocalPlayerContext {
	character: Model;
    humanoid: Humanoid;
	rootPart: BasePart;
	attachment: Attachment;
	entity: Entity;
    animator : Animator
}

export function getLocalPlayerContext(player: Player): LocalPlayerContext | undefined {
    const character = player;
    if (!character) return;
    const entity = getEntity.fromInstance(Players.LocalPlayer);
    if (!entity) return;
    const body = world.get(entity, components.Body);
    if (!body) return;

    const {model, rootPart, humanoid, rootAttachment, animator } = body
    if (!humanoid || !rootPart || !rootAttachment || !animator) return;

    return { 
        character: model,
        humanoid,
        rootPart,
        attachment: rootAttachment,
        entity,
        animator,
    };

};

// default props
export const jecsDefaultProps = {
    
} satisfies { [componentName in AllComponentNames]?: ComponentValue<MappedComponents[componentName]> };
type DefaultProps = typeof jecsDefaultProps
type DefaultPropKeys = keyof DefaultProps;
// type Switched = ReturnType<<componentName extends AllComponentNames>()=>({[k in MappedComponents[componentName]]:componentName})>;



// 1) Two-arg only for defaulted components
export function addComponent<P extends undefined>(
    entity: Entity,
    component: Entity<P>,
): void;

export function addComponent<P, O>(
    entity: Entity,
    component: Pair<P, O>,
    value: P
): void;

export function addComponent<N extends DefaultPropKeys, D extends MappedComponents[N]>(
    entity: Entity,
    component: D
  ): void
  
  // 2) Three-arg only for non-defaulted components
  export function addComponent<N extends Exclude<AllComponentNames, DefaultPropKeys>, D extends MappedComponents[N]>(
    entity: Entity,
    component: D,
    value: ComponentValue<D>
  ): void
  
  // 3) Three-arg override for defaulted components
  export function addComponent<N extends DefaultPropKeys, D extends Entity>(
    entity: Entity,
    component: D,
    value: ComponentValue<D>
  ): void
  
  // implementation
  export function addComponent<N extends AllComponentNames, D extends MappedComponents[N]>(
    entity: Entity,
    component: D,
    value?: ComponentValue<D>
  ): void {
    // Determine the component data to use
    const defaultTable = jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropKeys] as ComponentValue<MappedComponents[N]> | undefined;
    const clonedTable = typeIs(defaultTable, "table") && deepCopy(defaultTable);
    const componentInfo = (value !== undefined ? value : (clonedTable || (jecsDefaultProps[MappedComponentsSwitched[component] as DefaultPropKeys]))) as ComponentValue<MappedComponents[N]>;

    // Add the component to the entity
    world.set(entity, component, componentInfo as never);
}


// removes component
export function removeComponent<N extends AllComponentNames, C extends (MappedComponents[N] | Pair)>(
    entity: Entity,
    ...components: C[]
): void {
    [...components].forEach((component) => world.remove(entity, component))
}


// Player state helper functions
export function setPlayerState<T>(
    world: World,
    entity: Entity,
    category: keyof PlayerState,
    key: string,
    active: boolean
) {
    const state = world.get(entity, PlayerStateComponent);
    if (!state) return;

    if (typeIs(state[category], "table")) {
        const cat = state[category] as Record<string, { active: boolean; lastUpdated: number}> | undefined;
        if (cat && cat[key]) {
            cat[key].active = active;
            cat[key].lastUpdated = os.clock();
            world.set(entity, PlayerStateComponent, state);
        }
    } else {
        warn(`Category '${category}' does not exist on PlayerState.`);
    }
}

export function getPlayerState<T>(
    world: World,
    entity: Entity,
    category: keyof PlayerState,
    key: string
): boolean | undefined {
    const state = world.get(entity, PlayerStateComponent);
    if (!state) {
        print("No state, no bitches");
        return undefined
    };

    if (typeIs(state[category], "table"))  {
        const cat = state[category] as Record<string, { active: boolean; lastUpdated: number}> | undefined;
        if (!cat) {
            print("No category, no bitches");
            return undefined
        };
        if (cat[key]) {
            return cat[key].active;
        }
    } else {
        warn(`Category '${category}' does not exist on PlayerState.`);
        return undefined;
    }
}

export function getMostRecentActiveState(
    world: World,
    entity: Entity,
    category: keyof PlayerState
): string | undefined {
    const state = world.get(entity, PlayerStateComponent);
    if (!state) return undefined;

    const cat = state[category] as Record<string, { active: boolean; lastUpdated: number }> | undefined;
    if (!cat) return undefined;

    let mostRecentKey: string | undefined;
    let mostRecentTime = -math.huge;

    for (const [key, data] of pairs(cat)) {
        if (data.active && data.lastUpdated > mostRecentTime) {
            mostRecentKey = key;
            mostRecentTime = data.lastUpdated;
        }
    }
    return mostRecentKey;    
}