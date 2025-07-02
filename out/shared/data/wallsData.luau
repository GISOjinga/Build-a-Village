-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local wallsData = {}
-- This is a placeholder for the villagers data.
local _exp = paths.Assets.Walls:GetChildren()
-- ▼ ReadonlyArray.forEach ▼
local _callback = function(wall)
	local _object = {
		Name = wall.Name,
	}
	local _left = "Description"
	local _condition = wall:GetAttribute("Description")
	if not (_condition ~= "" and _condition) then
		_condition = ""
	end
	_object[_left] = _condition
	local _left_1 = "Price"
	local _condition_1 = wall:GetAttribute("Price")
	if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
		_condition_1 = 0
	end
	_object[_left_1] = _condition_1
	local _left_2 = "Image"
	local _condition_2 = wall:GetAttribute("Image")
	if not (_condition_2 ~= "" and _condition_2) then
		_condition_2 = "rbxassetid://1234567890"
	end
	_object[_left_2] = _condition_2
	local _left_3 = "GamePassId"
	local _condition_3 = wall:GetAttribute("GamePassId")
	if not (_condition_3 ~= 0 and _condition_3 == _condition_3 and _condition_3) then
		_condition_3 = 0
	end
	_object[_left_3] = _condition_3
	local _left_4 = "CashMultiplier"
	local _condition_4 = wall:GetAttribute("CashMultiplier")
	if not (_condition_4 ~= 0 and _condition_4 == _condition_4 and _condition_4) then
		_condition_4 = 1
	end
	_object[_left_4] = _condition_4
	_object.Rarity = wall:GetAttribute("Rarity") or "Common"
	_object.Owned = false
	_object.Equipped = false
	table.insert(wallsData, _object)
end
for _k, _v in _exp do
	_callback(_v, _k - 1, _exp)
end
-- ▲ ReadonlyArray.forEach ▲
local default = wallsData
return {
	default = default,
}
