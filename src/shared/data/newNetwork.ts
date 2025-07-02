import { Players, ReplicatedStorage, RunService } from "@rbxts/services";
import Squash, { Cursor, SerDes, BoolSerDes, OptionalSerDes, record, Output } from "@rbxts/squash";

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
export const bool = Squash.boolean();
export const cframe = Squash.CFrame(Squash.number(4));
export const vec3 = Squash.Vector3(Squash.number(4));
export const vec2 = Squash.Vector2(Squash.number(4));
export const nothing = {
    ser(this: void): void { },
    des(this: void): void { },
} as unknown as SerDes<undefined>;




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


// === Example Remote Bindings === //
export const remotes = (() => {
    const events = {
        jecsSetup: nothing,
        Jump: record({
            position: record({
                x: float32,
                y: float32,
                z: float32,
            })
        }),
    }

    const realRemotes = {} as { [K in keyof typeof events]: Network<typeof events[K]> };
    for (const [name, packet] of pairs(events)) realRemotes[name] = new Network(name as string, packet as SerDes<any>, "reliable");
    return realRemotes
})()