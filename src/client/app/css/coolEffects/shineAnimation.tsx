import React, { ReactNode, useEffect, useMemo, useState } from "@rbxts/react";
import DefaultUIProperties from "../defaults/ui";
import { useMotion2 } from "../../hooks/useMotion";
import { Janitor } from "@rbxts/janitor";
import { createInterval, createTimeout } from "shared/utils/functions/threadsFunctions";
import Ripple, { config, spring, TweenOptions } from "@rbxts/ripple";
import { excludeProps } from "../../hooks/excludeProps";
import { useInterval } from "@rbxts/pretty-react-hooks";



type PlayType = { timer: { duration: number, intervals: number }, play?: undefined } | { play: boolean, intervals?: undefined }
export function ShineAnimation(props: { children?: ReactNode } & React.InstanceProps<ImageLabel> & PlayType) {
    const [play, setPlay] = useState(false)
    const restProps = excludeProps(props, ["timer", "play"])
    const extendedSize = 1.45
    const deExtendedSize = 1.1
    const [size, motionSize] = useMotion2(0)
    const [rotation, motionRotation] = useMotion2(0)

    // wne ever props that play changed
    if (props.play !== undefined) {
        useEffect(() => {
            setPlay(() => props.play)
        }, [props.play])
    } else {
        useInterval(() => {
            setPlay(true)
            createTimeout(() => {
                setPlay(false)
            }, props.timer.duration)
        }, props.timer.intervals || 1)
    }

    // when shine is called
    useEffect(() => {
        const trash = new Janitor()
        const tweenType: (() => TweenOptions) = () => {
            return {
                time: math.random(10, 20) / 10,
                style: Enum.EasingStyle.Cubic,
                direction: Enum.EasingDirection.Out,
            }
        }


        // keeps thr shine spinning
        if (play) {
            // set up
            motionRotation.set(0)
            motionSize.set(0)
            motionRotation.tween(360, { time: math.random(50, 100) / 10, style: Enum.EasingStyle.Linear, direction: Enum.EasingDirection.InOut, repeatCount: -1 })
            motionSize.tween(extendedSize, tweenType())

            // for pulsatating
            trash.Add(motionSize.onComplete((size) => {
                if (size === extendedSize) {
                    motionSize.tween(deExtendedSize, { ...tweenType(), time: 1, style: Enum.EasingStyle.Linear })
                } else {
                    motionSize.tween(extendedSize, tweenType())
                }
            }))
        } else {
            motionSize.tween(0, { time: 2 })
        }

        return () => trash.Destroy()
    }, [play])

    return (
        <imagelabel
            {...DefaultUIProperties}
            {...restProps}
            Size={size.map((size) => UDim2.fromScale(size, size))}
            Rotation={rotation}
            Image={"rbxassetid://18849541275"}
        >
            {props.children}
        </imagelabel>
    )
}