import ByteNet, { defineNamespace, definePacket, struct, inst, vec3, int8, int16, bool, optional, array, map, nothing } from "@rbxts/bytenet-fixed";
import { Entity } from "@rbxts/jecs";
import { EventLike } from "@rbxts/planck/out/types";
import { RunService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { camshake } from "shared/utils/functions/camShakeFunctions";
import { AllComponentNames, ComponentValue, MappedComponents } from "shared/utils/functions/jecsHelpFunctions";
import { componentsToReplicate } from "shared/utils/jecs/jecsComponents";
import { PlayerState } from "shared/utils/PlayerState";


const byteNetEntityInstance = ByteNet.unknown as ByteNetType<{ __ByteNetInstancePath: string }>
type packet<T extends ByteNetType<any>> = ReturnType<typeof ByteNet.definePacket<T>>
type ByteNetType<T> = {
    value: T;
};


type MapTableToByteNet<T> =
    T extends Instance ? ByteNetType<{ __ByteNetInstancePath: string }> :
    T extends Array<any> ? ByteNetType<MapTableToByteNet<T[keyof T]>> : (
        T extends object ? struct<{ [newKey in keyof T]: MapTableToByteNet<T[newKey]> }> :
        ByteNetType<T>
    );


// function to give a jecs component struct
function componentStruct<T extends ByteNetType<unknown>>(data: T) {
    return struct({
        serverEntity: ByteNet.uint32 as ByteNetType<Entity>,
        data: optional(data),
    })
}


// Define namespace and packets
const packets = defineNamespace("gameEvents", () => {
    type T = ByteNetType<AllComponentNames>

    return {
        // teleport to your village
        teleportToVillage: definePacket({
            value: ByteNet.nothing
        }),

        // teleport to buy or sell
        teleportToShop: definePacket({
            value: ByteNet.string as ByteNetType<"Buy" | "Sell">
        }),

        // route to get replicated components
        getReplicatedComponents: definePacket({ value: ByteNet.nothing }),
        deleteReplicatedEntity: definePacket({ value: ByteNet.unknown as ByteNetType<Entity> }),

        // for replicating components
        ...{
            Body: definePacket({
                value: componentStruct(struct({
                    model: byteNetEntityInstance,
                    head: byteNetEntityInstance,
                    humanoid: byteNetEntityInstance,
                    rootPart: byteNetEntityInstance,
                    animator: byteNetEntityInstance,
                    rootAttachment: byteNetEntityInstance,
                })),
            }),
        } satisfies { [k in keyof typeof componentsToReplicate]: packet<struct<{
            serverEntity: ByteNetType<Entity>,
            data: optional<MapTableToByteNet<ComponentValue<MappedComponents[k]>>>
        }>> },

        // for replicating player state
        replicatePlayerState: definePacket({
            value: struct({
                serverEntity: ByteNet.unknown as ByteNetType<Entity>,
                data: ByteNet.unknown as ByteNetType<PlayerState>,
            }),
        }),
    };
});


export const routes = {} as { [key in keyof typeof packets]: typeof packets[key] }

// loops through routes and makes a signal
for (const [key, packet] of pairs(packets)) {
    const toBeCalled = new Set<FirstParam<typeof packet["listen"]>>()
    const routeFaked = (routes as unknown as Record<any, any>)


    // adds the fake route
    routeFaked[key] = {
        wait: packet.wait,
        send: packet.send,
        sendToAll: packet.sendToAll,
        sendTo: packet.sendTo,
        sendToList: packet.sendToList,
        sendToAllExcept: packet.sendToAllExcept,
        listen: (callback: FirstParam<typeof packet["listen"]>) => {
            toBeCalled.add(callback)
            return () => toBeCalled.delete(callback);
        },
    };

    // the actual listner
    packet.listen((...T: unknown[]) => {
        // if (RunService.IsClient()) print("Recieved", key, T, toBeCalled)
        toBeCalled.forEach((callback: Callback) => callback(...T))
    });
}