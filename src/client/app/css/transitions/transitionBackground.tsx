import React, { ReactNode, useEffect, useState } from "@rbxts/react"
import DefaultUIProperties from "../defaults/ui"
import { useMotion2 } from "client/app/hooks/useMotion"
import { useInterval } from "@rbxts/pretty-react-hooks"






export function TransitionBackground({ speed, children }: { speed: { rate: number, delay: number }, children?: ReactNode }) {
    const [_, setPercentage] = useState(0)
    const [frame1Position, motionFrame1Position] = useMotion2(UDim2.fromScale(0, .5))
    const [frame2Position, motionFrame2Position] = useMotion2(UDim2.fromScale(-1, .5))

    // uses interval to move the percentage
    useInterval(() => {
        setPercentage((prev) => {
            const newValue = math.clamp(prev + speed.rate, 0, 1)

            // if the percentage is greater than 1, reset it
            if (prev >= 1 && motionFrame1Position.isComplete() && motionFrame2Position.isComplete()) {
                motionFrame1Position.set(UDim2.fromScale(0, .5))
                motionFrame2Position.set(UDim2.fromScale(-1, .5))
                return 0
            } else {
                motionFrame1Position.tween(UDim2.fromScale(newValue, .5))
                motionFrame2Position.tween(UDim2.fromScale(newValue - 1, .5))
                return newValue
            }
        })
    }, speed.delay)



    return (
        <frame
            {...DefaultUIProperties}
        >
            <frame {...DefaultUIProperties} AnchorPoint={new Vector2(0, .5)} Position={frame1Position} children={children} />
            <frame {...DefaultUIProperties} AnchorPoint={new Vector2(0, .5)} Rotation={180} Position={frame2Position} children={children} />
        </frame>
    )
}