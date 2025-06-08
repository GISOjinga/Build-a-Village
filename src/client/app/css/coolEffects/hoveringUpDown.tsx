import React, { ReactNode, useEffect, useState } from "@rbxts/react"
import DefaultUIProperties from "../defaults/ui"
import { useMotion2 } from "client/app/hooks/useMotion"
import { useInterval } from "@rbxts/pretty-react-hooks"
import { Janitor } from "@rbxts/janitor"
import { config } from "@rbxts/ripple"


/**
 * the range is in 1000's'
 */
export function HoverUpDown({ range, children, time }: { range: NumberRange, time?: NumberRange, children?: ReactNode }) {
    const [position, motionPosition] = useMotion2(UDim2.fromScale(.5, .5))

    // makes the ui inside eizes randomly change
    useEffect(() => {
        const trash = new Janitor()
        let direction = 1

        // motions to a random position based on range
        function changePosition(thingToMotion: Ripple.Motion<UDim2>) {
            const value = (math.random(range.Min, range.Max) / 1000) * direction
            direction *= -1

            // tween the position
            thingToMotion.tween(UDim2.fromScale(.5, .5 + value), { time: time ? math.random(time.Min, time.Max) : math.random(3, 5), direction: Enum.EasingDirection.InOut, style: Enum.EasingStyle.Cubic })
        }

        // when the position is completed it gets ran again
        trash.Add(motionPosition.onComplete(() => changePosition(motionPosition)))

        // initial calls
        changePosition(motionPosition)

        return () => trash.Destroy()
    }, [])



    return (
        <frame
            {...DefaultUIProperties}
            Position={position}
        >
            {children}
        </frame>
    )
}


