import React, { ReactNode, useEffect, useMemo, useState } from "@rbxts/react";
import { Janitor } from "@rbxts/janitor";
import { createInterval, createTimeout } from "shared/utils/functions/threadsFunctions";
import Ripple, { config } from "@rbxts/ripple";
import { useInterval } from "@rbxts/pretty-react-hooks";
import { excludeProps } from "client/app/hooks/excludeProps";
import { useMotion2 } from "client/app/hooks/useMotion";
import DefaultUIProperties from "../defaults/ui";



export function Ballooning(props: { children?: ReactNode, size: UDim2, data: { range: number, intervals: number } }) {
    const [size, motionSize] = useMotion2(props.size)
    const range = props.data.range

    // wne ever props that play changed
    useInterval(() => {
        const trash = new Janitor()

        // set up
        motionSize.set(props.size)
        motionSize.spring(new UDim2(props.size.X.Scale * range, props.size.X.Offset * range, props.size.Y.Scale * range, props.size.Y.Offset * range), config.spring.wobbly)

        // when completed clean up
        trash.Add(motionSize.onComplete(() => {
            trash.Cleanup()
            trash.Add(createTimeout(() => {
                motionSize.spring(props.size, config.spring.wobbly)
                trash.Destroy()
            }, 1))
        }))
    }, props.data.intervals || 1)


    return (
        <frame
            {...DefaultUIProperties}
            Size={size}
        >
            {props.children}
        </frame>
    )
}