import React, { ReactNode, useEffect, useState } from "@rbxts/react"
import DefaultUIProperties from "../defaults/ui"
import { useMotion2 } from "client/app/hooks/useMotion"
import { useInterval } from "@rbxts/pretty-react-hooks"
import { Janitor } from "@rbxts/janitor"
import { config, SpringOptions } from "@rbxts/ripple"
import { springs } from "shared/data/Springs"



export const UiVibrate = {
    Horizontal: ({ range, play, children }: { range: NumberRange, play: UseState<boolean>, children?: ReactNode }) => {
        const [position, motionPosition] = useMotion2(UDim2.fromScale(.5, .5))

        // makes the ui inside eizes randomly change
        useEffect(() => {
            // motions to a random position based on range
            function changePosition(thingToMotion: Ripple.Motion<UDim2>) {
                const direction = [-1, 1][math.random(0, 1)]
                const value = (math.random(range.Min, range.Max) / 1000) * direction

                // tween the position
                thingToMotion.set(UDim2.fromScale(.5 + value, .5))
                thingToMotion.spring(UDim2.fromScale(.5, .5), springs.Vibrate)
                play[1](false)
            }

            // initial calls
            if (play[0]) changePosition(motionPosition)
        }, [play])



        return (
            <frame
                {...DefaultUIProperties}
                key="Vibrate"
                Position={position}
            >
                {children}
            </frame>
        )
    }
}
