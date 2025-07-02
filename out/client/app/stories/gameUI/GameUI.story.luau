-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local GameUI = TS.import(script, script.Parent.Parent.Parent, "GameUI").default
local pagePaths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pagePaths").default
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
-- return the controller
return function(gameUI)
	local trash = Janitor.new()
	-- Create a root for the frame
	local _exp = paths.Assets.UI.GameUI:GetChildren()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(child)
		local _exp_1 = child:Clone()
		_exp_1.Parent = gameUI
		return _exp_1.Parent
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
	trash:Add(GameUI(pagePaths(gameUI)))
	-- adds in some fake data
	pageStates.villagersShop(function(oldVillagersShop)
		local _array = {}
		local _length = #_array
		local _oldVillagersShopLength = #oldVillagersShop
		table.move(oldVillagersShop, 1, _oldVillagersShopLength, _length + 1, _array)
		_length += _oldVillagersShopLength
		_array[_length + 1] = {
			Name = "Blacksmith",
			Price = 100,
			InStock = 10,
			Image = "rbxassetid://112646206830150",
			Description = "A friendly villager.",
			Rarity = "Common",
			ProductId = 3308078109,
			Tier = 1,
		}
		_array[_length + 2] = {
			Name = "Blacksmith",
			Price = 200,
			Robux = 20,
			InStock = 10,
			Image = "rbxassetid://112646206830150",
			Description = "A friendly villager.",
			Rarity = "Common",
			ProductId = 3308077941,
			Tier = 1,
		}
		return _array
	end)
	--We need to return another function to unmount the handle
	return function()
		trash:Destroy()
	end
end
