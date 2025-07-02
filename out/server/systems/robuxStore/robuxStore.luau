-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local MarketplaceService = _services.MarketplaceService
local Players = _services.Players
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local robuxStoreData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "robuxStoreData").default
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local ShopData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "ShopData").default
local useEvent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useEvent
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local removeComponent = _jecsHelpFunctions.removeComponent
local printTS = _jecsHelpFunctions.printTS
local addComponent = _jecsHelpFunctions.addComponent
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local GiftTo = _jecsComponents.GiftTo
local Player = _jecsComponents.Player
local Data = _jecsComponents.Data
local _analytics = TS.import(script, game:GetService("ServerScriptService"), "TS", "utils", "analytics")
local logVillagerPurchase = _analytics.logVillagerPurchase
local logTutorialStep = _analytics.logTutorialStep
local TutorialStep = _analytics.TutorialStep
local WEEK_LENGTH = 7 * 24 * 60 * 60
local function getWeeklySeed()
	return math.floor(os.time() / WEEK_LENGTH)
end
local function chooseVillagers(rng, count)
	local _exp = ShopData.Villagers
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#_exp)
	local _callback = function(v)
		return v.Name
	end
	for _k, _v in _exp do
		_newValue[_k] = _callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.map ▲
	local pool = _newValue
	local result = {}
	while #result < count do
		local idx = rng:NextInteger(1, #pool) - 1
		local name = pool[idx + 1]
		if not (table.find(result, name) ~= nil) then
			table.insert(result, name)
		end
	end
	return result
end
local currentSeed = 0
-- helper to find purchase info by productId
local function findPurchaseByProduct(productId)
	for purchaseName, purchase in pairs(robuxStoreData) do
		if purchase.ProductId == productId then
			return {
				purchaseName = purchaseName,
				purchase = purchase,
			}
		end
	end
	return nil
end
local default = function(world)
	local seed = getWeeklySeed()
	if seed ~= currentSeed then
		currentSeed = seed
		local starterRng = Random.new(seed + 142)
		local launchRng = Random.new(seed + 532)
		robuxStoreData.StarterPack.Villagers = chooseVillagers(starterRng, 3)
		robuxStoreData.LaunchPack.Villagers = chooseVillagers(launchRng, 5)
		robuxStoreData.StarterPack.Coins = starterRng:NextInteger(1000, 5000)
		routes.updateRobuxStore.sendToAll(robuxStoreData)
	end
	for _, player in world:query(Added(Player)) do
		routes.updateRobuxStore.sendTo(robuxStoreData, player)
	end
	-- handle client requests to buy a pack
	useRoute(routes.buyRobuxPack, function(_param, player)
		local purchase = _param.purchase
		local purchaseData = robuxStoreData[purchase]
		if purchaseData then
			MarketplaceService:PromptProductPurchase(player, purchaseData.ProductId)
		end
	end)
	-- handle completed purchases
	for _binding in useEvent(MarketplaceService.PromptProductPurchaseFinished) do
		local _userId = _binding[1]
		local productId = _binding[2]
		local wasPurchased = _binding[3]
		local player = Players:GetPlayerByUserId(_userId)
		local playerEntity = player and getEntity.fromInstance(player)
		local info = findPurchaseByProduct(productId)
		if not player or not (playerEntity ~= 0 and playerEntity == playerEntity and playerEntity) or not info then
			continue
		end
		if wasPurchased then
			routes.playSound.sendTo({
				sound = paths.SFX.UI.purchasepass,
				position = nil,
			}, player)
			local targetPlayer = player
			local targetEntity = playerEntity
			local giftTo = world:get(playerEntity, GiftTo)
			if giftTo then
				local giftPlayer = giftTo.target
				local _object = table.clone(giftTo)
				setmetatable(_object, nil)
				_object.gifted = true
				addComponent(playerEntity, GiftTo, _object)
				removeComponent(playerEntity, GiftTo)
				if giftPlayer.Parent then
					routes.notify.sendTo({
						text = `{player.Name} has gifted you!`,
						duration = 5,
					}, giftPlayer)
					routes.notify.sendTo({
						text = `You have gifted {giftPlayer.Name}!`,
						duration = 5,
					}, player)
					targetPlayer = giftPlayer
					targetEntity = getEntity.fromInstance(giftPlayer)
				end
			end
			if targetEntity ~= 0 and targetEntity == targetEntity and targetEntity then
				local playerData = world:get(targetEntity, Data)
				for _, villager in info.purchase.Villagers do
					local _owned = playerData
					if _owned ~= nil then
						local _exp = _owned.Villagers
						-- ▼ ReadonlyArray.some ▼
						local _result = false
						local _callback = function(v)
							return v.Name == villager
						end
						for _k, _v in _exp do
							if _callback(_v, _k - 1, _exp) then
								_result = true
								break
							end
						end
						-- ▲ ReadonlyArray.some ▲
						_owned = _result
					end
					local owned = _owned
					createEntity.inventoryVillager(targetEntity, villager)
					if not owned then
						logVillagerPurchase(targetPlayer, villager)
						if villager == "Farmer" and playerData and playerData.Tutorial == 0 then
							logTutorialStep(targetPlayer, TutorialStep.FarmerBought, "tutorial_farmer_bought")
						end
					end
				end
				local starter = info.purchase
				local _value = starter.Coins
				if _value ~= 0 and _value == _value and _value then
					createEntity.updateData(targetEntity, function(old)
						local _condition = starter.Coins
						if not (_condition ~= 0 and _condition == _condition and _condition) then
							_condition = 0
						end
						old.Coins += math.floor(_condition + .5)
						return old
					end)
				end
				printTS(121, `{targetPlayer.Name} received pack`, info.purchaseName)
			end
		else
			routes.playSound.sendTo({
				sound = paths.SFX.UI.purchasefail,
				position = nil,
			}, player)
			removeComponent(playerEntity, GiftTo)
		end
	end
end
return {
	default = default,
}
