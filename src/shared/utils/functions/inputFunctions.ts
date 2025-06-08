

// will returnn if inpuut is a toucuh or a mouse buutton
export const inputActivated = (item: InputObject) => {
    const allowedInput = [
        Enum.UserInputType.MouseButton1,
        Enum.UserInputType.MouseButton2,
        Enum.UserInputType.MouseButton3,
        Enum.UserInputType.Touch
    ]

    // returns if it is
    return allowedInput.find((input) => item.UserInputType === input) 
}