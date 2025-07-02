-- Compiled with roblox-ts v3.0.0
-- will returnn if inpuut is a toucuh or a mouse buutton
local inputActivated = function(item)
	local allowedInput = { Enum.UserInputType.MouseButton1, Enum.UserInputType.MouseButton2, Enum.UserInputType.MouseButton3, Enum.UserInputType.Touch }
	-- returns if it is
	-- ▼ ReadonlyArray.find ▼
	local _callback = function(input)
		return item.UserInputType == input
	end
	local _result
	for _i, _v in allowedInput do
		if _callback(_v, _i - 1, allowedInput) == true then
			_result = _v
			break
		end
	end
	-- ▲ ReadonlyArray.find ▲
	return _result
end
return {
	inputActivated = inputActivated,
}
