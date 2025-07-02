-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local wallsData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "wallsData").default
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local _object = {
	Version = "0.0.0",
}
local _left = "Coins"
local _condition = paths.Assets.Villagers.Farmer:GetAttribute("Price")
if not (_condition ~= 0 and _condition == _condition and _condition) then
	_condition = 0
end
_object[_left] = _condition
_object.Villagers = {}
_object.Produce = {}
_object.Tutorial = 0
local _left_1 = "Walls"
local _object_1 = table.clone(wallsData[1])
setmetatable(_object_1, nil)
_object_1.Owned = true
_object_1.Equipped = true
_object[_left_1] = { _object_1 }
_object.PromoCodesRedeemed = {}
local defaultData = _object
--[[
	*
	 * Converts CFrame instances in VillagerData.RelativeLocation to string,
	 * replacing `undefined` with `undefined`.
	 
]]
local function encodePlayerData(data)
	local _object_2 = table.clone(data)
	setmetatable(_object_2, nil)
	local _left_2 = "Villagers"
	local _exp = data.Villagers
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#_exp)
	local _callback = function(v)
		local _object_3 = table.clone(v)
		setmetatable(_object_3, nil)
		_object_3.RelativeLocation = if v.RelativeLocation then tostring(v.RelativeLocation) else nil
		return _object_3
	end
	for _k, _v in _exp do
		_newValue[_k] = _callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.map ▲
	_object_2[_left_2] = _newValue
	return _object_2
end
--[[
	*
	 * Converts stringified CFrame back to actual CFrame.
	 * Roblox's CFrame constructor can parse strings.
	 
]]
local function decodePlayerData(encoded)
	local _object_2 = table.clone(encoded)
	setmetatable(_object_2, nil)
	local _left_2 = "Villagers"
	local _exp = encoded.Villagers
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#_exp)
	local _callback = function(v)
		local _object_3 = table.clone(v)
		setmetatable(_object_3, nil)
		local _left_3 = "RelativeLocation"
		local _result
		local _value = v.RelativeLocation
		if _value ~= "" and _value then
			local _exp_1 = string.split(v.RelativeLocation, ",")
			-- ▼ ReadonlyArray.map ▼
			local _newValue_1 = table.create(#_exp_1)
			local _callback_1 = function(val)
				return tonumber(val)
			end
			for _k, _v in _exp_1 do
				_newValue_1[_k] = _callback_1(_v, _k - 1, _exp_1)
			end
			-- ▲ ReadonlyArray.map ▲
			_result = CFrame.new(unpack(_newValue_1))
		else
			_result = nil
		end
		_object_3[_left_3] = _result
		return _object_3
	end
	for _k, _v in _exp do
		_newValue[_k] = _callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.map ▲
	_object_2[_left_2] = _newValue
	return _object_2
end
local default = defaultData
return {
	encodePlayerData = encodePlayerData,
	decodePlayerData = decodePlayerData,
	default = default,
}
