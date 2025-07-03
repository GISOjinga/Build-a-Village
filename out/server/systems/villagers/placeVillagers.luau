-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local pair = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "jecs").pair
local routes = TS.import(script, game:GetService("ServerScriptService"), "TS", "routes").default
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local isVillagersOverlapping = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "villagerFunctions").isVillagersOverlapping
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local ActiveVillagers = _jecsComponents.ActiveVillagers
local Body = _jecsComponents.Body
local Data = _jecsComponents.Data
local Platform = _jecsComponents.Platform
local Player = _jecsComponents.Player
local Removed = _jecsComponents.Removed
local TargetEntity = _jecsComponents.TargetEntity
local Villager = _jecsComponents.Villager
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local deepCopy = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepCopy
local villagersProgressData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "villagersProgressData").default
local _analytics = TS.import(script, game:GetService("ServerScriptService"), "TS", "utils", "analytics")
local logTutorialStep = _analytics.logTutorialStep
local TutorialStep = _analytics.TutorialStep
local default = function(world)
	useRoute(routes.placeVillager, function(_location, player)
		local entity = getEntity.fromInstance(player)
		local body = getEntity.bodyFromPlayer(player)
		local tool = body and body.model:FindFirstChildOfClass("Tool")
		local _itemType = tool
		if _itemType ~= nil then
			_itemType = _itemType:GetAttribute("ItemType")
		end
		local itemType = _itemType
		local _result = tool
		if _result ~= nil then
			_result = _result:GetAttribute("ItemName")
		end
		local villagerName = _result
		local _result_1 = tool
		if _result_1 ~= nil then
			_result_1 = _result_1:GetAttribute("UniqueId")
		end
		local uniqueId = _result_1
		local villagerModel = villagerName and paths.Assets.Villagers:FindFirstChild(villagerName)
		local _result_2 = villagerModel
		if _result_2 ~= nil then
			_result_2 = _result_2:GetAttribute("Height")
		end
		local _condition = _result_2
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = 3.3
		end
		local modelHeight = _condition
		local platform = body and body.platform
		local floorYPosition = platform and platform.Floor.Position.Y - (platform.Floor.Size.Y / 2)
		local _condition_1 = floorYPosition
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			local _cFrame = CFrame.new(_location.X, floorYPosition + modelHeight, _location.Z)
			local _rotation = _location.Rotation
			_condition_1 = _cFrame * _rotation
		end
		local location = _condition_1
		-- if entity exists and tool exists then
		local _condition_2 = location
		if _condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2 then
			_condition_2 = entity ~= nil and uniqueId ~= nil and villagerModel and platform and tool and villagerName and itemType == "Villager" and not isVillagersOverlapping(platform.Villagers:GetChildren(), villagerModel, location)
		end
		if _condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2 then
			-- removes the tool and adds you to the plot of land
			createEntity.updateData(entity, function(oldData)
				local _exp = oldData.Villagers
				-- ▼ ReadonlyArray.findIndex ▼
				local _callback = function(v)
					return v.UniqueId == uniqueId
				end
				local _result_3 = -1
				for _i, _v in _exp do
					if _callback(_v, _i - 1, _exp) == true then
						_result_3 = _i - 1
						break
					end
				end
				-- ▲ ReadonlyArray.findIndex ▲
				local indexOfVillager = _result_3
				local villagerData = oldData.Villagers[indexOfVillager + 1]
				-- sets up the vilalger to be ready to load in
				villagerData.RelativeLocation = platform.Floor.CFrame:ToObjectSpace(location)
				villagerData.Progress = deepCopy(villagersProgressData[villagerName])
				villagerData.Progress.Progression.Time.StartTime = os.time()
				villagerData.Progress.Building.StartTime = os.time()
				villagerData.Progress.Building.TotalTime = 5
				if oldData.Tutorial == 1 and villagerName == "Farmer" then
					oldData.Tutorial = 2
					logTutorialStep(player, TutorialStep.FarmerPlaced, "tutorial_farmer_placed")
				end
				return oldData
			end)
		end
	end)
	-- when requesting to dig villager it will remove the relative cframe by updating the data
	useRoute(routes.digVillager, function(villagerEntity, player)
		local playerEntity = getEntity.fromInstance(player)
		local villager = world:get(villagerEntity, Villager)
		local _uniqueId = villager
		if _uniqueId ~= nil then
			_uniqueId = _uniqueId.villagerData.UniqueId
		end
		local uniqueId = _uniqueId
		-- prints the villager and player trying to dig
		printJecs(65, `{player.Name} is trying to dig villager: `, villagerEntity, "\nPlayer Entity: " .. tostring(playerEntity), "\nUniqueId: " .. tostring(uniqueId))
		-- if entity exists and tool exists then
		local _condition = playerEntity ~= nil
		if _condition then
			local _result = villager
			if _result ~= nil then
				_result = _result.playerEntity
			end
			_condition = playerEntity == _result
			if _condition then
				_condition = uniqueId ~= nil
			end
		end
		if _condition then
			printJecs(69, "Digging Villager", villagerEntity, playerEntity, uniqueId)
			-- removes the tool and adds you to the plot of land
			createEntity.updateData(playerEntity, function(oldData)
				local _exp = oldData.Villagers
				-- ▼ ReadonlyArray.findIndex ▼
				local _callback = function(v)
					return v.UniqueId == uniqueId
				end
				local _result = -1
				for _i, _v in _exp do
					if _callback(_v, _i - 1, _exp) == true then
						_result = _i - 1
						break
					end
				end
				-- ▲ ReadonlyArray.findIndex ▲
				local indexOfVillager = _result
				local villagerData = oldData.Villagers[indexOfVillager + 1]
				-- sets up the vilalger to be ready to load in
				villagerData.RelativeLocation = nil
				world:delete(villagerEntity)
				printJecs(79, "Removed Relative Location from: ", villagerData)
				return oldData
			end)
		end
	end)
	-- if player doesnt have ActiveVillagers then gives them one
	for entity in world:query(Player):without(ActiveVillagers) do
		addComponent(entity, ActiveVillagers, {})
	end
	-- when active villagers get removed then goes through all the villagers and deletes them
	for _, activeVillagers in world:query(Removed(ActiveVillagers)) do
		printJecs(91, "Removing Active Villagers: ", activeVillagers)
		-- removes all the villagers from the platform
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(villager)
			local _condition = villager.entity
			if _condition ~= 0 and _condition == _condition and _condition then
				_condition = world:contains(villager.entity)
			end
			if _condition then
				world:delete(villager.entity)
			end
		end
		for _k, _v in activeVillagers do
			_callback(_v, _k - 1, activeVillagers)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	-- for all active vilalgers of the player with data makes sure they are spawned in
	for playerEntity, body, data, activeVillagers, platformEntity in world:query(Body, Data, ActiveVillagers, pair(TargetEntity, Platform)) do
		if not body.platform then
			continue
		end
		local platform = body.platform
		local _exp = data.Villagers
		-- ▼ ReadonlyArray.filter ▼
		local _newValue = {}
		local _callback = function(v)
			local _condition = v.RelativeLocation
			if _condition then
				-- ▼ ReadonlyArray.find ▼
				local _callback_1 = function(av)
					return av.uniqueId == v.UniqueId
				end
				local _result
				for _i, _v in activeVillagers do
					if _callback_1(_v, _i - 1, activeVillagers) == true then
						_result = _v
						break
					end
				end
				-- ▲ ReadonlyArray.find ▲
				_condition = not _result
			end
			return if _condition then true else false
		end
		local _length = 0
		for _k, _v in _exp do
			if _callback(_v, _k - 1, _exp) == true then
				_length += 1
				_newValue[_length] = _v
			end
		end
		-- ▲ ReadonlyArray.filter ▲
		local missingVillagers = _newValue
		-- ▼ ReadonlyArray.filter ▼
		local _newValue_1 = {}
		local _callback_1 = function(v)
			local _exp_1 = data.Villagers
			-- ▼ ReadonlyArray.find ▼
			local _callback_2 = function(av)
				return (av.UniqueId == v.uniqueId) and (av.RelativeLocation ~= nil)
			end
			local _result
			for _i, _v in _exp_1 do
				if _callback_2(_v, _i - 1, _exp_1) == true then
					_result = _v
					break
				end
			end
			-- ▲ ReadonlyArray.find ▲
			local _condition = _result
			if _condition then
				_condition = false
			end
			return _condition
		end
		local _length_1 = 0
		for _k, _v in activeVillagers do
			if _callback_1(_v, _k - 1, activeVillagers) == true then
				_length_1 += 1
				_newValue_1[_length_1] = _v
			end
		end
		-- ▲ ReadonlyArray.filter ▲
		local villagersToDespawn = _newValue_1
		-- gets rid of the spawned villagers that dont exist in data
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_2 = function(villager)
			return world:delete(villager.entity)
		end
		for _k, _v in villagersToDespawn do
			_callback_2(_v, _k - 1, villagersToDespawn)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- creates a villager
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_3 = function(villager)
			local _arg0 = {
				uniqueId = villager.UniqueId,
				entity = createEntity.villagerNpc(playerEntity, villager, platform, platformEntity),
			}
			table.insert(activeVillagers, _arg0)
			return #activeVillagers
		end
		for _k, _v in missingVillagers do
			_callback_3(_v, _k - 1, missingVillagers)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- updates active vilalgers
		addComponent(playerEntity, ActiveVillagers, activeVillagers)
		-- print(activeVillagers, missingVillagers)
	end
	-- when ever a villager entity is destroyed it goes saves all the progress and goes back to inventory
	for _, __, _binding in world:query(TargetEntity, Removed(Villager)) do
		local villagerData = _binding.villagerData
		local villagerModel = _binding.villagerModel
		local playerEntity = _binding.playerEntity
		local _condition = playerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:contains(playerEntity) and world:get(playerEntity, Data)
		end
		local playerData = _condition
		local activeVillagers = playerData and world:get(playerEntity, ActiveVillagers)
		-- destroys the villager
		villagerModel:Destroy()
		-- if player data exists then updates the villager data
		if playerData and activeVillagers then
			-- const oldVillagerData = playerData.Villagers.find((v) => v.UniqueId === villagerData.UniqueId);
			-- const oldProgress = oldVillagerData && oldVillagerData
			-- saves the villagers data but also removes their relative location
			-- createEntity.updateData(playerEntity, (oldData) => {
			--     const indexOfActiveVillager = oldData.Villagers.findIndex((v) => v.UniqueId === villagerData.UniqueId);
			--     // saves the progress but removes your relative location meaning you arent spawned anymore
			--     oldData.Villagers[indexOfActiveVillager].Progress = oldProgress?.Progress || villagerData.Progress;
			--     villagerData.RelativeLocation = undefined;
			--     return oldData;
			-- });
			-- pops it out shifting the rest of the villagers while also adding the component back
			-- ▼ ReadonlyArray.findIndex ▼
			local _callback = function(v)
				return v.uniqueId == villagerData.UniqueId
			end
			local _result = -1
			for _i, _v in activeVillagers do
				if _callback(_v, _i - 1, activeVillagers) == true then
					_result = _i - 1
					break
				end
			end
			-- ▲ ReadonlyArray.findIndex ▲
			table.remove(activeVillagers, _result + 1)
			addComponent(playerEntity, ActiveVillagers, activeVillagers)
		end
	end
end
return {
	default = default,
}
