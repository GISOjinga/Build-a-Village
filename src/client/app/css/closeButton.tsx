import { multiplyUdim2 } from "shared/utils/functions/udim2Functions";
import { NewElasticButton } from "./coolEffects/expandingButton";
import { NewText } from "./defaults/textLabel";
import React from "@rbxts/react";
import { useRootProducer } from "../../../shared/utils/producers";
import DefaultUIProperties from "./defaults/ui";
import { DefaultUIGradient } from "./defaults/colors";



export function CloseButton() {
    const normalSize = UDim2.fromScale(1, 1)
    const expandedSize = multiplyUdim2(normalSize, 1.1)
    const deExpandedSize = multiplyUdim2(normalSize, .9)
    const { togglePages } = useRootProducer()


    return (
        <NewElasticButton
            key={"Close Button"}
            tween={{
                expanded: expandedSize,
                unexpanded: deExpandedSize,
            }}
            events={{
                activated: () => togglePages("None")
            }}
        >
            <frame
                {...DefaultUIProperties}
                BackgroundTransparency={0}
            >
                <DefaultUIGradient.RedFade />
                <uistroke Thickness={3} Color={Color3.fromRGB(31, 0, 28)} />
                <uicorner CornerRadius={new UDim(.1, 0)} />
                <NewText Text={"X"} />
            </frame>
        </NewElasticButton>
    )
}