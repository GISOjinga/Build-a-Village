import ByteNet, { defineNamespace, struct, inst, vec3, int8, int16, bool, optional, array, map, nothing } from "@rbxts/bytenet-fixed";
import { Entity } from "@rbxts/jecs";
import { EventLike } from "@rbxts/planck/out/types";
import { RunService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import pageStates, { PageStates } from "shared/utils/Animations/pageStates";
import { camshake } from "shared/utils/functions/camShakeFunctions";
import { AllComponentNames, ComponentValue, MappedComponents } from "shared/utils/functions/jecsHelpFunctions";
import { componentsToReplicate } from "shared/utils/jecs/jecsComponents";
import { PlayerState } from "shared/utils/PlayerState";
import robuxStoreData from "./robuxStoreData";


const byteNetEntityInstance = ByteNet.unknown as ByteNetType<Instance>
type packet<T extends ByteNetType<any>> = ReturnType<typeof ByteNet.definePacket<T>>
type ByteNetType<T> = {
    value: T;
};


type MapTableToByteNet<T> =
    T extends (undefined) ? ByteNetType<T> :
    // 1) Already a ByteNetType
    T extends ByteNetType<any> ? T :
    // entity
    T extends Entity ? ByteNetType<Entity> :
    // 2) Roblox Instance -> path
    T extends Instance ? ByteNetType<T> :
    // 3) Primitive Vector3
    T extends Vector3 ? ByteNetType<Vector3> :
    // 5) Maps
    T extends Map<infer G, infer V> ? ByteNetType<Map<G, MapTableToByteNet<V>>> :
    // 6) Plain objects (exclude functions)
    T extends object
    ? (T extends Function
        ? ByteNetType<T>                                     // functions get wrapped
        : struct<{ [K in keyof T]: MapTableToByteNet<T[K]> }>) // objects -> struct
    :
    // 7) Fallback
    ByteNetType<T>;


// function to give a jecs component struct
function componentStruct<T extends ByteNetType<unknown>>(data: T) {
    return struct({
        serverEntity: ByteNet.unknown as ByteNetType<Entity>,
        data: optional(data),
    })
}

// for ui
const definePacket = <T extends ByteNetType<any>>(packetProps: {
    value: T;
    reliabilityType?: "reliable" | "unreliable";
}) => {
    return RunService.IsRunning() ? ByteNet.definePacket(packetProps) : (() => ({
        ["listen"]: () => { },
        ["sendTo"]: () => { },
        ["send"]: () => { },
        ["sendToAll"]: () => { },
        ["sendToAllExcept"]: () => { },
        ["sendToList"]: () => { },
        ["wait"]: () => { },
    })) as unknown as packet<T>;
}

// Define namespace and packets
const packets = defineNamespace("gameEvents", () => {
    type T = ByteNetType<AllComponentNames>
    const villagerStruct = ByteNet.struct({
        Name: ByteNet.string as ByteNetType<VillagerNames>,
        UniqueId: ByteNet.uint32,
        RelativeLocation: optional(ByteNet.cframe),
        Progress: struct({
            Produce: ByteNet.string as ByteNetType<ProduceNames>,
            Required: optional(struct({
                Produce: ByteNet.string as ByteNetType<ProduceNames>,
                Amount: ByteNet.uint16,
                Max: ByteNet.uint16,
            })),
            Progression: struct({
                Time: struct({
                    RequiredTimePerResource: ByteNet.uint16,
                    StartTime: ByteNet.uint32,
                }),
                Resources: struct({
                    Gold: ByteNet.uint8,
                    Normal: ByteNet.uint8,
                    Rainbow: ByteNet.uint8
                }),
            }),
            Building: struct({
                StartTime: ByteNet.uint32,
                EndTime: ByteNet.uint32,
            }),
        }),
    }) satisfies ByteNetType<VillagerData> as ByteNetType<VillagerData>;

    return {
        // confirm prompt
        confirmPrompt: definePacket({
            value: bool,
        }),

        // hand to player as gift
        giftToPlayer: definePacket({
            value: struct({
                playerToGift: ByteNet.inst as ByteNetType<Player>,
                produceTool: ByteNet.inst as ByteNetType<Tool>
            }),
        }),

        // plays sounds
        playSound: definePacket({
            value: struct({
                sound: ByteNet.inst as ByteNetType<Sound>,
                position: optional(ByteNet.vec3),
            }),
        }),

        // update robux store
        updateRobuxStore: definePacket({
            value: ByteNet.unknown as ByteNetType<typeof robuxStoreData>,
        }),

        // request to buy robux pack
        buyRobuxPack: definePacket({
            value: struct({
                purchase: ByteNet.string as ByteNetType<keyof typeof robuxStoreData>,
            }),
        }),

        // to buy wall
        buyWall: definePacket({
            value: struct({
                wallName: ByteNet.string as ByteNetType<WallNames>,
                currency: ByteNet.string as ByteNetType<"Coins" | "Robux">,
            }),
        }),

        // equip wall
        equipWall: definePacket({
            value: struct({
                wallName: ByteNet.string as ByteNetType<WallNames>,
                equip: bool,
            }),
        }),

        // to toggle pages
        togglePage: definePacket({
            value: ByteNet.string as ByteNetType<ReturnType<typeof pageStates.openPage>>,
        }),

        // closes out the sell menu
        toggleSellMenuOpen: definePacket({
            value: ByteNet.bool
        }),

        // sell options
        confirmSellOptions: definePacket({
            value: ByteNet.string as ByteNetType<"Option1" | "Option2" | "Option3" | "Option4">,
        }),

        // notification
        notify: definePacket({
            value: struct({
                text: ByteNet.string,
                duration: ByteNet.uint8,
            }),
        }),

        // npc dialogue
        npcDialogue: definePacket({
            value: struct({
                target: ByteNet.string as ByteNetType<"Buy" | "Sell" | "None">,
                text: ByteNet.string,
            }),
        }),

        // promotions
        updateFriendsBonus: definePacket({
            value: ByteNet.bool,
        }),
        sendFriendRequest: definePacket({
            value: ByteNet.inst as ByteNetType<Player>,
        }),
        requestAddFriend: definePacket({
            value: ByteNet.inst as ByteNetType<Player>,
        }),
        redeemPromo: definePacket({
            value: ByteNet.string,
        }),
        promoResult: definePacket({
            value: struct({ success: bool, message: ByteNet.string }),
        }),

        // to gift your next robux purchace to a player
        shopGiftTo: definePacket({
            value: ByteNet.inst as ByteNetType<Player>,
        }),

        // place villager
        placeVillager: definePacket({
            value: ByteNet.cframe,
        }),

        // dig villager
        digVillager: definePacket({
            value: ByteNet.unknown as ByteNetType<Entity>,
        }),

        // request to buy villager
        buyVillager: definePacket({
            value: struct({
                villagerIndex: ByteNet.int16,
                currency: ByteNet.string as ByteNetType<"Coins" | "Robux">,
            }),
        }),

        // update shop villagers
        updateVillagersShop: definePacket({
            value: struct({
                TimeTillRestock: ByteNet.uint32,
                Villagers: ByteNet.unknown as ByteNetType<Array<VillagerInfo>>,
            }),
        }),

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
        jecsSetup: definePacket({ value: ByteNet.nothing }),

        // for replicating components
        ...{
            Body: definePacket({
                value: componentStruct(struct({
                    model: byteNetEntityInstance as ByteNetType<Model>,
                    head: byteNetEntityInstance as ByteNetType<BasePart>,
                    humanoid: byteNetEntityInstance as ByteNetType<Humanoid>,
                    rootPart: byteNetEntityInstance as ByteNetType<BasePart>,
                    animator: byteNetEntityInstance as ByteNetType<Animator>,
                    rootAttachment: byteNetEntityInstance as ByteNetType<Attachment>,
                    platform: optional(byteNetEntityInstance as ByteNetType<PlatformExample>),
                })),
            }),

            // for replicating villager
            Villager: definePacket({
                value: componentStruct(struct({
                    villagerModel: byteNetEntityInstance as ByteNetType<VillagerModel>,
                    playerEntity: ByteNet.unknown as ByteNetType<Entity>,
                    villagerData: villagerStruct,
                })),
            }),

            // data
            Data: definePacket({
                value: componentStruct(struct({
                    Version: ByteNet.string,
                    Coins: ByteNet.uint32,
                    Villagers: array(villagerStruct),
                    PromoCodesRedeemed: array(ByteNet.string),
                    Produce: array(struct({
                        Name: ByteNet.string as ByteNetType<ProduceNames>,
                        Amount: ByteNet.unknown as ByteNetType<number>,
                        Variant: ByteNet.string as ByteNetType<ProduceVariant>
                    })),
                    Walls: array(struct({
                        Name: ByteNet.string as ByteNetType<WallNames>,
                        Description: ByteNet.string,
                        Image: ByteNet.string,
                        Price: ByteNet.unknown as ByteNetType<number>,
                        GamePassId: ByteNet.unknown as ByteNetType<number>,
                        CashMultiplier: ByteNet.unknown as ByteNetType<number>,
                        Rarity: ByteNet.string as ByteNetType<WallRarity>,
                        Owned: bool,
                        Equipped: bool,
                    })),
                })),
            }),

            // confirmation prompt
            ConfirmationPrompt: definePacket({
                value: componentStruct(struct({
                    title: ByteNet.string,
                    message: ByteNet.string,
                    confirmation: ByteNet.bool,
                    onConfirm: ByteNet.unknown as ByteNetType<() => void>,
                    onDecline: optional(ByteNet.unknown) as ByteNetType<unknown>,
                })) as unknown as any,
            }),

            // for replicating player state
            ModelDebugger: definePacket({
                value: componentStruct(byteNetEntityInstance as ByteNetType<Model | BasePart>),
            }),
        } satisfies {
            [k in keyof typeof componentsToReplicate]: packet<struct<{
                serverEntity: ByteNetType<Entity>,
                data: optional<MapTableToByteNet<ComponentValue<MappedComponents[k]>>>
            }>>
        },

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