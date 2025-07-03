import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import Squash, { SerDes, OptionalSerDes, record, array, AnySerDesType, NonVariadicSerDesType, InferValueType, Unpack, Optional } from "@rbxts/squash";
import { getUniqueIdPathFromInstance, getInstanceByUniqueIdPath } from "shared/utils/functions/instanceFunctions";
import { componentsToReplicate } from "shared/utils/jecs/jecsComponents";
import { AllComponentNames, ComponentValue, MappedComponents } from "shared/utils/functions/jecsHelpFunctions";
import { PlayerState } from "shared/utils/PlayerState";
import robuxStoreData from "./robuxStoreData";
import { Entity } from "@rbxts/jecs";
import pageStates from "shared/utils/Animations/pageStates";

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
const optional = Squash.opt as <SerDesType extends AnySerDesType>(serdes: SerDesType) => OptionalSerDes<SerDesType>;
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
export const cframe = Squash.CFrame(Squash.number(4)) as unknown as JingaNetType<CFrame>;
export const vec3 = Squash.Vector3(Squash.number(4)) as unknown as JingaNetType<Vector3>;
export const vec2 = Squash.Vector2(Squash.number(4)) as unknown as JingaNetType<Vector2>;
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
export const compInst = record({
    __ByteNetInstancePath: array(str),
}) as unknown as JingaNetType<Instances[keyof Instances]>;



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
        private readonly packet: J,
        private readonly reliabilityType: "reliable" | "unreliable" = "reliable",
    ) { }


    public listen(callback: (data: UnwrapJingaNetType<J>, player: Player) => void) {
        if (RunService.IsClient()) {
            // Client side, listen to the server event
            return jingaRemote.OnClientEvent.Connect((name: unknown, returnedBuffer: unknown) => {
                if (name !== this.name) return;
                let realData: UnwrapJingaNetType<J> | undefined = undefined;
                if (returnedBuffer) {
                    realData = this.deepDeserialize(returnedBuffer as buffer);
                    print(name, "GOT THE DATA", realData, returnedBuffer)
                }

                // calls the call back
                callback(realData as never, Players.LocalPlayer as Player);
            });
        } else {
            return jingaRemote.OnServerEvent.Connect((player, name: unknown, returnedBuffer: unknown) => {
                print(name)
                if (name !== this.name) return;
                let realData: UnwrapJingaNetType<J> | undefined = undefined;
                if (returnedBuffer) {
                    realData = this.deepDeserialize(returnedBuffer as buffer);
                    print(name, "GOT THE DATA", realData, returnedBuffer)
                }

                // calls the call back
                print(realData, player)
                callback(realData as never, player);
            });
        }
    }

    /** Serialize arbitrary data into a Squash buffer using deep serialization */
    private serializeToBuffer(data: UnwrapJingaNetType<J>): buffer {
        return this.deepSerialize(data);
    }

    /**
     * Recursively serialize `data` according to `this.packet` schema.
     * This walks nested objects and array descriptors, using any SerDes
     * implementations found in the schema to write primitive values.
     */
    private deepSerialize(data: UnwrapJingaNetType<J>): buffer {
        const cursor = Squash.cursor();

        const serialize = (schema: unknown, value: unknown) => {
            // If schema is a SerDes table, use it directly
            if (typeIs(schema, "table") && typeIs((schema as never)["ser"], "function")) {
                (schema as SerDes<unknown>).ser(cursor, value);
                return;
            }

            // For tables without a direct serializer, recurse into each key
            if (typeIs(schema, "table") && typeIs(value, "table")) {
                const serField = (schema as never)["ser"];
                // Dynamic array support when schema describes an array shape
                if (!typeIs(serField, "function") && (schema as never)[1] !== undefined) {
                    const arr = value as Array<unknown>;
                    uint16.ser(cursor, arr.size() as never);
                    for (const v of arr) {
                        serialize((schema as never)[1], v);
                    }
                } else {
                    for (const [key, child] of pairs(schema as never)) {
                        serialize(child, (value as never)[key]);
                    }
                }
                return;
            }

            // Fallback for primitives/undefined
            if (typeIs(schema, "table") && typeIs((schema as never)["des"], "function")) {
                (schema as SerDes<unknown>).ser(cursor, value);
            }
        };

        serialize(this.packet, data);
        return Squash.tobuffer(cursor);
    }

    /**
     * Reconstruct data from a buffer using the same schema used for sending.
     * Supports nested objects and dynamically sized arrays.
     */
    private deepDeserialize(buffer: buffer): UnwrapJingaNetType<J> {
        const cursor = Squash.frombuffer(buffer);

        const deserialize = (schema: unknown): unknown => {
            if (typeIs(schema, "table") && typeIs((schema as never)["des"], "function")) {
                return (schema as SerDes<unknown>).des(cursor);
            }

            if (typeIs(schema, "table")) {
                const desField = (schema as never)["des"];
                if (!typeIs(desField, "function") && (schema as never)[1] !== undefined) {
                    const arrLength = uint16.des(cursor) as number;
                    const arr = [] as Array<unknown>;
                    for (let i = 1; i <= arrLength; i++) {
                        arr[i - 1] = deserialize((schema as never)[1]);
                    }
                    return arr;
                } else {
                    const out = {} as Record<string, unknown>;
                    for (const [key, child] of pairs(schema as never)) {
                        out[key as any] = deserialize(child);
                    }
                    return out;
                }
            }
            return undefined;
        };

        return deserialize(this.packet) as UnwrapJingaNetType<J>;
    }

    public sendToAll(data: UnwrapJingaNetType<J>) {
        jingaRemote.FireAllClients(this.name, this.serializeToBuffer(data));
    }

    public sendToAllExcept(data: UnwrapJingaNetType<J>, exception: Player) {
        Players.GetPlayers().forEach((player) => {
            if (player !== exception) jingaRemote.FireClient(player, this.name, this.serializeToBuffer(data));
        })
    }

    public sendTo(data: UnwrapJingaNetType<J>, player: Player) {
        jingaRemote.FireClient(player, this.name, this.serializeToBuffer(data));
    }

    public sendToList(data: UnwrapJingaNetType<J>, players: Player[]) {
        // print(this.name, "GOT THE DATA", data, Squash.tobuffer(this.cursor), Squash.frombuffer(Squash.tobuffer(this.cursor)), this.packet.des)
        players.forEach((player) => jingaRemote.FireClient(player, this.name, this.serializeToBuffer(data)));
    }

    public wait(): UnwrapJingaNetType<J> {
        do {
            const [name, returnedBuffer] = jingaRemote.OnClientEvent.Wait() as unknown as [string, buffer];

            // If the name matches, we can safely deserialize
            if (name === this.name) {
                return this.deepDeserialize(returnedBuffer as buffer);
            };
        } while (true)
    }

    public send(data: UnwrapJingaNetType<J> = undefined as UnwrapJingaNetType<J>) {
        print("Sending", this.name, "with data", data);
        jingaRemote.FireServer(this.name, this.serializeToBuffer(data));
    }
}




