-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local AnalyticsService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").AnalyticsService
local printTS = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").printTS
local TutorialStep
do
	local _inverse = {}
	TutorialStep = setmetatable({}, {
		__index = _inverse,
	})
	TutorialStep.Start = 1
	_inverse[1] = "Start"
	TutorialStep.ShopOpened = 2
	_inverse[2] = "ShopOpened"
	TutorialStep.FarmerBought = 3
	_inverse[3] = "FarmerBought"
	TutorialStep.FarmerPlaced = 4
	_inverse[4] = "FarmerPlaced"
	TutorialStep.WheatCollected = 5
	_inverse[5] = "WheatCollected"
	TutorialStep.WheatSold = 6
	_inverse[6] = "WheatSold"
end
local function logTutorialStep(player, step, name)
	printTS(15, `Logging tutorial step: {step} for player: {player.Name} ({player.UserId}) with name: {name}`)
	AnalyticsService:LogOnboardingFunnelStepEvent(player, step, name)
end
local villagerOrder = {
	Farmer = 1,
	Miner = 2,
	Shepherd = 3,
	Mason = 4,
	Woodsman = 5,
	Baker = 6,
	Gatherer = 7,
	Carpenter = 8,
	Blacksmith = 9,
	Scribe = 10,
	Tailor = 11,
	Alchemist = 12,
	Beekeeper = 13,
	Sculptor = 14,
	Witch = 15,
}
local function logVillagerPurchase(player, villager)
	local step = villagerOrder[villager]
	if step ~= 0 and step == step and step then
		local session = `{player.UserId}`
		AnalyticsService:LogFunnelStepEvent(player, "VillagerPurchase", session, step, villager)
	end
end
return {
	logTutorialStep = logTutorialStep,
	logVillagerPurchase = logVillagerPurchase,
	TutorialStep = TutorialStep,
}
