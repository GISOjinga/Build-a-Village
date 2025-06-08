import React from "@rbxts/react";


// the default properties for a gui object
const DefaultUIProperties: Partial<WritableInstanceProperties<GuiObject>> = {
    AnchorPoint: new Vector2(.5, .5),
    BackgroundTransparency: 1,
    Size: UDim2.fromScale(1, 1),
    Position: UDim2.fromScale(.5, .5),
    BackgroundColor3: Color3.fromRGB(255, 255, 255),
    BorderSizePixel: 0,
};


// the default properties for a gui object
export const DefaultImageProperties: Partial<WritableInstanceProperties<ImageLabel>> = {
    ...DefaultUIProperties,
    ScaleType: Enum.ScaleType.Fit
};


export const DefaultGridProperties: Partial<WritableInstanceProperties<UIGridLayout>> = {
    FillDirection: Enum.FillDirection.Horizontal,
    FillDirectionMaxCells: 4,
    CellSize: new UDim2(0.1, 0, .1, 0),
    SortOrder: Enum.SortOrder.LayoutOrder
};


export default DefaultUIProperties;