import React, { cloneElement, Element, PropsWithoutRef, ReactChild, ReactElement, ReactNode, useEffect, useMemo } from "@rbxts/react";
import Ripple, { config } from "@rbxts/ripple";
import DefaultUIProperties from "../defaults/ui";
import { useMotion2 } from "../../hooks/useMotion";
import Object from "@rbxts/object-utils";
import { excludeProps } from "../../hooks/excludeProps";
import { Janitor } from "@rbxts/janitor";
import { createTimeout } from "shared/utils/functions/threadsFunctions";
import { UserInputService } from "@rbxts/services";

// functionality type
type functionality = {
    MouseEnter?: () => void,
    MouseLeave?: () => void,
    Activated?: () => void,
    MouseButton1Click?: () => void,
}


// export function NewElasticButton2(props: { children: InstanceProps<ImageButton> }) {
//     const imageButton = props.children
//     // plays bulge when called
//     useEffect(() => {
//         const trash = new Janitor();

//         print(props.children)
//         return () => trash.Destroy();
//     }, []);

//     // Define the event handler for the child
//     const handleMouseClick = () => {
//         print("Child button was clicked!");
//     };

//     imageButton.props = {
//         ...imageButton.props,
//         Event: {
//             MouseButton1Click: handleMouseClick,
//         },
//     }

//     return props.children;
// }

export function NewElasticButton(props: Partial<WritableInstanceProperties<ImageButton>> & { children?: ReactNode, tween: { expanded: UDim2, unexpanded: UDim2, onlyHover?: boolean }, events?: BindedFunctionAnimation, playBuldge?: boolean }) {
    const restProps = excludeProps(props, ["tween", "events", "playBuldge"])
    const tweenInfo = { time: 1, style: Enum.EasingStyle.Elastic, direction: Enum.EasingDirection.Out }
    const realSize = useMemo(() => props?.Size || UDim2.fromScale(1, 1), [])
    const expandedSize = props.tween.expanded
    const deExpandedSize = props.tween.unexpanded
    const [size, motionSize] = useMotion2(realSize)

    // plays buldge when called
    useEffect(() => {
        const trash = new Janitor()

        // plays the buldge
        if (props.playBuldge) {
            motionSize.tween(expandedSize, tweenInfo)
            trash.Add(motionSize.onComplete(() => {
                trash.Add(createTimeout(() => motionSize.tween(realSize, tweenInfo), 3))
            }))
        } else {
            motionSize.tween(realSize, tweenInfo)
        }


        return () => trash.Destroy()
    }, [props.playBuldge])
    return (
        <imagebutton
            {...DefaultUIProperties}
            {...restProps}
            Size={size}
            Event={{
                MouseEnter: () => {
                    motionSize.tween(expandedSize, tweenInfo)
                    props.events?.mouseEnter?.()
                },
                MouseLeave: () => {
                    motionSize.tween(realSize, tweenInfo)
                    props.events?.mouseExit?.()
                },


                InputBegan: props.tween.onlyHover ? undefined : (_, input) => {
                    if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) {
                        motionSize.tween(deExpandedSize, tweenInfo)
                    }
                },

                InputEnded: props.tween.onlyHover ? undefined : (_, input) => {
                    if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) {
                        motionSize.tween(realSize, tweenInfo)
                        // props.events?.activated?.()
                    }
                },

                MouseButton1Click: () => {
                    if (UserInputService.TouchEnabled) return
                    props.events?.activated?.()
                },

                TouchTap: () => {
                    props.events?.activated?.()
                }
            }}
        >
            {props.children}
        </imagebutton>
    )
}


export function NewElasticTextButton(props: Partial<WritableInstanceProperties<TextButton>> & { Text: string, children?: ReactNode, tween: { expand: UDim2, unexpanded: UDim2, onlyHover?: boolean }, events?: BindedFunctionAnimation, playBuldge?: boolean }) {
    const restProps = excludeProps(props, ["tween", "events", "playBuldge"])
    const tweenInfo = { time: 1, style: Enum.EasingStyle.Elastic, direction: Enum.EasingDirection.Out }
    const realSize = useMemo(() => props?.Size || UDim2.fromScale(1, 1), [])
    const expandedSize = props.tween.expand
    const deExpandedSize = props.tween.unexpanded
    const [size, motionSize] = useMotion2(realSize)

    // plays buldge when called
    useEffect(() => {
        const trash = new Janitor()

        // plays the buldge
        if (props.playBuldge) {
            motionSize.tween(expandedSize, tweenInfo)
            trash.Add(motionSize.onComplete(() => {
                trash.Add(createTimeout(() => motionSize.tween(realSize, tweenInfo), 3))
            }))
        } else {
            motionSize.tween(realSize, tweenInfo)
        }


        return () => trash.Destroy()
    }, [props.playBuldge])
    return (
        <textbutton
            {...DefaultUIProperties}
            {...restProps}
            Size={size}
            Text={props.Text}
            Event={{
                MouseEnter: () => {
                    motionSize.tween(expandedSize, tweenInfo)
                    props.events?.mouseEnter?.()
                },
                MouseLeave: () => {
                    motionSize.tween(realSize, tweenInfo)
                    props.events?.mouseExit?.()
                },


                InputBegan: props.tween.onlyHover ? undefined : (_, input) => {
                    if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) {
                        motionSize.tween(deExpandedSize, tweenInfo)
                    }
                },

                InputEnded: props.tween.onlyHover ? undefined : (_, input) => {
                    if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) {
                        motionSize.set(expandedSize)
                        motionSize.tween(realSize, tweenInfo)
                        // props.events?.activated?.()
                    }
                },

                MouseButton1Click: () => {
                    if (UserInputService.TouchEnabled) return
                    props.events?.activated?.()
                },

                TouchTap: () => {
                    props.events?.activated?.()
                }
            }}
        >
            {props.children}
        </textbutton>
    )
}



// const button elasticity
export function elasticButton(functionality: functionality, motion: Ripple.Motion<UDim2>, regularSize: UDim2, overSize: UDim2, tween?: Ripple.TweenOptions) {
    const realTween = { ...{ time: 1, style: Enum.EasingStyle.Elastic }, ...tween }


    return {
        ...functionality, ...{
            MouseEnter: () => { motion.tween(overSize, realTween); functionality.MouseEnter?.() },
            MouseLeave: () => { motion.tween(regularSize, realTween); functionality.MouseLeave?.() },
            Activated: () => {
                motion.set(regularSize)
                motion.tween(overSize, realTween)
                functionality.Activated?.()
            }
        }
    }
}


// const button elasticity
export function elasticHoverButton(functionality: functionality, motion: Ripple.Motion<UDim2>, regularSize: UDim2, overSize: UDim2, tween?: Ripple.TweenOptions) {
    const realTween = { ...{ time: 1, style: Enum.EasingStyle.Elastic }, ...tween }


    return {
        ...functionality, ...{
            MouseEnter: () => { motion.tween(overSize, realTween); functionality.MouseEnter?.() },
            MouseLeave: () => { motion.tween(regularSize, realTween); functionality.MouseLeave?.() },
        }
    }
}


// const button elasticity
export function elasticClickButton(functionality: functionality, motion: Ripple.Motion<UDim2>, regularSize: UDim2, overSize: UDim2, tween?: Ripple.TweenOptions) {
    const realTween = { ...{ time: 1, style: Enum.EasingStyle.Elastic }, ...tween }


    return {
        ...functionality, ...{
            Activated: () => {
                motion.set(overSize)
                motion.tween(regularSize, realTween)
                functionality.Activated?.()
            }
        }
    }
}