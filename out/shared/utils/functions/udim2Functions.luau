-- Compiled with roblox-ts v3.0.0
local function multiplyUdim2(udim, multiplier)
	return UDim2.new(udim.X.Scale * multiplier, udim.X.Offset * multiplier, udim.Y.Scale * multiplier, udim.Y.Offset * multiplier)
end
return {
	multiplyUdim2 = multiplyUdim2,
}
