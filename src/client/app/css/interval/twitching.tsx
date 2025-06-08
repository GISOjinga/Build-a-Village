import React, { ReactNode, useEffect, useMemo, useState } from "@rbxts/react";
import DefaultUIProperties from "../defaults/ui";
import { useMotion2 } from "../../hooks/useMotion";
import Ripple, { config } from "@rbxts/ripple";
import { useInterval } from "@rbxts/pretty-react-hooks";

/**
 * A React component that creates a twitching animation for a Roblox UI element.
 * The animation rotates the UI element within a specified range at regular intervals.
 *
 * @param props - The properties of the component.
 * @param props.children - The child elements to be rendered within the UI frame.
 * @param props.data - The data object containing the range and intervals for the animation.
 * @param props.data.range - The rotation range in degrees for the animation.
 * @param props.data.intervals - The interval in milliseconds between each rotation.
 *
 * @returns - A React component that renders a UI frame with the specified rotation animation.
 */
export function TwitchAnimation(props: { children?: ReactNode, data: { range: number, intervals: number } }) {
    const [rotation, motionRotation] = useMotion2(0)

    // When props.data.intervals change
    useInterval(() => {
        // Set up
        motionRotation.set(props.data.range * [-1, 1][math.random(0, 1)])
        motionRotation.spring(0, config.spring.wobbly)
    }, props.data.intervals || 1)

    return (
        <frame
            {...DefaultUIProperties}
            Rotation={rotation}
        >
            {props.children}
        </frame>
    )
}