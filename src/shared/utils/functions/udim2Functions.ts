


export function multiplyUdim2(udim: UDim2, multiplier: number) {
    return new UDim2(udim.X.Scale * multiplier, udim.X.Offset * multiplier, udim.Y.Scale * multiplier, udim.Y.Offset * multiplier)
}