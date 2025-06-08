import React, { Binding, InstanceProps, ReactNode, useEffect, useMemo, useState } from "@rbxts/react";
import DefaultUIProperties from "../defaults/ui";
import { useMotion2 } from "../../hooks/useMotion";
import Ripple, { config } from "@rbxts/ripple";
import { useInterval } from "@rbxts/pretty-react-hooks";



/**
 * A React component that creates a loading bar animation for a Roblox UI element.
 * The animation moves the UI element from left to right at a regular interval.
 *
 * @param props - The properties of the component.
 * @param props.children - The child elements to be rendered within the UI frame.
 * @param props.data - The data object containing the percentage of the loading bar.
 * @param props.data.percentage - The percentage of the loading bar.
 *
 * @returns - A React component that renders a UI frame with the specified loading bar animation.
 */
export function LoadingBar({ children, percentile, flipped }: { children: ReactNode, percentile: number | Binding<number>, flipped?: boolean }) {


    return (
        <frame
            {...DefaultUIProperties}
            AnchorPoint={new Vector2(0, 0.5)}
            Position={typeIs(percentile, "table") ? percentile.map((value) => new UDim2((flipped ? -1 : 1) * -(1 - value), 0, 0.5, 0)) : new UDim2(-(1 - percentile), 0, 0.5, 0)}
            ClipsDescendants={true}
        >
            <frame
                {...DefaultUIProperties}
                AnchorPoint={new Vector2(0, 0.5)}
                Position={typeIs(percentile, "table") ? percentile.map((value) => new UDim2((flipped ? -1 : 1) * (1 - value), 0, 0.5, 0)) : new UDim2((1 - percentile), 0, 0.5, 0)}
            >
                {children}
            </frame>
        </frame>
    )
}