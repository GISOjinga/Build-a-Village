-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local atom = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "charm", "src").atom
local robuxStoreData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "robuxStoreData").default
local pageStates = {
	placementRotationOffset = atom(0),
	placeVillager = atom(false),
	digVillager = atom(false),
	openPage = atom("None"),
	confirmPrompt = atom({
		title = "",
		message = "",
	}),
	productToGift = atom(nil),
	villagersShop = atom({}),
	wallsShop = atom({}),
	robuxStore = atom(robuxStoreData),
	buyButtonFocus = atom({
		visible = false,
		selectedVillagerIndex = -1,
	}),
	totalTimeForNewVillager = atom(0),
	hoverInfo = atom({
		visible = false,
		info = "",
	}),
	queueInfo = atom(""),
	introText = atom({
		text = "Welcome to the game!",
		duration = 2,
	}),
	npcDialogue = atom({
		target = "None",
		text = "",
	}),
	coins = atom(0),
	friendsBonus = atom(false),
}
local default = pageStates
return {
	default = default,
}
