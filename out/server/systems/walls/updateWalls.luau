-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local pair = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "jecs").pair
local MarketplaceService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").MarketplaceService
local routes = TS.import(script, game:GetService("ServerScriptService"), "TS", "routes").default
local wallsData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "wallsData").default
local useEvent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useEvent
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local Changed = _jecsComponents.Changed
local Data = _jecsComponents.Data
local GiftTo = _jecsComponents.GiftTo
local Platform = _jecsComponents.Platform
local PlatformOccupied = _jecsComponents.PlatformOccupied
local Player = _jecsComponents.Player
local Removed = _jecsComponents.Removed
local TargetEntity = _jecsComponents.TargetEntity
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- to toggle fence visibility
local function toggleFenceVisibility(fence, visible)
	fence:SetAttribute("Visible", visible)
	local _exp = fence:GetDescendants()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(fence)
		if fence:IsA("BasePart") then
			fence.Transparency = if visible then 0 else 1
			fence.CanCollide = visible
			fence.CastShadow = visible
			fence.CanQuery = visible
			fence.CanTouch = false
			fence.Anchored = true
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
local default = function(world)
	-- when ever buy wall is called it updates the wall in your data using create entity
	useRoute(routes.buyWall, function(routeData, player)
		local playerEntity = getEntity.fromInstance(player)
		local _condition = playerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(playerEntity, Data)
		end
		local data = _condition
		-- ▼ ReadonlyArray.find ▼
		local _callback = function(w)
			return w.Name == routeData.wallName
		end
		local _result
		for _i, _v in wallsData do
			if _callback(_v, _i - 1, wallsData) == true then
				_result = _v
				break
			end
		end
		-- ▲ ReadonlyArray.find ▲
		local wallWishingToBeBought = _result
		local _condition_1 = playerEntity
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			_condition_1 = wallWishingToBeBought and data
		end
		if _condition_1 then
			-- if you have enough money to buy the wall
			if routeData.currency == "Coins" then
				createEntity.updateData(playerEntity, function(oldData)
					-- updates your cash if you have it
					if oldData.Coins >= wallWishingToBeBought.Price then
						-- plays the purchase sound to the player
						routes.playSound:sendTo({
							sound = paths.SFX.UI.purchasepass,
							position = nil,
						}, player)
						printJecs(52, `Buying wall {wallWishingToBeBought.Name} for {wallWishingToBeBought.Price} coins`)
						-- removes the coins from your data
						oldData.Coins -= wallWishingToBeBought.Price
						-- gived you the wall in your walls
						local _exp = oldData.Walls
						-- ▼ ReadonlyArray.forEach ▼
						local _callback_1 = function(wall)
							wall.Equipped = false
							return wall.Equipped
						end
						for _k, _v in _exp do
							_callback_1(_v, _k - 1, _exp)
						end
						-- ▲ ReadonlyArray.forEach ▲
						local _walls = oldData.Walls
						local _object = table.clone(wallWishingToBeBought)
						setmetatable(_object, nil)
						_object.Owned = true
						_object.Equipped = true
						table.insert(_walls, _object)
					else
						-- plays the purchase sound to the player
						routes.playSound:sendTo({
							sound = paths.SFX.UI.purchasefail,
							position = nil,
						}, player)
					end
					return oldData
				end)
			elseif routeData.currency == "Robux" and wallWishingToBeBought.GamePassId > 0 then
				-- prompts marpet place to buy the wall
				MarketplaceService:PromptGamePassPurchase(player, wallWishingToBeBought.GamePassId)
			end
		end
	end)
	-- use event to watch for purchase
	for _binding in useEvent(MarketplaceService.PromptGamePassPurchaseFinished) do
		local player = _binding[1]
		local gamePassId = _binding[2]
		local wasPurchased = _binding[3]
		local playerEntity = player and getEntity.fromInstance(player)
		-- ▼ ReadonlyArray.find ▼
		local _callback = function(wall)
			return wall.GamePassId == gamePassId
		end
		local _result
		for _i, _v in wallsData do
			if _callback(_v, _i - 1, wallsData) == true then
				_result = _v
				break
			end
		end
		-- ▲ ReadonlyArray.find ▲
		local wallWishingToBeBought = _result
		task.spawn(function()
			printJecs(85, `Player {player.Name} purchased game pass {gamePassId} with result {wasPurchased or MarketplaceService:UserOwnsGamePassAsync(player.UserId, gamePassId)}, wallWishingToBeBought`, gamePassId)
			-- if the purchase was successful and the player exists
			local _condition = (wasPurchased or MarketplaceService:UserOwnsGamePassAsync(player.UserId, gamePassId))
			if _condition then
				_condition = playerEntity
				if _condition ~= 0 and _condition == _condition and _condition then
					_condition = wallWishingToBeBought
				end
			end
			if _condition then
				-- plays the purchase sound to the player
				routes.playSound:sendTo({
					sound = paths.SFX.UI.purchasepass,
					position = nil,
				}, player)
				printJecs(95, `Player {player.Name} purchased wall {wallWishingToBeBought.Name} with robux`)
				-- updates your data to give you the wall
				createEntity.updateData(playerEntity, function(oldData)
					-- adds the wall to your walls
					local _walls = oldData.Walls
					local _object = table.clone(wallWishingToBeBought)
					setmetatable(_object, nil)
					_object.Owned = true
					_object.Equipped = true
					table.insert(_walls, _object)
					return oldData
				end)
			else
				-- plays the purchase sound to the player
				routes.playSound:sendTo({
					sound = paths.SFX.UI.purchasefail,
					position = nil,
				}, player)
			end
		end)
	end
	-- when ever equip wall is called it edits your data then equips the wall using create entity
	useRoute(routes.equipWall, function(routeData, player)
		local playerEntity = getEntity.fromInstance(player)
		local _condition = playerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(playerEntity, Data)
		end
		local data = _condition
		local _condition_1 = playerEntity
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			_condition_1 = data
		end
		if _condition_1 then
			-- finds the wall you wish to equip
			local _exp = data.Walls
			-- ▼ ReadonlyArray.find ▼
			local _callback = function(wall)
				return wall.Name == routeData.wallName
			end
			local _result
			for _i, _v in _exp do
				if _callback(_v, _i - 1, _exp) == true then
					_result = _v
					break
				end
			end
			-- ▲ ReadonlyArray.find ▲
			local wallToEquip = _result
			-- if you have the wall
			if wallToEquip then
				printJecs(127, `Equipping wall {wallToEquip.Name} to {if routeData.equip then "equip" else "unequip"}`)
				-- updates your walls data
				createEntity.updateData(playerEntity, function(oldData)
					local _exp_1 = oldData.Walls
					-- ▼ ReadonlyArray.forEach ▼
					local _callback_1 = function(wall)
						if wall.Name == wallToEquip.Name then
							printJecs(132, `Setting wall {wall.Name} equipped to {routeData.equip}`)
							wall.Equipped = routeData.equip
						else
							wall.Equipped = false
						end
					end
					for _k, _v in _exp_1 do
						_callback_1(_v, _k - 1, _exp_1)
					end
					-- ▲ ReadonlyArray.forEach ▲
					return oldData
				end)
			end
		end
	end)
	-- function to toggle wall
	local function equipWall(playerEntity, data, platform)
		local _exp = data.Walls
		-- ▼ ReadonlyArray.find ▼
		local _callback = function(w)
			return w.Owned and w.Equipped
		end
		local _result
		for _i, _v in _exp do
			if _callback(_v, _i - 1, _exp) == true then
				_result = _v
				break
			end
		end
		-- ▲ ReadonlyArray.find ▲
		local currentlyEquippedWall = _result
		local wallModel = currentlyEquippedWall and platform.Fences:FindFirstChild(currentlyEquippedWall.Name)
		-- checks to see if the wall is already visible if so ignores it
		printJecs(150, "Currently equipped wall:", if currentlyEquippedWall then currentlyEquippedWall.Name else "none", "Wall model:", if wallModel then wallModel.Name else "none")
		local _condition = not wallModel
		if not _condition then
			local _value = wallModel:GetAttribute("Visible")
			_condition = not (_value ~= 0 and _value == _value and _value ~= "" and _value)
		end
		if _condition then
			printJecs(152, "Updating walls for player", playerEntity, "to", if currentlyEquippedWall then currentlyEquippedWall.Name else "none")
			-- hides all walls
			local _exp_1 = platform.Fences:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_1 = function(child)
				child:SetAttribute("Visible", false)
				toggleFenceVisibility(child, false)
			end
			for _k, _v in _exp_1 do
				_callback_1(_v, _k - 1, _exp_1)
			end
			-- ▲ ReadonlyArray.forEach ▲
			-- if the current wall exists then sets it visible
			if wallModel then
				wallModel:SetAttribute("Visible", true)
				toggleFenceVisibility(wallModel, true)
			end
		end
	end
	-- when platform gets added hides all the walls except the equipped one
	for _, platformEntity, platform in world:query(TargetEntity, Added(Platform)) do
		local _exp = platform.Fences:GetChildren()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(fence)
			return toggleFenceVisibility(fence, false)
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	-- when platform occupiued gets added
	for _, platformEntity, playerOccupyingEntity in world:query(TargetEntity, Added(PlatformOccupied)) do
		local playerOccupying = world:get(playerOccupyingEntity, Player)
		local platform = world:get(platformEntity, Platform)
		-- if platform exists then sets up the sign gui containers
		if platform and playerOccupying then
			local _result = paths.Assets.ProximityPrompts:FindFirstChild("ProduceAll")
			if _result ~= nil then
				_result = _result:Clone()
			end
			local proximityPromptProduceAll = _result
			-- sets up produce all
			if proximityPromptProduceAll then
				proximityPromptProduceAll.Parent = platform.BuySign.Container
				-- when triggered asks to buy a product called produce all
				proximityPromptProduceAll.Triggered:Connect(function(playerWhoTriggered)
					local playerWhoTriggeredEntity = getEntity.fromInstance(playerWhoTriggered)
					local _condition = playerWhoTriggeredEntity
					if _condition ~= 0 and _condition == _condition and _condition then
						_condition = world:contains(playerOccupyingEntity)
					end
					if _condition then
						addComponent(playerWhoTriggeredEntity, GiftTo, {
							target = playerOccupying,
							gifted = false,
						})
						MarketplaceService:PromptProductPurchase(playerWhoTriggered, 3309650571)
					end
				end)
			end
		end
	end
	-- when ever platform occupied gets removed hides the fences
	for _, platformEntity in world:query(TargetEntity, Removed(PlatformOccupied)) do
		local platform = world:get(platformEntity, Platform)
		if platform then
			local _result = platform.BuySign.Container:FindFirstChildOfClass("ProximityPrompt")
			if _result ~= nil then
				_result:Destroy()
			end
			local _exp = platform.Fences:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(fence)
				return toggleFenceVisibility(fence, false)
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	-- when ever your data gets updated it makes sure to set the equipped wall on your platform visible
	for _, playerEntity, changed in world:query(TargetEntity, Changed(Data)) do
		local data = changed.new
		local platformEntity = world:contains(playerEntity) and world:get(playerEntity, pair(TargetEntity, Platform))
		local _condition = platformEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:contains(platformEntity) and world:get(platformEntity, Platform)
		end
		local platform = _condition
		-- if you have data and a platform then hides all your walls
		printJecs(214, "Updating walls for player", playerEntity, "with data", data, platformEntity, platform)
		if platform and data then
			equipWall(playerEntity, data, platform)
		end
	end
end
return {
	default = default,
}
