-- Compiled with roblox-ts v3.0.0
local WEEK_LENGTH = 7 * 24 * 60 * 60
local robuxStoreData = {
	StarterPack = {
		Name = "Starter Pack",
		ProductId = 3319212062,
		Coins = 1000,
		Villagers = { "Farmer", "Miner", "Baker" },
	},
	LaunchPack = {
		Name = "Launch Pack",
		ProductId = 3319212063,
		Villagers = { "Carpenter", "Mason", "Tailor", "Blacksmith", "Blacksmith" },
	},
}
local default = robuxStoreData
return {
	WEEK_LENGTH = WEEK_LENGTH,
	default = default,
}
