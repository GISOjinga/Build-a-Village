import React, { ReactNode, useEffect, useState } from "@rbxts/react"
import DefaultUIProperties from "../defaults/ui"
import { useMotion2 } from "client/app/hooks/useMotion"
import { useInterval } from "@rbxts/pretty-react-hooks"
import { Janitor } from "@rbxts/janitor"
import { config } from "@rbxts/ripple"


/**
 * the range is in 1000's'
 */
export function GooifyPosition({ range, children }: { range: NumberRange, children?: ReactNode }) {
    const [position, setPosition] = useState(UDim2.fromScale(.5, .5))
    const [_, motionXPosition] = useMotion2<number>(.5)
    const [__, motionYPosition] = useMotion2<number>(.5)

    // makes the ui inside eizes randomly change
    useEffect(() => {
        const trash = new Janitor()

        // motions to a random position based on range
        function changePosition(thingToMotion: Ripple.Motion<number>) {
            const value = (math.random(range.Min, range.Max) / 1000) * [-1, 1][math.random(0, 1)]

            // tween the position
            thingToMotion.tween(.5 + value, { time: math.random(2, 5), direction: Enum.EasingDirection.InOut, style: Enum.EasingStyle.Cubic })
        }

        // when the position is completed it gets ran again
        trash.Add(motionXPosition.onComplete(() => changePosition(motionXPosition)))
        trash.Add(motionYPosition.onComplete(() => changePosition(motionYPosition)))

        // when the x & y position changes, update the position
        trash.Add(motionXPosition.onStep((x) => setPosition(oldPosition => UDim2.fromScale(x, oldPosition.Y.Scale))))
        trash.Add(motionYPosition.onStep((y) => setPosition(oldPosition => UDim2.fromScale(oldPosition.X.Scale, y))))

        // initial calls
        changePosition(motionXPosition)
        changePosition(motionYPosition)

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


/**
 * the range is in 1000's'
 */
export function GooifySize({ range, children }: { range: NumberRange, children?: ReactNode }) {
    const [size, setSize] = useState(UDim2.fromScale(1, 1))
    const [_, motionXSize] = useMotion2<number>(1)
    const [__, motionYSize] = useMotion2<number>(1)

    // makes the ui inside eizes randomly change
    useEffect(() => {
        const trash = new Janitor()

        // motions to a random size based on range
        function changeSize(thingToMotion: Ripple.Motion<number>) {
            const value = math.random(range.Min, range.Max) / 1000

            // tween the size
            thingToMotion.spring(value, config.spring.wobbly)
        }

        // when the size is completed it gets ran again
        trash.Add(motionXSize.onComplete(() => changeSize(motionXSize)))
        trash.Add(motionYSize.onComplete(() => changeSize(motionYSize)))

        // when the x & y size changes, update the size
        trash.Add(motionXSize.onStep((x) => setSize(oldSize => UDim2.fromScale(x, oldSize.Y.Scale))))
        trash.Add(motionYSize.onStep((y) => setSize(oldSize => UDim2.fromScale(oldSize.X.Scale, y))))

        // initial calls
        changeSize(motionXSize)
        changeSize(motionYSize)

        return () => trash.Destroy()
    }, [])



    return (
        <frame
            {...DefaultUIProperties}
            Size={size}
        >
            {children}
        </frame>
    )
}