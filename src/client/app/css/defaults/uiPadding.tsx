import React from "@rbxts/react";


export function DefaultPadding(props: React.InstanceProps<UIPadding>) {
    return <uipadding
        key="Padding"
        PaddingLeft={new UDim(.01, 0)}
        PaddingRight={new UDim(.01, 0)}
        PaddingTop={new UDim(.01, 0)}
        PaddingBottom={new UDim(.01, 0)}
        {...props}
    />
}