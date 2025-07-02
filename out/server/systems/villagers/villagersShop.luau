-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local useEvent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useEvent
local ShopData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "ShopData").default
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local Body = _jecsComponents.Body
local Data = _jecsComponents.Data
local FriendsBonus = _jecsComponents.FriendsBonus
local GiftTo = _jecsComponents.GiftTo
local Player = _jecsComponents.Player
local ProduceAll = _jecsComponents.ProduceAll
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local removeComponent = _jecsHelpFunctions.removeComponent
local warnTS = _jecsHelpFunctions.warnTS
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local MarketplaceService = _services.MarketplaceService
local Players = _services.Players
local getVillagersToRestock = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "villagerAlgorithim").getVillagersToRestock
local _analytics = TS.import(script, game:GetService("ServerScriptService"), "TS", "utils", "analytics")
local logTutorialStep = _analytics.logTutorialStep
local TutorialStep = _analytics.TutorialStep
local logVillagerPurchase = _analytics.logVillagerPurchase
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local deepCopy = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepCopy
local timeTillRestock = os.time() + 5 * 60
local getPlayersStock, updatePlayersStock
local takeVillagerFromStock = function(villagerName, player)
	local villagersShopData = getPlayersStock(player)
	-- ▼ ReadonlyArray.findIndex ▼
	local _callback = function(villager)
		return villager.Name == villagerName
	end
	local _result = -1
	for _i, _v in villagersShopData do
		if _callback(_v, _i - 1, villagersShopData) == true then
			_result = _i - 1
			break
		end
	end
	-- ▲ ReadonlyArray.findIndex ▲
	local villagerIndex = _result
	local villagerData = villagersShopData[villagerIndex + 1]
	-- if the villager is in stock then take from stock
	if villagerData.InStock > 0 then
		updatePlayersStock(function(stock)
			local _object = table.clone(stock[villagerIndex + 1])
			setmetatable(_object, nil)
			_object.InStock = stock[villagerIndex + 1].InStock - 1
			stock[villagerIndex + 1] = _object
			return stock
		end, player)
		return true
	end
	-- if not in stock then return false
	return false
end
-- a maping of a players stock
local _playerStock = setmetatable({}, {
	__mode = "k",
})
-- to update stock
function updatePlayersStock(updateFunc, player)
	local newStock = updateFunc(getPlayersStock(player))
	local _player = player
	_playerStock[_player] = newStock
	routes.updateVillagersShop.sendTo(newStock, player)
end
-- get a read only version of the player stock
function getPlayersStock(player)
	local _player = player
	if not (_playerStock[_player] ~= nil) then
		local villagersToRestock = getVillagersToRestock()
		local _player_1 = player
		local _arg1 = deepCopy(ShopData.Villagers)
		_playerStock[_player_1] = _arg1
		updatePlayersStock(function(stock)
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(villager)
				-- ▼ ReadonlyArray.findIndex ▼
				local _callback_1 = function(v)
					return v == villager.Name
				end
				local _result = -1
				for _i, _v in villagersToRestock do
					if _callback_1(_v, _i - 1, villagersToRestock) == true then
						_result = _i - 1
						break
					end
				end
				-- ▲ ReadonlyArray.findIndex ▲
				villager.InStock = if _result ~= -1 then 20 else 0
			end
			for _k, _v in stock do
				_callback(_v, _k - 1, stock)
			end
			-- ▲ ReadonlyArray.forEach ▲
			return stock
		end, player)
	end
	local _player_1 = player
	return _playerStock[_player_1]
