import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import Squash, { Cursor, SerDes, OptionalSerDes, record, array, AnySerDesType, NonVariadicSerDesType, InferValueType, Unpack } from "@rbxts/squash";
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


// === Base JingaNet Type === //
export type JingaNetType<T> = SerDes<T>;


// === Primitive Types === //
const optional = Squash.opt;
type arr<T extends unknown> = SerDes<T[]>;
export const int8 = Squash.int(1)
export const int16 = Squash.int(2);
export const int32 = Squash.int(4);
export const uint8 = Squash.uint(1);
export const uint16 = Squash.uint(2);
export const uint32 = Squash.uint(4);
export const float32 = Squash.number(4);
export const float64 = Squash.number(8);
export const str = Squash.string();
export const bool = Squash.boolean() as unknown as SerDes<boolean>;
export const cframe = Squash.CFrame(Squash.number(4));
export const vec3 = Squash.Vector3(Squash.number(4));
export const vec2 = Squash.Vector2(Squash.number(4));
export const nothing = {
    ser(this: void): void { },
    des(this: void): void { },
} as unknown as SerDes<undefined>;
export const unknown = {
    ser(this: void, idk: unknown) { return idk },
    des(this: void, idk: unknown) { return idk },
} as unknown as SerDes<unknown>;
export const entity = Squash.uint(8) as unknown as SerDes<Entity>;
export const inst = record({
    __ByteNetInstancePath: array(str),
}) as unknown as SerDes<Instance>;


type ExtractSerDes<T> = T extends SerDes<infer U> ? U : never;

// === Remote Type Wrapper (fixed) === //
export class Network<J extends SerDes<any>> {
    constructor(
        private readonly name: string,
        private readonly packet: J,
        private readonly reliabilityType: "reliable" | "unreliable" = "reliable",
    ) { }


    public listen(callback: (data: ExtractSerDes<J>, player: Player) => void) {
        if (RunService.IsClient()) {
            // Client side, listen to the server event
            return jingaRemote.OnClientEvent.Connect((name: unknown, returnedBuffer: unknown) => {
                if (name !== this.name) return;
                let realData: ExtractSerDes<J> | undefined = undefined;
                if (returnedBuffer) {
                    const newCursor = Squash.frombuffer(returnedBuffer as buffer);
                    realData = this.packet.des(newCursor) as ExtractSerDes<J>;
                    print(name, "GOT THE DATA", realData, returnedBuffer, newCursor)
                }

                // calls the call back
                callback(realData as never, Players.LocalPlayer as Player);
            });
        } else {
            return jingaRemote.OnServerEvent.Connect((player, name: unknown, returnedBuffer: unknown) => {
                print(name)
                if (name !== this.name) return;
                let realData: ExtractSerDes<J> | undefined = undefined;
                if (returnedBuffer) {
                    const newCursor = Squash.frombuffer(returnedBuffer as buffer);
                    realData = this.packet.des(newCursor) as ExtractSerDes<J>;
                    print(name, "GOT THE DATA", realData, returnedBuffer, newCursor)
                }

                // calls the call back
                print(realData, player)
                callback(realData as never, player);
            });
        }
    }

    private searlizeToBuffer(data: ExtractSerDes<J>): buffer {
        const cursor = Squash.cursor();
        this.packet.ser(cursor, data);
        return Squash.tobuffer(cursor);
    }

    public sendToAll(data: ExtractSerDes<J>) {
        jingaRemote.FireAllClients(this.name, this.searlizeToBuffer(data));
    }

    public sendToAllExcept(data: ExtractSerDes<J>, exception: Player) {
        Players.GetPlayers().forEach((player) => {
            if (player !== exception) jingaRemote.FireClient(player, this.name, this.searlizeToBuffer(data));
        })
    }

    public sendTo(data: ExtractSerDes<J>, player: Player) {
        jingaRemote.FireClient(player, this.name, this.searlizeToBuffer(data));
    }

    public sendToList(data: ExtractSerDes<J>, players: Player[]) {
        // print(this.name, "GOT THE DATA", data, Squash.tobuffer(this.cursor), Squash.frombuffer(Squash.tobuffer(this.cursor)), this.packet.des)
        players.forEach((player) => jingaRemote.FireClient(player, this.name, this.searlizeToBuffer(data)));
    }

    public wait(): ExtractSerDes<J> {
        do {
            const [name, returnedBuffer] = jingaRemote.OnClientEvent.Wait() as unknown as [string, buffer];

            // If the name matches, we can safely deserialize
            if (name === this.name) {
                const newCursor = Squash.frombuffer(returnedBuffer as buffer);
                return this.packet.des(newCursor);
            };
        } while (true)
    }

    public send(data: ExtractSerDes<J> = undefined as ExtractSerDes<J>) {
        print("Sending", this.name, "with data", data);
        jingaRemote.FireServer(this.name, this.searlizeToBuffer(data));
    }
}




