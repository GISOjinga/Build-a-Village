import { Janitor } from "@rbxts/janitor";
import React, { InstanceProps, ReactElement, ReactInstance, ReactNode, useEffect, useRef, useState } from "@rbxts/react";
import { Players, UserInputService } from "@rbxts/services";
import { useMotion2 } from "client/app/hooks/useMotion";
import { createInterval } from "shared/utils/functions/threadsFunctions";
import DefaultUIProperties from "../defaults/ui";


// variables
const player = Players.LocalPlayer
const mouse = player.GetMouse()

// the scrolling bar
export function HorizontalScrollingBar({ barState, children, buttonSize }: { children?: ReactNode, barState: UseState<number>, buttonSize?: UDim2 }) {
    const [percent, setPercent] = barState
    const [buttonPosition, motionPosition] = useMotion2(new UDim2(percent, 0, 0.5, 0));
    const [trackMouse, setTrackMouse] = useState(false)
    const barRef = useRef<Frame>()

    // watches if the track mouse changes
    useEffect(() => {
        const trash = new Janitor()
        const bar = barRef.current

        // mouse or touch is released
        if (trackMouse && bar) {
            trash.Add(createInterval(() => {
                const barYSize = bar.AbsoluteSize.X
                const barStartYPosition = bar.AbsolutePosition.X
                const mouseToBarDifference = math.clamp((mouse.X - barStartYPosition) / barYSize, 0, 1)

                // moves the button
                motionPosition.spring(UDim2.fromScale(mouseToBarDifference, .5))
            }, .1))
        }

        return () => trash.Destroy()
    }, [trackMouse])

    // for scrolling
    useEffect(() => {
        const trash = new Janitor()
        const amountToMoveBy = .2

        // when motion positio nchanges
        trash.Add(motionPosition.onStep((value) => setPercent(value.X.Scale)))

        // motions the position
        trash.Add(UserInputService.InputChanged.Connect((input, gameProcessed) => {
            // moves the mouse
            if (!gameProcessed && input.UserInputType === Enum.UserInputType.MouseWheel) {
                const percentage = math.clamp(buttonPosition.getValue().X.Scale - (input.Position.Z < 0 ? -amountToMoveBy : amountToMoveBy), 0, 1)

                // sets the bar
                motionPosition.spring(UDim2.fromScale(percentage, .5))
            }
        }))

        return () => trash.Destroy()
    }, [percent, trackMouse])



    return (
        <frame
            key="FakeScrollingFrame"
            ref={barRef}
            {...DefaultUIProperties}
        >
            <imagebutton
                {...DefaultUIProperties}
                key={"FakeScrollingFrame"}
                Size={buttonSize || new UDim2(.1, 0, 3, 0)}
                Position={buttonPosition}
                Event={{
                    InputBegan: (_, input) => {
                        if (input.UserInputType === Enum.UserInputType.Touch || input.UserInputType === Enum.UserInputType.MouseButton1) {
                            setTrackMouse(true)
                        }
                    },
                    InputEnded: (_, input) => {
                        if (input.UserInputType === Enum.UserInputType.Touch || input.UserInputType === Enum.UserInputType.MouseButton1) {
                            setTrackMouse(false)
                        }
                    }
                }}
            >
                {children}
            </imagebutton>
        </frame>
    )
}