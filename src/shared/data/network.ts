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


type JingaNetType<T> =
    T extends (...args: any[]) => any ? T :
    T extends Array<infer U> ? JingaNetType<U>[] :
    T extends Record<string, unknown> ? { [K in keyof T]: JingaNetType<T[K]> } :
    T extends CFrame ? SerDes<CFrame> :
    T extends Vector3 ? SerDes<Vector3> :
    T extends Vector2 ? SerDes<Vector2> :
    T extends string ? SerDes<string> :
    T extends number ? SerDes<number> :
    T extends boolean ? SerDes<boolean> :
    T extends Instance ? SerDes<Instance> : // loose fallback
    T;


// === Primitive Types === //
const optional = <V extends AnySerDesType>(schema: V) => ({ ___JingaNetOptional: true, value: schema }) as never as JingaNetType<V | undefined>;
type Optional<T> = { ___JingaNetOptional: true, value: JingaNetType<T | undefined> };
export const int8 = Squash.int(1) as JingaNetType<number>;
export const int16 = Squash.int(2) as JingaNetType<number>;
export const int32 = Squash.int(4) as JingaNetType<number>;
export const uint8 = Squash.uint(1) as JingaNetType<number>;
export const uint16 = Squash.uint(2) as JingaNetType<number>;
export const uint32 = Squash.uint(4) as JingaNetType<number>;
export const float32 = Squash.number(4) as JingaNetType<number>;
export const float64 = Squash.number(8) as JingaNetType<number>;
export const str = Squash.string() as JingaNetType<string>;
export const bool = Squash.boolean() as unknown as JingaNetType<boolean>;
export const cframe = Squash.CFrame(Squash.number(8)) as unknown as JingaNetType<CFrame>;
export const vec3 = Squash.Vector3(Squash.number(8)) as unknown as JingaNetType<Vector3>;
export const vec2 = Squash.Vector2(Squash.number(8)) as unknown as JingaNetType<Vector2>;
export const nothing = {
    ser(this: void): void { },
    des(this: void): void { },
} as unknown as JingaNetType<undefined>;
export const unknown = {
    ser(this: void, idk: unknown) { return idk },
    des(this: void, idk: unknown) { return idk },
} as unknown as JingaNetType<unknown>;
export const entity = unknown as unknown as JingaNetType<Entity>;
export const instance = unknown as JingaNetType<Instances[keyof Instances]>;
export const compInst = {
    __ByteNetInstancePath: [str],
} as unknown as JingaNetType<Instances[keyof Instances]>;



export type ClientRoute<T extends Network<any>> = Pick<T, "send" | "listen" | "wait">;
export type ServerRoute<T extends Network<any>> = Pick<T, "listen" | "sendTo" | "sendToAll" | "sendToAllExcept" | "sendToList" | "wait">;
type UnwrapJingaNetType<T> =
    T extends SerDes<infer U> ? U :
    T extends OptionalSerDes<infer U> ? UnwrapJingaNetType<U> | undefined :
    T extends Array<infer U> ? Array<UnwrapJingaNetType<U>> :
    T extends Record<string, unknown> ? { [K in keyof T]: UnwrapJingaNetType<T[K]> } :
    T;

// === Remote Type Wrapper (fixed) === //
export class Network<J extends JingaNetType<any>> {
    constructor(
        private readonly name: string,
        private readonly schema: J,
        private readonly reliabilityType: "reliable" | "unreliable" = "reliable",
    ) { }


