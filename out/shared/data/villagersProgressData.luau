-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local villagersProgressData = {}
-- This is a placeholder for the villagers data.
local _exp = paths.Assets.Villagers:GetChildren()
-- ▼ ReadonlyArray.forEach ▼
local _callback = function(villager)
	local maxResources = #villager.Station.Parts.Resources:GetChildren()
	local requiredProduceName = villager:GetAttribute("RequiredProduceName")
	local _condition = villager:GetAttribute("RequiredProduceAmount")
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 0
	end
	local requiredAmount = _condition
	local _exp_1 = villager.Name
	local _object = {
		Produce = villager:GetAttribute("Produce") or "Bread",
	}
	local _left = "Required"
	local _condition_1 = requiredProduceName
	if _condition_1 ~= "" and _condition_1 then
		_condition_1 = requiredProduceName ~= "" and requiredAmount > 0
	end
	_object[_left] = if _condition_1 ~= "" and _condition_1 then {
		Produce = requiredProduceName,
		Amount = 0,
		Max = maxResources,
	} else nil
	local _left_1 = "Progression"
	local _object_1 = {}
	local _left_2 = "Time"
	local _object_2 = {}
	local _left_3 = "RequiredTimePerResource"
	local _condition_2 = villager:GetAttribute("RequiredTimePerResource")
	if not (_condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2) then
		_condition_2 = 10
	end
	_object_2[_left_3] = _condition_2
	_object_2.StartTime = 0
	_object_1[_left_2] = _object_2
	_object_1.Resources = {}
	_object[_left_1] = _object_1
	_object.Building = {
		StartTime = 0,
		TotalTime = 0,
	}
	villagersProgressData[_exp_1] = _object
end
for _k, _v in _exp do
	_callback(_v, _k - 1, _exp)
end
-- ▲ ReadonlyArray.forEach ▲
local default = villagersProgressData
return {
	default = default,
}
