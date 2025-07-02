-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- variables
local map = paths.Map
local characters = paths.Characters
local players = characters.Players
-- includes instances
local function rayParamsInclude(included)
	local rayParams = RaycastParams.new()
	rayParams.FilterType = Enum.RaycastFilterType.Include
	rayParams.FilterDescendantsInstances = included
	-- returns rayParams with included instances
	return rayParams
end
-- returns you the distance from ray and wether the point is within that radius
local function rayDistance(unitRay, point)
	local distanceFromRay = unitRay:Distance(point)
	local _origin = unitRay.Origin
	local _point = point
	local distanceFromOrigin = (_origin - _point).Magnitude
	-- if radius is provided then
	return {
		distanceFromRay = distanceFromRay,
		distanceFromOrigin = distanceFromOrigin,
	}
end
local _object = {}
local _left = "Include"
local _object_1 = {
	Map = rayParamsInclude(if map then { map } else {}),
}
local _left_1 = "Floors"
local _result
if map then
	local _exp = map.Platforms:GetChildren()
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#_exp)
	local _callback = function(child)
		return child:FindFirstChild("Floor")
	end
	for _k, _v in _exp do
		_newValue[_k] = _callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.map ▲
	-- ▼ ReadonlyArray.filterUndefined ▼
	local _length = 0
	for _i in _newValue do
		if _i > _length then
			_length = _i
		end
	end
	local _result_1 = {}
	local _resultLength = 0
	for _i = 1, _length do
		local _v = _newValue[_i]
		if _v ~= nil then
			_resultLength += 1
			_result_1[_resultLength] = _v
		end
	end
	-- ▲ ReadonlyArray.filterUndefined ▲
	_result = _result_1
else
	_result = {}
end
_object_1[_left_1] = rayParamsInclude(_result)
_object_1.Players = rayParamsInclude(if players then { players } else {})
_object[_left] = _object_1
local Raycast = _object
-- when ever a child gets added into platforms
local _exp = map.Platforms:GetChildren()
-- ▼ ReadonlyArray.forEach ▼
local _callback = function(platform)
	platform.ChildAdded:Connect(function(floor)
		if floor.Name == "Floor" then
			local _result_1
			if map then
				local _exp_1 = map.Platforms:GetChildren()
				-- ▼ ReadonlyArray.map ▼
				local _newValue = table.create(#_exp_1)
				local _callback_1 = function(child)
					return child:FindFirstChild("Floor")
				end
				for _k, _v in _exp_1 do
					_newValue[_k] = _callback_1(_v, _k - 1, _exp_1)
				end
				-- ▲ ReadonlyArray.map ▲
				-- ▼ ReadonlyArray.filterUndefined ▼
				local _length = 0
				for _i in _newValue do
					if _i > _length then
						_length = _i
					end
				end
				local _result_2 = {}
				local _resultLength = 0
				for _i = 1, _length do
					local _v = _newValue[_i]
					if _v ~= nil then
						_resultLength += 1
						_result_2[_resultLength] = _v
					end
				end
				-- ▲ ReadonlyArray.filterUndefined ▲
				_result_1 = _result_2
			else
				_result_1 = {}
			end
			Raycast.Include.Floors = rayParamsInclude(_result_1)
		end
	end)
end
for _k, _v in _exp do
	_callback(_v, _k - 1, _exp)
end
-- ▲ ReadonlyArray.forEach ▲
return {
	rayParamsInclude = rayParamsInclude,
	rayDistance = rayDistance,
	Raycast = Raycast,
}