    public listen(callback: (data: UnwrapJingaNetType<J>, player: Player) => void) {
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
    private deepSerialize(fullData: UnwrapJingaNetType<J>) {
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
    private deepDeserialize(serialized: unknown): UnwrapJingaNetType<J> {
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

        return deserialize(schema, serialized) as UnwrapJingaNetType<J>;
    }



    public sendToAll(data: UnwrapJingaNetType<J>) {
        jingaRemote.FireAllClients(this.name, this.deepSerialize(data));
    }

    public sendToAllExcept(data: UnwrapJingaNetType<J>, exception: Player) {
        Players.GetPlayers().forEach((player) => {
            if (player !== exception) jingaRemote.FireClient(player, this.name, this.deepSerialize(data));
        })
    }

    public sendTo(data: UnwrapJingaNetType<J>, player: Player) {
        jingaRemote.FireClient(player, this.name, this.deepSerialize(data));
    }

    public sendToList(data: UnwrapJingaNetType<J>, players: Player[]) {
        // print(this.name, "GOT THE DATA", data, Squash.tobuffer(this.cursor), Squash.frombuffer(Squash.tobuffer(this.cursor)), this.packet.des)
        players.forEach((player) => jingaRemote.FireClient(player, this.name, this.deepSerialize(data)));
    }

    public wait(): UnwrapJingaNetType<J> {
        do {
            const [name, returnedBuffer] = jingaRemote.OnClientEvent.Wait() as unknown as [string, buffer];

            // If the name matches, we can safely deserialize
            if (name === this.name) return returnedBuffer ? this.deepDeserialize(returnedBuffer as buffer) : returnedBuffer
        } while (true)
    }

    public send(data: UnwrapJingaNetType<J> = undefined as UnwrapJingaNetType<J>) {
        jingaRemote.FireServer(this.name, this.deepSerialize(data));
    }
}




export const sharedRoutes = (() => {
    const componentRecord = <T>(data: T) => ({
        serverEntity: entity as JingaNetType<Entity>,
        data: optional(data as never) as unknown as Optional<T>,
    })

    const villagerStruct = {
        Name: str as JingaNetType<VillagerNames>,
        UniqueId: uint16 as JingaNetType<number>,
        RelativeLocation: unknown as unknown as JingaNetType<CFrame | undefined>,
        Progress: {
            Produce: str as JingaNetType<ProduceNames>,
            Required: optional({
                Produce: str as JingaNetType<ProduceNames>,
                Amount: uint8 as JingaNetType<number>,
                Max: uint8 as JingaNetType<number>,
            } as never) as never,
            Progression: {
                Time: {
                    RequiredTimePerResource: uint16,
                    StartTime: uint32 as JingaNetType<number>,
                },
                Resources: [str as JingaNetType<ProduceVariant>] as unknown as JingaNetType<ProduceVariant[]>,
            },
            Building: {
                StartTime: uint32 as JingaNetType<number>,
                TotalTime: uint16 as JingaNetType<number>,
            },
        },
    } as JingaNetType<VillagerData>


    const componentRoutes = {
        Body: componentRecord({
            model: compInst as JingaNetType<Model>,
            head: compInst as JingaNetType<BasePart>,
            humanoid: compInst as JingaNetType<Humanoid>,
            rootPart: compInst as JingaNetType<BasePart>,
            animator: compInst as JingaNetType<Animator>,
            rootAttachment: compInst as JingaNetType<Attachment>,
            platform: optional(compInst as JingaNetType<BasePart>),
        }),

        // villager
        Villager: componentRecord({
            villagerModel: compInst as JingaNetType<VillagerModel>,
            playerEntity: entity,
            villagerData: villagerStruct as JingaNetType<VillagerData>,
        }),

        // data
        Data: componentRecord({
            Version: str as JingaNetType<string>,
            Coins: uint32,
            LastLogin: uint32 as JingaNetType<number>,
            Sessions: uint32 as JingaNetType<number>,
            DailyStreak: uint32 as JingaNetType<number>,
            LastDailyReward: uint32 as JingaNetType<number>,
            DailyQuests: [{ id: uint16, progress: uint16, target: uint16, assigned: uint32 }] as unknown as JingaNetType<Array<{ id: number; progress: number; target: number; assigned: number }>>,
            QuestHistory: [uint16] as JingaNetType<number[]>,
            Villagers: [villagerStruct] as JingaNetType<VillagerData>[],
            Produce: [{
                Name: str as JingaNetType<ProduceNames>,
                Amount: unknown as JingaNetType<number>,
                Variant: str as JingaNetType<ProduceVariant>,
            }] as unknown as JingaNetType<ProduceData[]>,
            Tutorial: unknown as JingaNetType<"Done" | number>,
            Walls: [{
                Name: str as JingaNetType<WallNames>,
                Description: str,
                Image: str,
                Price: unknown as JingaNetType<number>,
                GamePassId: unknown as JingaNetType<number>,
                CashMultiplier: unknown as JingaNetType<number>,
                Rarity: str as JingaNetType<WallRarity>,
                Owned: bool,
                Equipped: bool,
            }] as unknown as JingaNetType<WallInfo[]>,
            PromoCodesRedeemed: [str],
            ClaimedFreeRewardChest: bool,
        }),

        // model debugger
        ModelDebugger: componentRecord(compInst as JingaNetType<Model | BasePart>),

        // confirmation prompt
        ConfirmationPrompt: componentRecord({
            title: str,
            message: str,
            confirmation: optional(bool) as unknown as JingaNetType<boolean | undefined>,
            onConfirm: unknown as JingaNetType<() => void>,
            onDecline: undefined,
        }),
    } satisfies {
        [k in keyof typeof componentsToReplicate]: {
            serverEntity: JingaNetType<Entity>;
            data: Optional<JingaNetType<ComponentValue<MappedComponents[k]>>>
        };
    };

    // real routes
    const realRoutes = {
        jecsSetup: nothing as JingaNetType<undefined>,

        buyVillager: {
            villagerIndex: int16,
            currency: str,
        } as JingaNetType<{ villagerIndex: number; currency: "Coins" | "Robux" }>,

        placeVillager: unknown as JingaNetType<CFrame>,

        digVillager: entity,

        supplyVillager: entity,

        collectVillagerProduce: {
            villagerEntity: entity,
            resourceModelName: str,
        } as JingaNetType<{ villagerEntity: Entity; resourceModelName: ProduceNames }>,

        teleportToVillage: nothing as JingaNetType<undefined>,

        teleportToShop: str as JingaNetType<"Buy" | "Sell" | "Wall">,

        updateRestockTime: uint32,

        updateVillagersShop: unknown as JingaNetType<Array<VillagerInfo>>,

        redeemPromo: str as JingaNetType<string>,

        promoResult: {
            success: bool,
            message: str,
        } as JingaNetType<{ success: boolean; message: string }>,

        confirmSellOptions: str as JingaNetType<"Option1" | "Option2" | "Option3" | "Option4">,

        toggleSellMenuOpen: bool,

        confirmPrompt: bool,

        updateFriendsBonus: bool as JingaNetType<boolean>,

        updateDailyQuest: unknown as JingaNetType<Array<DailyQuestInfo>>,

        sendFriendRequest: instance as JingaNetType<Player>,

        notify: {
            text: str,
            duration: uint8,
        } as JingaNetType<{ text: string; duration: number }>,

        npcDialogue: {
            target: str,
            text: str,
        } as JingaNetType<{ target: "Buy" | "Sell" | "Wall" | "None"; text: string }>,

        buyWall: {
            wallName: str,
            currency: str,
        } as JingaNetType<{ wallName: string; currency: "Coins" | "Robux" }>,

        equipWall: {
            wallName: str,
            equip: bool,
        } as JingaNetType<{ wallName: string; equip: boolean }>,

        togglePage: str as JingaNetType<ReturnType<typeof pageStates.openPage>>,

        giftToPlayer: {
            playerToGift: instance,
            produceTool: instance,
        } as JingaNetType<{ playerToGift: Player; produceTool: Tool }>,

        playSound: {
            sound: instance as JingaNetType<Sound>,
            position: optional(vec3) as unknown as JingaNetType<Vector3 | undefined>,
            pitch: optional(float32) as JingaNetType<number | undefined>,
        } as JingaNetType<{ sound: Sound; position?: JingaNetType<Vector3 | undefined>; pitch?: number }>,

        shopGiftTo: instance as JingaNetType<Player>,

        updateRobuxStore: unknown as JingaNetType<typeof robuxStoreData>,

        buyRobuxPack: {
            purchase: str,
        } as JingaNetType<{ purchase: keyof typeof robuxStoreData }>,

        getReplicatedComponents: nothing as JingaNetType<undefined>,

        deleteReplicatedEntity: entity as unknown as Entity,
    }


    // transforms the routes into a network component
    const routes = {} as { [K in keyof typeof realRoutes]: Network<typeof realRoutes[K]> } & { [K in keyof typeof componentRoutes]: Network<typeof componentRoutes[K]> };

    for (const [name, packet] of pairs(realRoutes)) routes[name] = new Network(name as string, packet as JingaNetType<any>, "reliable") as any;
    for (const [name, packet] of pairs(componentRoutes)) routes[name] = new Network(name as string, packet as JingaNetType<any>, "reliable") as any;

    return routes;
})()

