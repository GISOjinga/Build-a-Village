-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local gameSettings = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "gameSettings").default
local ShopData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "ShopData").default
local villagersShop = gameSettings.Shop.VillagerShop
local function getVillagersToRestock()
	local villagersToAdd = {}
	local allVillagers = ShopData.Villagers
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(villager)
		local rarity = villager.Rarity
		local appearChance = villagersShop.RarityAppearChance[rarity]
		-- If the villager is not in stock, check if it should be added
		if math.random(1, appearChance) == 1 then
			local _name = villager.Name
			table.insert(villagersToAdd, _name)
		end
	end
	for _k, _v in allVillagers do
		_callback(_v, _k - 1, allVillagers)
	end
	-- ▲ ReadonlyArray.forEach ▲
	return villagersToAdd
end
return {
	getVillagersToRestock = getVillagersToRestock,
}