end
local default = function(world)
	-- if the restock total time is 0 or less than 0 then restock a random villager
	if (timeTillRestock - os.time()) <= 0 then
		local villagersToRestock = getVillagersToRestock()
		-- sets the time till restock to the current time + the random time
		timeTillRestock = os.time() + 5 * 60
		-- loops through all the player stocks and update their stocks to max
		local _exp = Players:GetPlayers()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(player)
			updatePlayersStock(function(stock)
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_1 = function(villager)
					-- ▼ ReadonlyArray.findIndex ▼
					local _callback_2 = function(v)
						return v == villager.Name
					end
					local _result = -1
					for _i, _v in villagersToRestock do
						if _callback_2(_v, _i - 1, villagersToRestock) == true then
							_result = _i - 1
							break
						end
					end
					-- ▲ ReadonlyArray.findIndex ▲
					villager.InStock = if _result ~= -1 then 20 else 0
				end
				for _k, _v in stock do
					_callback_1(_v, _k - 1, stock)
				end
				-- ▲ ReadonlyArray.forEach ▲
				return stock
			end, player)
			routes.updateRestockTime.sendTo(timeTillRestock, player)
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	-- when ever a player gets added sends out the villagers
	for _, player in world:query(Added(Player)) do
		getPlayersStock(player)
		routes.updateRestockTime.sendTo(timeTillRestock, player)
	end
	-- when ever gift to is called
	useRoute(routes.shopGiftTo, function(playerToGiftTo, player)
		local playerEntity = getEntity.fromInstance(player)
		-- if data then
		if playerEntity ~= 0 and playerEntity == playerEntity and playerEntity then
			addComponent(playerEntity, GiftTo, {
				target = playerToGiftTo,
				gifted = false,
			})
			printJecs(100, player.Name .. " is gifting through shop to", playerToGiftTo.Name)
		end
	end)
	-- when handToolToPlayer is called
	useRoute(routes.giftToPlayer, function(_param, playerGifting)
		local playerToGift = _param.playerToGift
		local produceTool = _param.produceTool
		local playerEntity = getEntity.fromInstance(playerGifting)
		local playerToGiftToEntity = getEntity.fromInstance(playerToGift)
		local _tooType = produceTool
		if _tooType ~= nil then
			_tooType = _tooType:GetAttribute("ItemType")
		end
		local tooType = _tooType
		local _itemName = produceTool
		if _itemName ~= nil then
			_itemName = _itemName:GetAttribute("ItemName")
		end
		local itemName = _itemName
		local _itemVariant = produceTool
		if _itemVariant ~= nil then
			_itemVariant = _itemVariant:GetAttribute("ItemVariant")
		end
		local itemVariant = _itemVariant
		-- if data then
		local _condition = playerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = itemVariant
			if _condition then
				_condition = playerToGiftToEntity
				if _condition ~= 0 and _condition == _condition and _condition then
					_condition = (tooType == "Commodity")
				end
			end
		end
		if _condition then
			-- adds a confirmation prompt to the player to gift to
			createEntity.confirmationPrompt(playerToGiftToEntity, "Gift From " .. `[{playerGifting.Name}]`, tostring(itemName) .. `[{itemVariant}]`, function()
				-- updates playerGifting data
				createEntity.updateData(playerEntity, function(oldData)
					if tooType == "Commodity" then
						local _exp = oldData.Produce
						-- ▼ ReadonlyArray.findIndex ▼
						local _callback = function(p)
							return p.Name == itemName and p.Variant == itemVariant
						end
						local _result = -1
						for _i, _v in _exp do
							if _callback(_v, _i - 1, _exp) == true then
								_result = _i - 1
								break
							end
						end
						-- ▲ ReadonlyArray.findIndex ▲
						local produceIndex = _result
						-- if not produce index
						if produceIndex == -1 then
							routes.notify.sendTo({
								text = `Could not find {itemName} ({itemVariant}) in your inventory.`,
								duration = 5,
							}, playerGifting)
							routes.notify.sendTo({
								text = `{playerGifting.Name} tried to gift you {itemName} but they don't have it.`,
								duration = 5,
							}, playerToGift)
							return oldData
						else
							-- retuces it by 1
							oldData.Produce[produceIndex + 1].Amount -= 1
							if oldData.Produce[produceIndex + 1].Amount <= 0 then
								local _exp_1 = oldData.Produce
								-- ▼ ReadonlyArray.filter ▼
								local _newValue = {}
								local _callback_1 = function(p)
									return p.Name ~= itemName
								end
								local _length = 0
								for _k, _v in _exp_1 do
									if _callback_1(_v, _k - 1, _exp_1) == true then
										_length += 1
										_newValue[_length] = _v
									end
								end
								-- ▲ ReadonlyArray.filter ▲
								oldData.Produce = _newValue
							end
							-- gives the player the produce
							createEntity.insertProduce(playerToGiftToEntity, itemName, itemVariant, 1)
							-- notifys them both
							routes.notify.sendTo({
								text = `You gifted {playerToGift.Name} {itemName} ({itemVariant})`,
								duration = 5,
							}, playerGifting)
							routes.notify.sendTo({
								text = `{playerGifting.Name} gifted you {itemName} ({itemVariant})`,
								duration = 5,
							}, playerToGift)
							-- another prompt to become friends only if they arent already friends
							TS.Promise.try(function()
								if not playerToGift:IsFriendsWith(playerGifting.UserId) then
									createEntity.confirmationPrompt(playerToGiftToEntity, `Accept Friend Request?`, `Friend Request From @{playerGifting.Name}`, function()
										printJecs(156, `Adding friend: {playerGifting.Name}`)
										routes.sendFriendRequest.sendTo(playerGifting, playerToGift)
										routes.sendFriendRequest.sendTo(playerToGift, playerGifting)
									end)
								end
							end):catch(function(err)
								return warnTS(161, "Error adding friend:", err)
							end)
						end
					end
					return oldData
				end)
			end, function()
				routes.notify.sendTo({
					text = `Your gift to {playerToGift.Name} was declined.`,
					duration = 5,
				}, playerGifting)
				routes.notify.sendTo({
					text = `You declined the gift from {playerGifting.Name}.`,
					duration = 5,
				}, playerToGift)
			end)
		end
	end)
	-- use event to watch for purchase
	for _binding in useEvent(MarketplaceService.PromptProductPurchaseFinished) do
		local _userId = _binding[1]
		local productId = _binding[2]
		local wasPurchased = _binding[3]
		local userId = _userId
		local player = Players:GetPlayerByUserId(userId)
		local playerEntity = player and getEntity.fromInstance(player)
		local _exp = ShopData.Villagers
		-- ▼ ReadonlyArray.findIndex ▼
		local _callback = function(v)
			return v.ProductId == productId
		end
		local _result = -1
		for _i, _v in _exp do
			if _callback(_v, _i - 1, _exp) == true then
				_result = _i - 1
				break
			end
		end
		-- ▲ ReadonlyArray.findIndex ▲
		local shopVillagerIndex = _result
		-- makes sure its from the villagers page
		if shopVillagerIndex ~= -1 or productId == 3308848691 or productId == 3309650571 then
			-- if the purchase was successful and the player exists
			local _value = wasPurchased and player and playerEntity
			if _value ~= 0 and _value == _value and _value then
				local giftTo = world:get(playerEntity, GiftTo)
				local playerToGiftTo = giftTo and giftTo.target
				local hasGitTo = world:has(playerEntity, GiftTo)
				local isTheSamePlayer = playerToGiftTo and playerToGiftTo.UserId == userId
				-- plays the purchase sound to the player
				routes.playSound.sendTo({
					sound = paths.SFX.UI.purchasepass,
					position = nil,
				}, player)
				printJecs(205, `Gift to`, playerToGiftTo, "for", productId, "was purchased:", wasPurchased)
				printJecs(206, player.Name .. " purchased product", productId, "for", "Robux")
				if hasGitTo and playerToGiftTo then
					-- removes gift to
					local _exp_1 = playerEntity
					local _object = table.clone(giftTo)
					setmetatable(_object, nil)
					_object.gifted = true
					addComponent(_exp_1, GiftTo, _object)
					removeComponent(playerEntity, GiftTo)
					-- if the player to gift to is not a valid player in the game then return
					if not playerToGiftTo.Parent then
						return nil
					end
					-- notifies both players
					if not isTheSamePlayer then
						routes.notify.sendTo({
							text = player.Name .. " has gifted you!",
							duration = 5,
						}, playerToGiftTo)
						routes.notify.sendTo({
							text = "You have gifted " .. playerToGiftTo.Name .. "!",
							duration = 5,
						}, player)
					end
					-- if the player has a gift to then sets the player to the player to gift to
					player = playerToGiftTo
					userId = playerToGiftTo.UserId
					playerEntity = getEntity.fromInstance(playerToGiftTo)
				end
				if productId == 3308848691 then
					local newData = {}
					-- loops through all villagers and restocks them
					updatePlayersStock(function(stock)
						-- ▼ ReadonlyArray.forEach ▼
						local _callback_1 = function(villager, index)
							local _object = table.clone(villager)
							setmetatable(_object, nil)
							_object.InStock = 20
							newData[index + 1] = _object
						end
						for _k, _v in stock do
							_callback_1(_v, _k - 1, stock)
						end
						-- ▲ ReadonlyArray.forEach ▲
						return newData
					end, player)
				elseif productId == 3309650571 then
					-- adds a produce all to the player
					if playerEntity ~= 0 and playerEntity == playerEntity and playerEntity then
						addComponent(playerEntity, ProduceAll)
					end
				else
					-- bought a villager from the shop
					printJecs(252, player.Name .. " bought villager from shop", shopVillagerIndex, "for", "Robux")
					if shopVillagerIndex ~= nil then
						local villagerData = ShopData.Villagers[shopVillagerIndex + 1]
						local entity = getEntity.fromInstance(player)
						local _condition = entity
						if _condition ~= 0 and _condition == _condition and _condition then
							_condition = world:get(entity, Data)
						end
						local data = _condition
						-- if data then
						printJecs(259, "Villager data", villagerData, data)
						if data then
							-- updates your data
							createEntity.updateData(entity, function(oldData)
								createEntity.inventoryVillager(entity, villagerData.Name)
								printJecs(264, player.Name .. "Bought villager from shop", villagerData.Name, "for", "Robux")
								return oldData
							end)
						end
					end
				end
			else
				local _value_1 = not wasPurchased and playerEntity
				if _value_1 ~= 0 and _value_1 == _value_1 and _value_1 then
					removeComponent(playerEntity, GiftTo)
					-- plays the purchase sound to the player
					routes.playSound.sendTo({
						sound = paths.SFX.UI.purchasefail,
						position = nil,
					}, player)
				end
			end
		end
	end
	-- when ever the option confirmation setting is called
	useRoute(routes.confirmSellOptions, function(option, player)
		local playerEntity = getEntity.fromInstance(player)
		local _condition = playerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(playerEntity, Body)
		end
		local body = _condition
		local _condition_1 = playerEntity
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			_condition_1 = world:get(playerEntity, Data)
		end
		local data = _condition_1
		-- if data then
		local _condition_2 = playerEntity
		if _condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2 then
			_condition_2 = body and data
		end
		if _condition_2 then
			local _result = world:get(playerEntity, FriendsBonus)
			if _result ~= nil then
				_result = _result.multiplier
			end
			local _condition_3 = _result
			if not (_condition_3 ~= 0 and _condition_3 == _condition_3 and _condition_3) then
				_condition_3 = 1
			end
			local friendMultiplier = _condition_3
			local _exp = data.Walls
			-- ▼ ReadonlyArray.find ▼
			local _callback = function(wall)
				return wall.Equipped
			end
			local _result_1
			for _i, _v in _exp do
				if _callback(_v, _i - 1, _exp) == true then
					_result_1 = _v
					break
				end
			end
			-- ▲ ReadonlyArray.find ▲
			local _result_2 = _result_1
			if _result_2 ~= nil then
				_result_2 = _result_2.CashMultiplier
			end
			local _condition_4 = _result_2
			if not (_condition_4 ~= 0 and _condition_4 == _condition_4 and _condition_4) then
				_condition_4 = 1
			end
			local wallMultiplier = _condition_4
			local cashMultiplier = wallMultiplier * friendMultiplier
			if option == "Option1" then
				-- sells all your items in your inventory
				createEntity.updateData(playerEntity, function(oldData)
					-- if you have enough
					if (#oldData.Produce) < 1 then
						routes.npcDialogue.sendTo({
							text = "You’re not holding anything to sell.",
							target = "Sell",
						}, player)
					end
					-- loops through your villagers tallys them up
					-- oldData.Villagers.forEach((villagerData) => {
					--     if (villagerData.RelativeLocation) return; // skip if the villager is placed
					--     const villagerName = villagerData.Name;
					--     oldData.Coins += (ShopData.SellPrice[villagerName] || 0) * cashMultiplier; // adds the coins from the villager
					-- });
					-- loops through your produce tallys them up
					local _exp_1 = oldData.Produce
					-- ▼ ReadonlyArray.forEach ▼
					local _callback_1 = function(produceData)
						local produceName = produceData.Name
						local variantMultiplier = (if produceData.Variant == "Rainbow" then 50 elseif produceData.Variant == "Gold" then 10 else 1)
						local _condition_5 = ShopData.SellPrice[produceName]
						if not (_condition_5 ~= 0 and _condition_5 == _condition_5 and _condition_5) then
							_condition_5 = 0
						end
						oldData.Coins += math.floor((_condition_5 * cashMultiplier * variantMultiplier * produceData.Amount) + .5)
					end
					for _k, _v in _exp_1 do
						_callback_1(_v, _k - 1, _exp_1)
					end
					-- ▲ ReadonlyArray.forEach ▲
					-- removes the villagers that arent spawned
					-- oldData.Villagers = oldData.Villagers.filter((villagerData) => villagerData.RelativeLocation ? true : false);
					local _exp_2 = oldData.Produce
					-- ▼ ReadonlyArray.find ▼
					local _callback_2 = function(p)
						return p.Name == "Wheat"
					end
					local _result_3
					for _i, _v in _exp_2 do
						if _callback_2(_v, _i - 1, _exp_2) == true then
							_result_3 = _v
							break
						end
					end
					-- ▲ ReadonlyArray.find ▲
					local soldWheat = _result_3 ~= nil
					table.clear(oldData.Produce)
					if oldData.Tutorial == 3 and soldWheat then
						oldData.Coins += 50
						oldData.Tutorial = "Done"
						logTutorialStep(player, TutorialStep.WheatSold, "tutorial_wheat_sold")
					end
					-- prints the sell message
					printJecs(329, player.Name .. " sold all items for", oldData.Coins, "Coins")
					return oldData
				end)
			elseif option == "Option2" then
				local tool = body.model:FindFirstChildOfClass("Tool")
				-- if the tool is a villager then sells it
				if tool then
					local itemName = tool:GetAttribute("ItemName")
					local variant = tool:GetAttribute("ItemVariant")
					-- removes the item from the data
					createEntity.updateData(playerEntity, function(oldData)
						-- if the villager info is found then remove it
						-- if (villagerInfo) {
						--     printJecs($line, player.Name + " sold villager", itemName, "for", ShopData.SellPrice[itemName] || 0, "Coins");
						--     oldData.Villagers = oldData.Villagers.filter((v) => v.UniqueId !== uniqueId);
						--     oldData.Coins += (ShopData.SellPrice[itemName] || 0) * cashMultiplier; // adds the coins from the villager
						-- } else 
						if variant and itemName then
							local _condition_5 = ShopData.SellPrice[itemName]
							if not (_condition_5 ~= 0 and _condition_5 == _condition_5 and _condition_5) then
								_condition_5 = 0
							end
							local sellPrice = _condition_5 * (if variant == "Rainbow" then 50 elseif variant == "Gold" then 10 else 1)
							local _exp_1 = oldData.Produce
							-- ▼ ReadonlyArray.findIndex ▼
							local _callback_1 = function(p)
								return p.Name == itemName and p.Variant == variant
							end
							local _result_3 = -1
							for _i, _v in _exp_1 do
								if _callback_1(_v, _i - 1, _exp_1) == true then
									_result_3 = _i - 1
									break
								end
							end
							-- ▲ ReadonlyArray.findIndex ▲
							local produceIndex = _result_3
							local _exp_2 = player.Name .. " sold produce"
							local _condition_6 = sellPrice
							if not (_condition_6 ~= 0 and _condition_6 == _condition_6 and _condition_6) then
								_condition_6 = 0
							end
							printJecs(352, _exp_2, itemName, "for", _condition_6, "Coins")
							if produceIndex ~= -1 then
								oldData.Produce[produceIndex + 1].Amount -= 1
								local _condition_7 = sellPrice
								if not (_condition_7 ~= 0 and _condition_7 == _condition_7 and _condition_7) then
									_condition_7 = 0
								end
								oldData.Coins += math.floor((_condition_7 * cashMultiplier) + .5)
								if oldData.Produce[produceIndex + 1].Amount == 0 then
									table.remove(oldData.Produce, produceIndex + 1)
								end
								if itemName == "Wheat" and oldData.Tutorial == 3 then
									oldData.Coins += 50
									oldData.Tutorial = "Done"
									logTutorialStep(player, TutorialStep.WheatSold, "tutorial_wheat_sold")
								end
							end
						end
						return oldData
					end)
				else
					routes.npcDialogue.sendTo({
						text = "You’re not holding anything to sell.",
						target = "Sell",
					}, player)
				end
			elseif option == "Option3" then
				local tool = body.model:FindFirstChildOfClass("Tool")
				local itemName = tool and tool:GetAttribute("ItemName")
				local isVillager = tool and tool:GetAttribute("UniqueId")
				local variant = tool and tool:GetAttribute("ItemVariant")
				-- if the tool is a villager then tells you how much it costs
				if tool and itemName and not isVillager then
					local variantMultiplier = (if variant == "Rainbow" then 50 elseif variant == "Gold" then 10 else 1)
					-- const produceInfo = variant && data.Produce.find((p) => p.Name === itemName && p.Variant === variant);
					local totalItemCount = 1
					local _npcDialogue = routes.npcDialogue
					local _object = {}
					local _left = "text"
					local _condition_5 = ShopData.SellPrice[itemName]
					if not (_condition_5 ~= 0 and _condition_5 == _condition_5 and _condition_5) then
						_condition_5 = 0
					end
					_object[_left] = `That would sell for {math.floor((_condition_5 * totalItemCount * cashMultiplier * variantMultiplier) + .5)} Coins`
					_object.target = "Sell"
					_npcDialogue.sendTo(_object, player)
				else
					routes.npcDialogue.sendTo({
						text = "You’re not holding anything to sell.",
						target = "Sell",
					}, player)
				end
			elseif option == "Option4" then
				routes.toggleSellMenuOpen.sendTo(false, player)
			end
		end
	end)
	-- when ever a request is made to buy a villager
	useRoute(routes.buyVillager, function(_param, player)
		local villagerIndex = _param.villagerIndex
		local currency = _param.currency
		local entity = getEntity.fromInstance(player)
		local _condition = entity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(entity, Data)
		end
		local data = _condition
		-- if data then
		if data then
			local villagerData = getPlayersStock(player)[villagerIndex + 1]
			local totalPrice = villagerData.Price
			local _exp = data.Villagers
			-- ▼ ReadonlyArray.some ▼
			local _result = false
			local _callback = function(v)
				return v.Name == villagerData.Name
			end
			for _k, _v in _exp do
				if _callback(_v, _k - 1, _exp) then
					_result = true
					break
				end
			end
			-- ▲ ReadonlyArray.some ▲
			local alreadyOwned = _result
			if currency == "Coins" then
				-- if not in stock then return
				if villagerData.InStock < 1 then
					return nil
				end
				-- if the player has enough coins then takes coins
				createEntity.updateData(entity, function(oldData)
					local currency = oldData.Coins
					if currency >= totalPrice then
						-- plays the purchase sound to the player
						routes.playSound.sendTo({
							sound = paths.SFX.UI.purchasepass,
							position = nil,
						}, player)
						-- updates your data
						oldData.Coins -= totalPrice
						createEntity.inventoryVillager(entity, villagerData.Name)
						if oldData.Tutorial == 0 and villagerData.Name == "Farmer" then
							oldData.Tutorial = 1
						end
						-- takes from stock and sets the new shop data
						takeVillagerFromStock(villagerData.Name, player)
						if not alreadyOwned then
							logVillagerPurchase(player, villagerData.Name)
							if villagerData.Name == "Farmer" and data.Tutorial == 0 then
								logTutorialStep(player, TutorialStep.FarmerBought, "tutorial_farmer_bought")
							end
						end
					else
						-- plays the purchase sound to the player
						routes.playSound.sendTo({
							sound = paths.SFX.UI.purchasefail,
							position = nil,
						}, player)
					end
					return oldData
				end)
			elseif currency == "Robux" then
				MarketplaceService:PromptProductPurchase(player, villagerData.ProductId)
			end
		end
	end)
end
return {
	default = default,
}
