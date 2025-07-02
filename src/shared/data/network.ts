import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import Squash, { Cursor, SerDes, OptionalSerDes, record } from "@rbxts/squash";
import { getUniqueIdPathFromInstance, getInstanceByUniqueIdPath } from "shared/utils/functions/instanceFunctions";
import { componentsToReplicate } from "shared/utils/jecs/jecsComponents";
import { AllComponentNames, ComponentValue, MappedComponents } from "shared/utils/functions/jecsHelpFunctions";
import { PlayerState } from "shared/utils/PlayerState";
import robuxStoreData from "./robuxStoreData";
import { Entity } from "@rbxts/jecs";

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
const optional = Squash.opt;
export const nothing = {
    ser(this: void): void { },
    des(this: void): void { },
} as unknown as SerDes<undefined>;

export const inst = {
    ser(cursor: Cursor, instance: Instance) {
        const path = getUniqueIdPathFromInstance(instance).join("/");
        str.ser(cursor, path);
    },
    des(cursor: Cursor) {
        const path = str.des(cursor);
        return getInstanceByUniqueIdPath(path === "" ? [] : path.split("/")) as Instance;
    },
} as SerDes<Instance>;




// === Remote Type Wrapper (fixed) === //
export class Network<J extends SerDes<any>> {
    private cursor = Squash.cursor()
    constructor(
        private readonly name: string,
        private readonly packet: J,
        private readonly reliabilityType: "reliable" | "unreliable" = "reliable",
    ) { }

    public server = {
        listen: (callback: (data: ReturnType<J['des']>, player: Player) => void) => {
            return jingaRemote.OnServerEvent.Connect((player, name: unknown, returnedBuffer: unknown) => {
                if (name !== this.name) return;
                const newCursor = Squash.frombuffer(returnedBuffer as buffer);
                const realData = this.packet.des(newCursor);

                // calls the call back
                print(realData)
                callback(realData, player);
            })
        },
        sendToAll: (data: ReturnType<J['des']>) => {
            this.packet.ser(this.cursor, data)
            jingaRemote.FireAllClients(this.name, Squash.tobuffer(this.cursor));
        },
        sendToAllExcept: (data: ReturnType<J['des']>, exception: Player) => {
            this.packet.ser(this.cursor, data)
            Players.GetPlayers().forEach((player) => {
                if (player !== exception) jingaRemote.FireClient(player, this.name, Squash.tobuffer(this.cursor));
            })
        },
        sendTo: (data: ReturnType<J['des']>, player: Player) => {
            this.packet.ser(this.cursor, data)
            jingaRemote.FireClient(player, this.name, Squash.tobuffer(this.cursor));
        },
        sendToList: (data: ReturnType<J['des']>, players: Player[]) => {
            this.packet.ser(this.cursor, data)
            players.forEach((player) => jingaRemote.FireClient(player, this.name, Squash.tobuffer(this.cursor)));
        },
    }

    public client = {
        listen: (callback: (data: ReturnType<J['des']>) => void) => {
            return jingaRemote.OnClientEvent.Connect((name: unknown, returnedBuffer: unknown) => {
                if (name !== this.name) return;
                const newCursor = Squash.frombuffer(returnedBuffer as buffer);
                const realData = this.packet.des(newCursor);

                // calls the call back
                callback(realData as never);
            })
        },
        wait: (): ReturnType<J['des']> => {
            do {
                const [name, returnedBuffer] = jingaRemote.OnClientEvent.Wait() as unknown as [string, buffer];

                // If the name matches, we can safely deserialize
                if (name === this.name) {
                    const newCursor = Squash.frombuffer(returnedBuffer as buffer);
                    return this.packet.des(newCursor);
                };
            } while (true)
        },
        send: (data: ReturnType<J['des']> = undefined as ReturnType<J['des']>) => {
            this.packet.ser(this.cursor, data as never)
            jingaRemote.FireServer(this.name, Squash.tobuffer(this.cursor));
        },
    }
}

type MapTableToJingaNet<T> =
    T extends Instance ? SerDes<Instance> :
    T extends object ? { [K in keyof T]: T[K] extends Squash.Optional<infer J> ? T[K] : MapTableToJingaNet<T[K]> } :
    SerDes<T>;

// === Example Remote Bindings === //
export const routes = (() => {
    const componentRecord = <T extends unknown>(data: MapTableToJingaNet<T>) => record({
        serverEntity: uint32,
        data: optional(data as never),
    }) as unknown as SerDes<{
        serverEntity: SerDes<Entity>,
        data: Squash.Optional<MapTableToJingaNet<T>>;
    }>

    const villagerData = record({}) as SerDes<VillagerData>;

    const events = {
        jecsSetup: nothing,
        Jump: record({
            position: record({ x: float32, y: float32, z: float32 }),
        }),
        buyVillager: record({ villagerIndex: int16, currency: str }),
        placeVillager: cframe,
        digVillager: uint32,
        supplyVillager: uint32,
        collectVillagerProduce: record({
            villagerEntity: uint32,
            resourceModelName: str,
        }),
        teleportToVillage: nothing,
        teleportToShop: str,
        updateRestockTime: uint32,
        updateVillagersShop: str,
        redeemPromo: str,
        promoResult: record({ success: bool, message: str }),
        confirmSellOptions: str,
        toggleSellMenuOpen: bool,
        confirmPrompt: bool,
        updateFriendsBonus: bool,
        sendFriendRequest: inst,
        notify: record({ text: str, duration: uint8 }),
        npcDialogue: record({ target: str, text: str }),
        buyWall: record({ wallName: str, currency: str }),
        equipWall: record({ wallName: str, equip: bool }),
        togglePage: str,
        giftToPlayer: record({ playerToGift: inst, produceTool: inst }),
        playSound: record({ sound: inst, position: optional(vec3) }),
        shopGiftTo: inst,
        updateRobuxStore: str,
        buyRobuxPack: record({ purchase: str }),

        getReplicatedComponents: nothing,
        deleteReplicatedEntity: uint32,

        ...{
            Body: componentRecord(record({
                model: inst,
                head: inst,
                humanoid: inst,
                rootPart: inst,
                animator: inst,
                rootAttachment: inst,
                platform: optional(inst),
            })),
            Villager: componentRecord(record({
                villagerModel: inst,
                playerEntity: uint32,
                villagerData: villagerData,
            })),
            Data: componentRecord(record({
                Version: str,
                Coins: uint32,
            })),
            ConfirmationPrompt: componentRecord(record({
                title: str,
                message: str,
                confirmation: optional(bool),
            })),
            ModelDebugger: componentRecord(inst),
        } satisfies {
            [k in keyof typeof componentsToReplicate]: SerDes<{
                serverEntity: SerDes<Entity>,
                data: Squash.Optional<MapTableToJingaNet<ComponentValue<MappedComponents[k]>>>;
            }>;
        },
    };

    type events = typeof events;
    const realRemotes = {} as { [K in keyof events]: Network<events[K]> };
    for (const [name, packet] of pairs(events)) realRemotes[name] = new Network(name as string, packet as SerDes<any>, "reliable");
    return realRemotes;
})();
