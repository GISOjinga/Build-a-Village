import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import Squash, { SerDes, OptionalSerDes, AnySerDesType, NonVariadicSerDesType, InferValueType, Unpack, Cursor, Input } from "@rbxts/squash";
import { getUniqueIdPathFromInstance, getInstanceByUniqueIdPath } from "shared/utils/functions/instanceFunctions";
import { componentsToReplicate } from "shared/utils/jecs/jecsComponents";
import { AllComponentNames, ComponentValue, MappedComponents, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { PlayerState } from "shared/utils/PlayerState";
import robuxStoreData from "./robuxStoreData";
import { Entity } from "@rbxts/jecs";
import pageStates from "shared/utils/Animations/pageStates";
import { $line } from "rbxts-transformer-inline";

// Core remote setup
const jingaRemote = ReplicatedStorage.FindFirstChild<RemoteEvent>("JingaRemotes") ||
    ((RunService.IsClient() && RunService.IsRunning())
        ? ReplicatedStorage.WaitForChild<RemoteEvent>("JingaRemotes")
        : (() => {
            const inst = new Instance("RemoteEvent");
            inst.Name = "JingaRemotes";
            inst.Parent = ReplicatedStorage;
            return inst;
        })());


// Wrap T by applying SerDes to primitives and recursing into objects/arrays/maps
type WrapJNetType<T> =
    T extends (...args: any[]) => any ? T :
    T extends Array<infer U> ? WrapJNetType<U>[] :
    T extends Map<infer K, infer V> ? Map<K, WrapJNetType<V>> :
    T extends object ? { [K in keyof T]: WrapJNetType<T[K]> } :
    SerDes<T>;

// Recover the original type from its wrapped form
type UnwrapJNetType<T> =
    T extends SerDes<infer U> ? U :
    T extends Array<infer U> ? UnwrapJNetType<U>[] :
    T extends Map<infer K, infer V> ? Map<K, UnwrapJNetType<V>> :
    T extends object ? { [K in keyof T]: UnwrapJNetType<T[K]> } :
    T;


// === Primitive Types === //
const optional = <V extends AnySerDesType>(schema: V) => ({ ___JingaNetOptional: true, value: schema }) as never as WrapJNetType<V | undefined>;
type Optional<T> = { ___JingaNetOptional: true, value: WrapJNetType<T | undefined> };
export const int8 = Squash.int(1) as WrapJNetType<number>;
export const int16 = Squash.int(2) as WrapJNetType<number>;
export const int32 = Squash.int(4) as WrapJNetType<number>;
export const uint8 = Squash.uint(1) as WrapJNetType<number>;
export const uint16 = Squash.uint(2) as WrapJNetType<number>;
export const uint32 = Squash.uint(4) as WrapJNetType<number>;
export const float32 = Squash.number(4) as WrapJNetType<number>;
export const float64 = Squash.number(8) as WrapJNetType<number>;
export const str = Squash.string() as WrapJNetType<string>;
export const bool = Squash.boolean() as unknown as WrapJNetType<boolean>;
export const cframe = Squash.CFrame(Squash.number(8)) as unknown as WrapJNetType<CFrame>;
export const vec3 = Squash.Vector3(Squash.number(8)) as unknown as WrapJNetType<Vector3>;
export const vec2 = Squash.Vector2(Squash.number(8)) as unknown as WrapJNetType<Vector2>;
export const nothing = {
    ser(this: void): void { },
    des(this: void): void { },
} as unknown as WrapJNetType<undefined>;
export const unknown = {
    ser(this: void, idk: unknown) { return idk },
    des(this: void, idk: unknown) { return idk },
} as unknown as WrapJNetType<unknown>;
export const entity = unknown as unknown as WrapJNetType<Entity>;
export const instance = unknown as unknown as WrapJNetType<Instances[keyof Instances]>;
export const compInst = {
    __ByteNetInstancePath: [str],
} as unknown as WrapJNetType<Instances[keyof Instances]>;



export type ClientRoute<T extends Network<any>> = Pick<T, "send" | "listen" | "wait">;
export type ServerRoute<T extends Network<any>> = Pick<T, "listen" | "sendTo" | "sendToAll" | "sendToAllExcept" | "sendToList" | "wait">;

// === Remote Type Wrapper (fixed) === //
export class Network<J extends WrapJNetType<any>> {
    constructor(
        private readonly name: string,
        private readonly schema: J,
        private readonly reliabilityType: "reliable" | "unreliable" = "reliable",
    ) { }


    public listen(callback: (data: UnwrapJNetType<J>, player: Player) => void) {
        if (RunService.IsClient()) {
            // Client side, listen to the server event
            return jingaRemote.OnClientEvent.Connect((name: unknown, returnedBuffer: unknown) => {
                if (name !== this.name) return;
                let realData = returnedBuffer ? this.deepDeserialize(returnedBuffer as buffer) : returnedBuffer;

                // calls the call back
                callback(realData as never, Players.LocalPlayer as Player);
            });
        } else {
            return jingaRemote.OnServerEvent.Connect((player, name: unknown, returnedBuffer: unknown) => {
                if (name !== this.name) return;
                let realData = returnedBuffer ? this.deepDeserialize(returnedBuffer as buffer) : returnedBuffer;

                // calls the call back
                callback(realData as never, player);
            });
        }
    }


    /**
 * Recursively serialize `data` according to `this.packet` schema.
 * Handles primitives, tables, arrays, and optional values.
 */
    private deepSerialize(fullData: UnwrapJNetType<J>) {
        const grandSchema = this.schema as SerDes<unknown> | undefined;

        function isPlainArraySchema(schema: unknown): schema is Array<unknown> {
            return typeIs(schema, "table") && (schema as Array<unknown>).size() > 0;
        }

        function isOptionalSchema(schema: unknown): schema is Optional<unknown> {
            return typeIs(schema, "table") && (schema as Optional<unknown>).___JingaNetOptional === true;
        }

        function serialize(schema: unknown, data: unknown): buffer | unknown {
            if (schema === nothing || schema === unknown || schema === undefined) {
                return data;
            }

            if (isOptionalSchema(schema)) {
                if (data === undefined) return undefined;
                return serialize(schema.value, data);
            }

            if (typeIs(schema, "table") && (schema as Record<string, unknown>).__ByteNetInstancePath !== undefined) {
                return data;
            }

            if (isPlainArraySchema(schema)) {
                const elementSchema = (schema as Array<unknown>)[0] as SerDes<unknown>;
                if (!typeIs(data, "table")) return [];

                const result = [] as Array<never>;
                for (const [_, element] of ipairs(data as Array<unknown>)) result.push(serialize(elementSchema, element) as never);
                return result;
            }

            if (typeIs(schema, "table") && typeIs(data, "table")) {
                const serialized = {} as Record<string, unknown>;
                for (const [key, value] of pairs(data)) {
                    const childSchema = (schema as Record<string, unknown>)[key as string] as unknown;
                    serialized[key as string] = serialize(childSchema, value);
                }
                return serialized;
            }

            if (data !== undefined && typeIs(schema, "table")) {
                const cursor = Squash.cursor();
                (schema as SerDes<unknown>).ser(cursor, data);
                return Squash.tobuffer(cursor);
            }
        }

        return serialize(grandSchema, fullData);
    }

    /**
 * Reconstruct data from a serialized structure (buffers or nested objects).
 * Traverses the schema and applies deserialization per field.
 */
    /**
 * Reconstruct data from a serialized structure (buffers or nested objects).
 * Traverses the schema and applies deserialization per field.
 */
    private deepDeserialize(serialized: unknown): UnwrapJNetType<J> {
        const schema = this.schema as unknown;

        function isPlainArraySchema(schema: unknown): schema is Array<unknown> {
            return typeIs(schema, "table") && (schema as Array<unknown>).size() > 0;
        }

        function isOptionalSchema(schema: unknown): schema is Optional<unknown> {
            return typeIs(schema, "table") && (schema as Optional<unknown>).___JingaNetOptional === true;
        }

        function deserialize(schema: unknown, data: unknown): unknown {
            if (schema === nothing || schema === unknown || schema === undefined) return data;

            // Handle Optional
            if (isOptionalSchema(schema)) {
                if (data === undefined) return undefined;
                return deserialize(schema.value, data);
            }

            // Handle Instance schema passthrough
            if (typeIs(schema, "table") && (schema as Record<string, unknown>).__ByteNetInstancePath !== undefined) {
                return data;
            }

            // Handle Array schema
            if (isPlainArraySchema(schema)) {
                const elementSchema = (schema as Array<unknown>)[0];
                if (!typeIs(data, "table")) return [];

                return (data as Array<never>).map((item) => deserialize(elementSchema, item));
            }

            // Handle buffer using SerDes
            if (typeIs(schema, "table") && typeIs((schema as SerDes<unknown>).des, "function")) {
                if (typeIs(data, "userdata") || typeIs(data, "buffer")) {
                    const cursor = Squash.frombuffer(data as buffer);
                    return (schema as SerDes<unknown>).des(cursor);
                }
            }

            // Handle object traversal
            if (typeIs(schema, "table") && typeIs(data, "table")) {
                const result: Record<string, unknown> = {};
                for (const [key, childSchema] of pairs(schema as Record<string, unknown>)) {
                    result[key] = deserialize(childSchema, (data as Record<string, unknown>)[key]);
                }
                return result;
            }

            return undefined;
        }

        return deserialize(schema, serialized) as UnwrapJNetType<J>;
    }



    public sendToAll(data: UnwrapJNetType<J>) {
        jingaRemote.FireAllClients(this.name, this.deepSerialize(data));
    }

    public sendToAllExcept(data: UnwrapJNetType<J>, exception: Player) {
        Players.GetPlayers().forEach((player) => {
            if (player !== exception) jingaRemote.FireClient(player, this.name, this.deepSerialize(data));
        })
    }

    public sendTo(data: UnwrapJNetType<J>, player: Player) {
        jingaRemote.FireClient(player, this.name, this.deepSerialize(data));
    }

    public sendToList(data: UnwrapJNetType<J>, players: Player[]) {
        // print(this.name, "GOT THE DATA", data, Squash.tobuffer(this.cursor), Squash.frombuffer(Squash.tobuffer(this.cursor)), this.packet.des)
        players.forEach((player) => jingaRemote.FireClient(player, this.name, this.deepSerialize(data)));
    }

    public wait(): UnwrapJNetType<J> {
        do {
            const [name, returnedBuffer] = jingaRemote.OnClientEvent.Wait() as unknown as [string, buffer];

            // If the name matches, we can safely deserialize
            if (name === this.name) return returnedBuffer ? this.deepDeserialize(returnedBuffer as buffer) : returnedBuffer
        } while (true)
    }

    public send(data: UnwrapJNetType<J> = undefined as UnwrapJNetType<J>) {
        jingaRemote.FireServer(this.name, this.deepSerialize(data));
    }
}




export const sharedRoutes = (() => {
    const componentRecord = <T>(data: T) => ({
        serverEntity: entity as WrapJNetType<Entity>,
        data: optional(data as never) as unknown as Optional<T>,
    })

    const villagerStruct = {
        Name: str as WrapJNetType<VillagerNames>,
        UniqueId: uint16 as WrapJNetType<number>,
        RelativeLocation: unknown as unknown as WrapJNetType<CFrame | undefined>,
        Progress: {
            Produce: str as WrapJNetType<ProduceNames>,
            Required: optional({
                Produce: str as WrapJNetType<ProduceNames>,
                Amount: uint8 as WrapJNetType<number>,
                Max: uint8 as WrapJNetType<number>,
            } as never) as never,
            Progression: {
                Time: {
                    RequiredTimePerResource: uint16,
                    StartTime: uint32 as WrapJNetType<number>,
                },
                Resources: [str as WrapJNetType<ProduceVariant>] as unknown as WrapJNetType<ProduceVariant[]>,
            },
            Building: {
                StartTime: uint32 as WrapJNetType<number>,
                TotalTime: uint16 as WrapJNetType<number>,
            },
        },
    } as WrapJNetType<VillagerData>


    const componentRoutes = {
        Body: componentRecord({
            model: compInst as never as WrapJNetType<Model>,
            head: compInst as never as WrapJNetType<BasePart>,
            humanoid: compInst as never as WrapJNetType<Humanoid>,
            rootPart: compInst as never as WrapJNetType<BasePart>,
            animator: compInst as never as WrapJNetType<Animator>,
            rootAttachment: compInst as never as WrapJNetType<Attachment>,
            platform: optional(compInst as never) as WrapJNetType<BasePart | undefined>,
        }) as never,

        // villager
        Villager: componentRecord({
            villagerModel: compInst as WrapJNetType<VillagerModel>,
            playerEntity: entity,
            villagerData: villagerStruct as WrapJNetType<VillagerData>,
        }),

        // data
        Data: componentRecord({
            Version: str as WrapJNetType<string>,
            Coins: uint32,
            LastLogin: uint32 as WrapJNetType<number>,
            Sessions: uint32 as WrapJNetType<number>,
            DailyStreak: uint32 as WrapJNetType<number>,
            LastDailyReward: uint32 as WrapJNetType<number>,
            DailyQuests: [{ id: uint16, progress: uint16, target: uint16, assigned: uint32 }] as unknown as WrapJNetType<Array<{ id: number; progress: number; target: number; assigned: number }>>,
            QuestHistory: [uint16] as WrapJNetType<number[]>,
            Villagers: [villagerStruct] as WrapJNetType<VillagerData>[],
            Produce: [{
                Name: str as WrapJNetType<ProduceNames>,
                Amount: unknown as WrapJNetType<number>,
                Variant: str as WrapJNetType<ProduceVariant>,
            }] as unknown as WrapJNetType<ProduceData[]>,
            Tutorial: unknown as WrapJNetType<"Done" | number>,
            Walls: [{
                Name: str as WrapJNetType<WallNames>,
                Description: str,
                Image: str,
                Price: unknown as WrapJNetType<number>,
                GamePassId: unknown as WrapJNetType<number>,
                CashMultiplier: unknown as WrapJNetType<number>,
                Rarity: str as WrapJNetType<WallRarity>,
                Owned: bool,
                Equipped: bool,
            }] as unknown as WrapJNetType<WallInfo[]>,
            PromoCodesRedeemed: [str],
            ClaimedFreeRewardChest: bool,
        }),

        // model debugger
        ModelDebugger: componentRecord(compInst as WrapJNetType<Model | BasePart>),

        // confirmation prompt
        ConfirmationPrompt: componentRecord({
            title: str,
            message: str,
            confirmation: optional(bool) as unknown as WrapJNetType<boolean | undefined>,
            onConfirm: unknown as unknown as WrapJNetType<() => void>,
            onDecline: undefined,
        }),
    } satisfies {
        [k in keyof typeof componentsToReplicate]: {
            serverEntity: WrapJNetType<Entity>;
            data: Optional<WrapJNetType<ComponentValue<MappedComponents[k]>>>
        };
    };

    // real routes
    const realRoutes = {
        jecsSetup: nothing as WrapJNetType<undefined>,

        buyVillager: {
            villagerIndex: int16,
            currency: str,
        } as WrapJNetType<{ villagerIndex: number; currency: "Coins" | "Robux" }>,

        placeVillager: unknown as unknown as WrapJNetType<CFrame>,

        digVillager: entity,

        supplyVillager: entity,

        collectVillagerProduce: {
            villagerEntity: entity,
            resourceModelName: str,
        } as WrapJNetType<{ villagerEntity: Entity; resourceModelName: ProduceNames }>,

        teleportToVillage: nothing as WrapJNetType<undefined>,

        teleportToShop: str as WrapJNetType<"Buy" | "Sell" | "Wall">,

        updateRestockTime: uint32,

        updateVillagersShop: unknown as unknown as WrapJNetType<Array<VillagerInfo>>,

        redeemPromo: str as WrapJNetType<string>,

        promoResult: {
            success: bool,
            message: str,
        } as WrapJNetType<{ success: boolean; message: string }>,

        confirmSellOptions: str as WrapJNetType<"Option1" | "Option2" | "Option3" | "Option4">,

        toggleSellMenuOpen: bool,

        confirmPrompt: bool,

        updateFriendsBonus: bool as WrapJNetType<boolean>,

        updateDailyQuest: unknown as unknown as WrapJNetType<Array<DailyQuestInfo>>,

        sendFriendRequest: instance as WrapJNetType<Player>,

        notify: {
            text: str,
            duration: uint8,
        } as WrapJNetType<{ text: string; duration: number }>,

        npcDialogue: {
            target: str,
            text: str,
        } as WrapJNetType<{ target: "Buy" | "Sell" | "Wall" | "SketchyGuy" | "None"; text: string }>,

        buyWall: {
            wallName: str,
            currency: str,
        } as WrapJNetType<{ wallName: string; currency: "Coins" | "Robux" }>,

        equipWall: {
            wallName: str,
            equip: bool,
        } as WrapJNetType<{ wallName: string; equip: boolean }>,

        equipTool: instance as WrapJNetType<Tool>,

        togglePage: str as WrapJNetType<ReturnType<typeof pageStates.openPage>>,

        giftToPlayer: {
            playerToGift: instance,
            produceTool: instance,
        } as WrapJNetType<{ playerToGift: Player; produceTool: Tool }>,

        playSound: {
            sound: instance as WrapJNetType<Sound>,
            position: optional(vec3 as never) as WrapJNetType<Vector3 | undefined>,
            pitch: optional(float32) as WrapJNetType<number | undefined>,
        } as WrapJNetType<{ sound: Sound; position?: WrapJNetType<Vector3 | undefined>; pitch?: number }>,

        // to play a particle at a speific position
        playParticle: {
            particle: instance,
            location: unknown,
            forceAmount: optional(uint8),
        } as WrapJNetType<{ particle: BasePart | Attachment | ParticleEmitter; location?: Vector3 | CFrame | undefined, forceAmount?: number | undefined }>,

        shopGiftTo: instance as WrapJNetType<Player>,

        updateRobuxStore: unknown as unknown as WrapJNetType<typeof robuxStoreData>,

        buyRobuxPack: {
            purchase: str,
        } as WrapJNetType<{ purchase: keyof typeof robuxStoreData }>,

        startSketchyRoll: {
            item: str,
            type: str,
        } as WrapJNetType<{ item: string; type: string }>,

        claimDailyReward: nothing as WrapJNetType<undefined>,
        finishSketchyRoll: nothing as WrapJNetType<undefined>,

        getReplicatedComponents: nothing as WrapJNetType<undefined>,

        deleteReplicatedEntity: entity as unknown as Entity,
    }


    // transforms the routes into a network component
    const routes = {} as { [K in keyof typeof realRoutes]: Network<typeof realRoutes[K]> } & { [K in keyof typeof componentRoutes]: Network<typeof componentRoutes[K]> };

    for (const [name, packet] of pairs(realRoutes)) routes[name] = new Network(name as string, packet as WrapJNetType<any>, "reliable") as any;
    for (const [name, packet] of pairs(componentRoutes)) routes[name] = new Network(name as string, packet as WrapJNetType<any>, "reliable") as any;

    return routes;
})()