// === Example Remote Bindings === //
export const routes = (() => {
    const componentRecord = <T extends SerDes<unknown>>(data: T) => record({
        serverEntity: entity,
        data: optional(data),
    })

    const villagerStruct = record({
        Name: str as SerDes<VillagerNames>,
        UniqueId: unknown as SerDes<number>,
        RelativeLocation: optional(cframe),
        Progress: record({
            Produce: str as SerDes<ProduceNames>,
            Required: optional(record({
                Produce: str as SerDes<ProduceNames>,
                Amount: unknown as SerDes<number>,
                Max: unknown as SerDes<number>,
            })),
            Progression: record({
                Time: record({
                    RequiredTimePerResource: uint16,
                    StartTime: unknown as SerDes<number>,
                }),
                Resources: array(str as SerDes<ProduceVariant>),
            }),
            Building: record({
                StartTime: unknown as SerDes<number>,
                TotalTime: unknown as SerDes<number>,
            }),
        }),
    })// satisfies SerDes<VillagerData> as SerDes<VillagerData>;

    const events = {
        jecsSetup: nothing as SerDes<undefined>,

        Jump: record({
            position: record({
                x: float32,
                y: float32,
                z: float32,
            }),
        }) as SerDes<{ position: { x: number; y: number; z: number } }>,

        buyVillager: record({
            villagerIndex: int16,
            currency: str,
        }) as SerDes<{ villagerIndex: number; currency: "Coins" | "Robux" }>,

        placeVillager: cframe as SerDes<CFrame>,

        digVillager: entity,

        supplyVillager: entity,

        collectVillagerProduce: record({
            villagerEntity: entity,
            resourceModelName: str,
        }) as SerDes<{ villagerEntity: Entity; resourceModelName: ProduceNames }>,

        teleportToVillage: nothing as SerDes<undefined>,

        teleportToShop: str as SerDes<"Buy" | "Sell" | "Wall">,

        updateRestockTime: uint32,

        updateVillagersShop: unknown as SerDes<Array<VillagerInfo>>,

        redeemPromo: str as SerDes<string>,

        promoResult: record({
            success: bool,
            message: str,
        }) as SerDes<{ success: boolean; message: string }>,

        confirmSellOptions: str as SerDes<"Option1" | "Option2" | "Option3" | "Option4">,

        toggleSellMenuOpen: bool,

        confirmPrompt: bool,

        updateFriendsBonus: bool as SerDes<boolean>,

        sendFriendRequest: inst as SerDes<Player>,

        notify: record({
            text: str,
            duration: uint8,
        }) as SerDes<{ text: string; duration: number }>,

        npcDialogue: record({
            target: str,
            text: str,
        }) as SerDes<{ target: "Buy" | "Sell" | "None"; text: string }>,

        buyWall: record({
            wallName: str,
            currency: str,
        }) as SerDes<{ wallName: string; currency: "Coins" | "Robux" }>,

        equipWall: record({
            wallName: str,
            equip: bool,
        }) as SerDes<{ wallName: string; equip: boolean }>,

        togglePage: str as SerDes<ReturnType<typeof pageStates.openPage>>,

        giftToPlayer: record({
            playerToGift: inst,
            produceTool: inst,
        }) as SerDes<{ playerToGift: Player; produceTool: Tool }>,

        playSound: record({
            sound: inst,
            position: optional(vec3),
        }) as SerDes<{ sound: Sound; position?: Vector3 }>,

        shopGiftTo: inst as SerDes<Player>,

        updateRobuxStore: unknown as SerDes<typeof robuxStoreData>,

        buyRobuxPack: record({
            purchase: str,
        }) as SerDes<{ purchase: keyof typeof robuxStoreData }>,

        getReplicatedComponents: nothing as SerDes<undefined>,

        deleteReplicatedEntity: entity,

        ...{
            Body: componentRecord(record({
                model: inst as SerDes<Model>,
                head: inst as SerDes<BasePart>,
                humanoid: inst as SerDes<Humanoid>,
                rootPart: inst as SerDes<BasePart>,
                animator: inst as SerDes<Animator>,
                rootAttachment: inst as SerDes<Attachment>,
                platform: optional(inst as SerDes<PlatformExample>),
            })) as never,

            Villager: componentRecord(record({
                villagerModel: inst as SerDes<VillagerModel>,
                playerEntity: entity,
                villagerData: villagerStruct as SerDes<VillagerData>,
            })) as never,

            Data: componentRecord(record({
                Version: str as SerDes<string>,
                Coins: uint32,
                Villagers: array(villagerStruct) as SerDes<VillagerData[]>,
                Produce: array(record({
                    Name: str as SerDes<ProduceNames>,
                    Amount: unknown as SerDes<number>,
                    Variant: str as SerDes<ProduceVariant>,
                })),
                Tutorial: unknown as SerDes<"Done" | number>,
                Walls: array(record({
                    Name: str as SerDes<WallNames>,
                    Description: str,
                    Image: str,
                    Price: unknown as SerDes<number>,
                    GamePassId: unknown as SerDes<number>,
                    CashMultiplier: unknown as SerDes<number>,
                    Rarity: str as SerDes<WallRarity>,
                    Owned: bool,
                    Equipped: bool,
                })),
                PromoCodesRedeemed: array(str),
            })) as never,

            ConfirmationPrompt: componentRecord(record({
                title: str,
                message: str,
                confirmation: optional(bool),
                onConfirm: unknown as SerDes<() => void>,
                onDecline: optional(unknown as SerDes<() => void>),
            })) as never,

            ModelDebugger: componentRecord(inst as SerDes<Model | BasePart>) as never,
        } satisfies {
            [k in keyof typeof componentsToReplicate]: SerDes<ComponentValue<MappedComponents[k]>>;
        }
    };

    type events = typeof events;
    const realRemotes = {} as { [K in keyof events]: Network<events[K]> };
    for (const [name, packet] of pairs(events)) realRemotes[name] = new Network(name as string, packet as SerDes<any>, "reliable") as any;
    return realRemotes;
})();
