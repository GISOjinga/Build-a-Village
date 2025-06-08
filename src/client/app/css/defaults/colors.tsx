import React from "@rbxts/react"

export const globalFont = {
    classic: Font.fromName("LegacyArial", Enum.FontWeight.Bold, Enum.FontStyle.Normal),
}

export const globalColors = {
    Red: Color3.fromRGB(254, 41, 23),
    Brown: Color3.fromRGB(204, 171, 100),
    Green: Color3.fromRGB(137, 204, 91),
}

// function to get the color as a sequence
const getColorSequence = (colors: [Color3, ...Color3[], Color3]) => {
    const realColors = [] as ColorSequenceKeypoint[];

    // shifts the array of colors
    colors.forEach((color, index) => {
        realColors.push(new ColorSequenceKeypoint(index / (colors.size() - 1), color))
    })

    // adds the last color to the end
    return realColors
}

export const DefaultAspectRatio = () => <uiaspectratioconstraint AspectRatio={1.75} />
export const DefaultUIGradient = {
    Custom: {
        Color: ({ colors, rotation }: { colors: [Color3, ...Color3[], Color3], rotation?: number }) => <uigradient Rotation={rotation || 90} Color={
            new ColorSequence(getColorSequence(colors))
        } />
    },
    Yellow: () => <uigradient Rotation={90} Color={
        new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(252, 231, 113)),
            new ColorSequenceKeypoint(.5, Color3.fromRGB(252, 231, 113)),
            new ColorSequenceKeypoint(.55, Color3.fromRGB(250, 212, 6)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(250, 212, 6))
        ])}
    />,
    GoldFade: () => <uigradient Rotation={90} Color={
        new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(255, 235, 130)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(255, 186, 0))
        ])}
    />,
    GreenFade: () => <uigradient Rotation={90} Color={
        new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(219, 255, 163)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(0, 255, 64))
        ])}
    />,
    RedFade: () => <uigradient Rotation={90} Color={
        new ColorSequence([
            new ColorSequenceKeypoint(0, Color3.fromRGB(255, 199, 199)),
            new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 0))
        ])}
    />,
}