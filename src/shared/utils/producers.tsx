import { RefObject } from "@rbxts/react";
import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/react-reflex";
import { ProducerActions, createProducer } from "@rbxts/reflex";
import { Players } from "@rbxts/services";



export interface UiProducers {
    readonly openPage: "None",
}



const initialState: UiProducers = {
    openPage: game.PlaceId !== 16190474104 ? "None" : "None",
};


const producerFunctions = {
    togglePages: (state: UiProducers, toggle: UiProducers["openPage"]) => {
        return ({ ...state, openPage: toggle, })
    },
}


export const producer = createProducer<UiProducers, typeof producerFunctions>(initialState, producerFunctions);

export type RootProducer = typeof producer;
export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;