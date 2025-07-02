-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local villagersData = {}
local sellPricesData = {}
-- This is a placeholder for the villagers data.
local _exp = paths.Assets.Villagers:GetChildren()
-- ▼ ReadonlyArray.forEach ▼
local _callback = function(villager)
	if villager.Name == "VillagerExample" then
		return nil
	end
	local _condition = villager:GetAttribute("Price")
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 0
	end
	local sellPrice = _condition
	sellPricesData[villager.Name] = sellPrice
	local _object = {
		Name = villager.Name,
		Price = sellPrice,
		InStock = 0,
	}
	local _left = "Image"
	local _condition_1 = villager:GetAttribute("Image")
	if not (_condition_1 ~= "" and _condition_1) then
		_condition_1 = ""
	end
	_object[_left] = _condition_1
	local _left_1 = "Description"
	local _condition_2 = villager:GetAttribute("Description")
	if not (_condition_2 ~= "" and _condition_2) then
		_condition_2 = ""
	end
	_object[_left_1] = _condition_2
	_object.Rarity = villager:GetAttribute("Rarity") or "Common"
	local _left_2 = "Tier"
	local _condition_3 = villager:GetAttribute("Tier")
	if not (_condition_3 ~= 0 and _condition_3 == _condition_3 and _condition_3) then
		_condition_3 = 1
	end
	_object[_left_2] = _condition_3
	local _left_3 = "ProductId"
	local _condition_4 = villager:GetAttribute("ProductId")
	if not (_condition_4 ~= 0 and _condition_4 == _condition_4 and _condition_4) then
		_condition_4 = 0
	end
	_object[_left_3] = _condition_4
	table.insert(villagersData, _object)
end
for _k, _v in _exp do
	_callback(_v, _k - 1, _exp)
end
-- ▲ ReadonlyArray.forEach ▲
-- loops through tools in assets to set the sell prices
local _exp_1 = paths.Assets.Tools.Produce:GetChildren()
-- ▼ ReadonlyArray.forEach ▼
local _callback_1 = function(tool)
	local _condition = tool:GetAttribute("Price")
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 0
	end
	sellPricesData[tool.Name] = _condition
end
for _k, _v in _exp_1 do
	_callback_1(_v, _k - 1, _exp_1)
end
-- ▲ ReadonlyArray.forEach ▲
-- sorts them by price
table.sort(villagersData, function(a, b)
	return a.Price < b.Price
end)
local default = {
	Villagers = villagersData,
	SellPrice = sellPricesData,
}
return {
	default = default,
}