export const sharedRoutes = (() => {
    const componentRecord = <T>(data: T) => ({
        serverEntity: entity as JingaNetType<Entity>,
        data: optional(data as never) as unknown as Optional<T>,
    })

    const villagerStruct = {
        Name: str as JingaNetType<VillagerNames>,
        UniqueId: unknown as JingaNetType<number>,
        RelativeLocation: optional(cframe) as unknown as JingaNetType<CFrame | undefined>,
        Progress: {
            Produce: str as JingaNetType<ProduceNames>,
            Required: optional({
                Produce: str as JingaNetType<ProduceNames>,
                Amount: unknown as JingaNetType<number>,
                Max: unknown as JingaNetType<number>,
            } as never) as never,
            Progression: {
                Time: {
                    RequiredTimePerResource: uint16,
                    StartTime: unknown as JingaNetType<number>,
                },
                Resources: array(str as JingaNetType<ProduceVariant>) as unknown as JingaNetType<ProduceVariant[]>,
            },
            Building: {
                StartTime: unknown as JingaNetType<number>,
                TotalTime: unknown as JingaNetType<number>,
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
            platform: optional(compInst) as unknown as JingaNetType<PlatformExample | undefined>,
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
            Villagers: [villagerStruct] as JingaNetType<VillagerData>[],
            Produce: array(record({
                Name: str as JingaNetType<ProduceNames>,
                Amount: unknown as JingaNetType<number>,
                Variant: str as JingaNetType<ProduceVariant>,
            })) as unknown as JingaNetType<ProduceData[]>,
            Tutorial: unknown as JingaNetType<"Done" | number>,
            Walls: array(record({
                Name: str as JingaNetType<WallNames>,
                Description: str,
                Image: str,
                Price: unknown as JingaNetType<number>,
                GamePassId: unknown as JingaNetType<number>,
                CashMultiplier: unknown as JingaNetType<number>,
                Rarity: str as JingaNetType<WallRarity>,
                Owned: bool,
                Equipped: bool,
            })) as unknown as JingaNetType<WallInfo[]>,
            PromoCodesRedeemed: array(str),
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

        placeVillager: cframe as JingaNetType<CFrame>,

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
        } as JingaNetType<{ sound: Sound; position?: JingaNetType<Vector3 | undefined> }>,

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

