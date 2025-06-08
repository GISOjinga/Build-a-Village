import React, { useEffect, useState, useRef, ReactNode } from "@rbxts/react";
import DefaultUIProperties from "../defaults/ui";
import { Janitor } from "@rbxts/janitor";





// a scrolling frame
export function ScrollingContents({ children, barState, direction }: { children?: ReactNode, barState: UseState<number>, direction: "Horizontal" | "Vertical" }) {
    const scrollingFrameRef = useRef<ScrollingFrame>()
    const [percent, _] = barState
    const [canvasPosition, setCanvasPosition] = useState(Vector2.zero)
    const [maxAxisSize, setMaxAxisSize] = useState(0)

    // when ever the percent changes
    useEffect(() => {
        const trash = new Janitor()
        const scrollingFrame = scrollingFrameRef.current


        // if scrolling frame
        if (scrollingFrame) {

            // if the direction is horizontal
            if (direction === "Horizontal") {
                // set the canvas position
                setCanvasPosition(new Vector2(maxAxisSize * percent, 0))
            } else {
                // set the canvas position
                setCanvasPosition(new Vector2(0, maxAxisSize * percent))
            }
        }

        return () => trash.Destroy()
    }, [percent, maxAxisSize])


    // listens to when scrolling ref absolute size changes
    useEffect(() => {
        const trash = new Janitor()
        const scrollingFrame = scrollingFrameRef.current!

        // set frame size
        function setTheMax() {
            scrollingFrame.CanvasPosition = direction === "Horizontal" ? new Vector2(1e10, 0) : new Vector2(0, 1e10)
            setMaxAxisSize(scrollingFrame.CanvasPosition[direction === "Horizontal" ? "X" : "Y"])
            setCanvasPosition(direction === "Horizontal" ? new Vector2(0, 0.5) : new Vector2(.5, 0))
        }

        // if scrolling frame
        if (scrollingFrame) {
            // listens to when the scrolling frame changes
            trash.Add(scrollingFrame.GetPropertyChangedSignal("AbsoluteSize").Connect(setTheMax))

            // sets the max
            setTheMax()
        }


        return () => trash.Destroy()
    }, [])

    // returns the component
    return (
        <scrollingframe
            {...DefaultUIProperties}
            key="Items"
            AutomaticCanvasSize={Enum.AutomaticSize.X}
            CanvasSize={new UDim2(0, 0, 0, 0)}
            ClipsDescendants={true}
            ScrollBarImageTransparency={1}
            ScrollingEnabled={false}
            ref={scrollingFrameRef}
            CanvasPosition={canvasPosition}
            ScrollBarThickness={0}
        >
            <frame
                {...DefaultUIProperties}
                key="Holder"
                AnchorPoint={direction === "Horizontal" ? new Vector2(0, 0.5) : new Vector2(0.5, 0)}
                Position={direction === "Horizontal" ? UDim2.fromScale(0, 0.5) : UDim2.fromScale(0.5, 0)}
            >
                {children}
            </frame>
        </scrollingframe>
    )
}