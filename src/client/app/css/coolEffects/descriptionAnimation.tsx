import React, { Binding, InstanceProps, ReactChild, ReactInstance, ReactNode, useEffect, useMemo, useState } from "@rbxts/react";
import DefaultUIProperties from "../defaults/ui";
import { useMotion2 } from "../../hooks/useMotion";
import { Janitor } from "@rbxts/janitor";
import { createInterval, createTimeout } from "shared/utils/functions/threadsFunctions";
import Ripple, { config, spring, TweenOptions } from "@rbxts/ripple";
import Object from "@rbxts/object-utils";
import { excludeProps } from "../../hooks/excludeProps";
import { NewText } from "../defaults/textLabel";



// for description
export const DescriptionAnimation = {
    TypeWritter: (props: { play: boolean, textToShow: string, children?: ReactNode }) => {
        const restProps = excludeProps(props, ["play", "textToShow"])
        const [text, motionText] = useMotion2(0)


        useEffect(() => {
            const trash = new Janitor()

            if (props.play) {
                motionText.tween(props.textToShow.size(), { time: 2 })
            } else {
                motionText.tween(0, { time: .5 })
            }

            return () => trash.Destroy()
        }, [props.textToShow, props.play])

        return (
            <NewText
                {...DefaultUIProperties}
                {...restProps}
                Text={text.map((index) => props.textToShow.sub(0, math.floor(index)))}
            >
                {props.children}
            </NewText>
        )
    },
}
