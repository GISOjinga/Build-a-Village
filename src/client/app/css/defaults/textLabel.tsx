import React, { ReactNode } from "@rbxts/react";
import DefaultUIProperties from "./ui";
import { excludeProps } from "../../hooks/excludeProps";


// the default properties for a textlabel
const TextLabel: Partial<WritableInstanceProperties<TextLabel>> = {
    ...DefaultUIProperties,
    Size: UDim2.fromScale(.1, .1),
};

export const DefaultText = (props: React.InstanceProps<TextLabel>) => {
    return <textlabel
        key="Title"
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        Font={Enum.Font.SourceSansBold}
        Interactable={false}
        FontFace={Font.fromName("SourceSansPro", Enum.FontWeight.Bold, Enum.FontStyle.Normal)}
        Position={new UDim2(0.5, 0, 0.5, 0)}
        Size={new UDim2(0.5, 0, 0.5, 0)}
        Text={"Empty"}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        TextStrokeTransparency={0}
        TextWrapped={true}
        {...props}
    >
        <uipadding
            key="Padding"
            PaddingLeft={new UDim(.1, 0)}
            PaddingRight={new UDim(.1, 0)}
            PaddingTop={new UDim(.1, 0)}
            PaddingBottom={new UDim(.1, 0)}
        />
        <uistroke Thickness={2.5} />
    </textlabel>
}


export const NewText = (props: React.InstanceProps<TextLabel> & { children?: ReactNode }) => {
    return <textlabel
        key="Title"
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        Font={Enum.Font.SourceSansBold}
        Interactable={false}
        FontFace={Font.fromName("SourceSansPro", Enum.FontWeight.Bold, Enum.FontStyle.Normal)}
        Position={new UDim2(0.5, 0, 0.5, 0)}
        Size={new UDim2(1, 0, 1, 0)}
        Text={"Empty"}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        TextStrokeTransparency={0}
        TextWrapped={true}
        {...props}
    >
        {props.children}
    </textlabel>
}

export const DefaultNewText = (props: { text?: React.InstanceProps<TextLabel>, padding?: React.InstanceProps<UIPadding>, uiGradient?: React.InstanceProps<UIGradient>, children?: ReactNode, uistrokethickness?: number, uistrokecolor?: Color3 }) => {
    return <textlabel
        key="Title"
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        Font={Enum.Font.SourceSansBold}
        Interactable={false}
        FontFace={Font.fromName("SourceSansPro", Enum.FontWeight.Bold, Enum.FontStyle.Normal)}
        Position={new UDim2(0.5, 0, 0.5, 0)}
        Size={new UDim2(0.5, 0, 0.5, 0)}
        Text={"Empty"}
        TextColor3={Color3.fromRGB(255, 255, 255)}
        TextScaled={true}
        TextStrokeTransparency={0}
        TextWrapped={true}
        {...props.text}
    >
        {props.children}
        <uipadding
            key="Padding"
            PaddingLeft={new UDim(.1, 0)}
            PaddingRight={new UDim(.1, 0)}
            PaddingTop={new UDim(.1, 0)}
            PaddingBottom={new UDim(.1, 0)}
            {...props.padding}
        />
        <uistroke Thickness={props.uistrokethickness || 2.5} Color={props.uistrokecolor || Color3.fromRGB(0, 0, 0)} />
        <uigradient
            {...props.uiGradient}
        />
    </textlabel>
}


export default TextLabel;