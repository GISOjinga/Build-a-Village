-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local MarketplaceService = _services.MarketplaceService
local Players = _services.Players
local useEvent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useEvent
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local printTS = _jecsHelpFunctions.printTS
local removeComponent = _jecsHelpFunctions.removeComponent
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local ActiveVillagers = _jecsComponents.ActiveVillagers
local Added = _jecsComponents.Added
local Body = _jecsComponents.Body
local CanQuery = _jecsComponents.CanQuery
local Data = _jecsComponents.Data
local MaxedOut = _jecsComponents.MaxedOut
local ModelDebugger = _jecsComponents.ModelDebugger
local Player = _jecsComponents.Player
local ProduceAll = _jecsComponents.ProduceAll
local Removed = _jecsComponents.Removed
local TakeFromVillager = _jecsComponents.TakeFromVillager
local TargetEntity = _jecsComponents.TargetEntity
local Villager = _jecsComponents.Villager
local VillagerAnimator = _jecsComponents.VillagerAnimator
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local villagersProgressData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "villagersProgressData").default
local routes = TS.import(script, game:GetService("ServerScriptService"), "TS", "routes").default
local _analytics = TS.import(script, game:GetService("ServerScriptService"), "TS", "utils", "analytics")
local logTutorialStep = _analytics.logTutorialStep
local TutorialStep = _analytics.TutorialStep
-- function to give random variant
local randomVariant = function()
	return if math.random(1, 200) <= 1 then "Rainbow" elseif math.random(1, 20) <= 1 then "Gold" else "Normal"
end
local default = function(world)
	-- handle client requests
	useRoute(routes.collectVillagerProduce, function(_param, playerWhoTriggered)
		local villagerEntity = _param.villagerEntity
		local resourceModelName = _param.resourceModelName
		local playerEntityWhoTriggered = getEntity.fromInstance(playerWhoTriggered)
		local villagerInfo = world:contains(villagerEntity) and world:get(villagerEntity, Villager)
		local model = if villagerInfo then villagerInfo.villagerModel.Station.Parts.Resources:FindFirstChild(resourceModelName) else nil
		local _condition = (model and tonumber(resourceModelName))
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = 0
		end
		local resourceIndex = _condition - 1
		-- const resourceProximityPrompt = model?.FindFirstChild("ProximityPromptPart")?.FindFirstChild<ProximityPrompt>("ResourcesPrompt");
		local _condition_1 = model and villagerInfo
		if _condition_1 then
			_condition_1 = playerEntityWhoTriggered
			if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
				_condition_1 = resourceIndex > -1
			end
		end
		if _condition_1 then
			local player = world:get(villagerInfo.playerEntity, Player)
			local variant = villagerInfo.villagerData.Progress.Progression.Resources[resourceIndex + 1]
			if variant then
				if playerWhoTriggered == player then
					table.remove(villagerInfo.villagerData.Progress.Progression.Resources, resourceIndex + 1)
					local _exp = villagerEntity
					local _object = table.clone(villagerInfo)
					setmetatable(_object, nil)
					addComponent(_exp, Villager, _object)
					createEntity.insertProduce(playerEntityWhoTriggered, villagerInfo.villagerData.Progress.Produce, variant)
					createEntity.updateData(playerEntityWhoTriggered, function(oldData)
						if villagerInfo.villagerData.Name == "Farmer" and oldData.Tutorial == 2 then
							oldData.Tutorial = 3
							logTutorialStep(playerWhoTriggered, TutorialStep.WheatCollected, "tutorial_wheat_collected")
						end
						return oldData
					end)
					removeComponent(villagerEntity, MaxedOut)
				else
					printTS(52, `Player {playerWhoTriggered.Name} tried to take villager resource but was not the owner of the villager`)
					addComponent(playerEntityWhoTriggered, TakeFromVillager, {
						villagerEntityToStealFrom = villagerEntity,
						resourceModelName = model.Name,
						produceName = villagerInfo.villagerData.Progress.Produce,
						variant = variant,
					})
					MarketplaceService:PromptProductPurchase(playerWhoTriggered, 3315996934)
				end
			end
		end
	end)
	useRoute(routes.supplyVillager, function(villagerEntity, playerWhoTriggered)
		local playerEntityWhoTriggered = getEntity.fromInstance(playerWhoTriggered)
		local villagerInfo = world:contains(villagerEntity) and world:get(villagerEntity, Villager)
		if villagerInfo and playerEntityWhoTriggered == villagerInfo.playerEntity then
			local body = world:get(playerEntityWhoTriggered, Body)
			local requiredResource = villagerInfo.villagerData.Progress.Required
			local villagerModel = villagerInfo.villagerModel
			if body and requiredResource and requiredResource.Amount < requiredResource.Max then
				local toolInHand = body.model:FindFirstChildOfClass("Tool")
				local toolType = toolInHand and toolInHand:GetAttribute("ItemType")
				local toolName = toolInHand and toolInHand:GetAttribute("ItemName")
				if toolType == "Commodity" and toolName == requiredResource.Produce then
					createEntity.updateData(playerEntityWhoTriggered, function(oldData)
						local amountNeededToBeMaxedOut = requiredResource.Max - requiredResource.Amount
						local _exp = oldData.Produce
						-- ▼ ReadonlyArray.findIndex ▼
						local _callback = function(produce)
							return produce.Name == requiredResource.Produce
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
						local produce = oldData.Produce[produceIndex + 1]
						local amountToTakeAway = math.min(produce.Amount, amountNeededToBeMaxedOut)
						produce.Amount -= amountToTakeAway
						local _exp_1 = villagerEntity
						local _object = {}
						local _left = "villagerData"
						local _object_1 = table.clone(villagerInfo.villagerData)
						setmetatable(_object_1, nil)
						local _left_1 = "Progress"
						local _object_2 = table.clone(villagerInfo.villagerData.Progress)
						setmetatable(_object_2, nil)
						local _left_2 = "Required"
						local _object_3 = table.clone(requiredResource)
						setmetatable(_object_3, nil)
						_object_3.Amount = requiredResource.Amount + amountToTakeAway
						_object_2[_left_2] = _object_3
						_object_1[_left_1] = _object_2
						_object[_left] = _object_1
						_object.villagerModel = villagerModel
						_object.playerEntity = villagerInfo.playerEntity
						addComponent(_exp_1, Villager, _object)
						if produce.Amount <= 0 then
							table.remove(oldData.Produce, produceIndex + 1)
						end
						return oldData
					end)
				end
			end
		end
	end)
	-- when villager is added but not fully built then
	for _, villagerEntity, _binding in world:query(TargetEntity, Added(Villager)) do
		local villagerData = _binding.villagerData
		local villagerModel = _binding.villagerModel
		local playerEntity = _binding.playerEntity
		local player = world:get(playerEntity, Player)
		local body = world:get(playerEntity, Body)
		local buildingTimes = villagerData.Progress.Building
		local timeTillFullyBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) - os.time()
		local hitBox = Instance.new("Part")
		local tier2ProximityPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
		local requiredResource = villagerData.Progress.Required
		local produceName = villagerData.Progress.Produce
		-- set up part
		hitBox.Transparency = 1
		hitBox.Anchored = true
		hitBox.CanCollide = false
		hitBox.CanQuery = false
		hitBox.Size = villagerModel:GetExtentsSize()
		hitBox.CFrame = villagerModel:GetPivot()
		hitBox.Name = "HitBox"
		hitBox.Parent = villagerModel
		-- for each resource that can be picked up adds a proximity prompt to it
		local _exp = villagerModel.Station.Parts.Resources:GetChildren()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(model)
			local proximityPromptyPart = Instance.new("Part", model)
			-- const resourceProximityPrompt = paths.Assets.ProximityPrompts.ResourcesPrompt.Clone()
			-- sets up the proximity prompt
			proximityPromptyPart.Name = "ProximityPromptPart"
			proximityPromptyPart.Anchored = true
			proximityPromptyPart.CanQuery = true
			proximityPromptyPart.Transparency = 1
			proximityPromptyPart.CanCollide = false
			proximityPromptyPart.Size = Vector3.zero
			proximityPromptyPart:PivotTo(model:GetPivot())
			-- resourceProximityPrompt.ActionText = `Collect`
			-- resourceProximityPrompt.Parent = proximityPromptyPart
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- adds model debugger
		addComponent(villagerEntity, ModelDebugger, villagerModel)
	end
	-- use event to watch for stealing
	for _binding in useEvent(MarketplaceService.PromptProductPurchaseFinished) do
		local userId = _binding[1]
		local productId = _binding[2]
		local wasPurchased = _binding[3]
		local player = Players:GetPlayerByUserId(userId)
		local playerEntity = player and getEntity.fromInstance(player)
		local _condition = playerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(playerEntity, TakeFromVillager)
		end
		local takeFromVillager = _condition
		local villagerEntity = takeFromVillager and takeFromVillager.villagerEntityToStealFrom
		local _condition_1 = villagerEntity
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			_condition_1 = world:get(villagerEntity, Villager)
		end
		local villagerInfo = _condition_1
		local model = villagerInfo and villagerInfo.villagerModel.Station.Parts.Resources:FindFirstChild(takeFromVillager.resourceModelName)
		local _condition_2 = (model and tonumber(takeFromVillager.resourceModelName))
		if not (_condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2) then
			_condition_2 = 0
		end
		local resourceIndex = _condition_2 - 1
		-- makes sure its from the villagers page
		if productId == 3315996934 then
			-- if the purchase was successful and the player exists
			local _condition_3 = wasPurchased and player
			if _condition_3 then
				_condition_3 = playerEntity
				if _condition_3 ~= 0 and _condition_3 == _condition_3 and _condition_3 then
					_condition_3 = takeFromVillager and villagerInfo and model and resourceIndex > -1
				end
			end
			if _condition_3 then
				-- const proximityPromptPart = model.FindFirstChild("ProximityPromptPart")
				-- const resourceProximityPrompt = proximityPromptPart?.FindFirstChild<ProximityPrompt>("ResourcesPrompt");
				local progression = villagerInfo.villagerData.Progress.Progression
				local variant = takeFromVillager.variant
				local produceName = takeFromVillager.produceName
				-- removes the produce from the data
				table.remove(progression.Resources, resourceIndex + 1)
				local _exp = villagerEntity
				local _object = table.clone(villagerInfo)
				setmetatable(_object, nil)
				addComponent(_exp, Villager, _object)
				-- adds the produce to the data
				printJecs(168, `{player.Name} took {takeFromVillager.produceName} with varaint {variant} from villager {villagerEntity}`)
				createEntity.insertProduce(playerEntity, produceName, variant)
				removeComponent(villagerEntity, MaxedOut)
				-- reduces the item by 1 
				routes.playSound:sendTo({
					sound = paths.SFX.UI.purchasepass,
					position = nil,
				}, player)
			else
				local _value = not wasPurchased and playerEntity
				if _value ~= 0 and _value == _value and _value then
					removeComponent(playerEntity, TakeFromVillager)
					routes.playSound:sendTo({
						sound = paths.SFX.UI.purchasefail,
						position = nil,
					}, player)
				end
			end
		end
	end
	-- when maxed out is removed set the start time
	for _, villagerEntity in world:query(TargetEntity):with(Removed(MaxedOut)) do
		local villagerComp = world:get(villagerEntity, Villager)
		if villagerComp then
			local _binding = villagerComp
			local villagerData = _binding.villagerData
			local progression = villagerData.Progress.Progression
			-- sets the start time to os.time
			progression.Time.StartTime = os.time()
			-- updates the villager component
			addComponent(villagerEntity, Villager, villagerComp)
		end
	end
	-- takes the villager through its transitions
	for villagerEntity, villagerComp, animator in world:query(Villager, VillagerAnimator):with(CanQuery(Villager)):without(MaxedOut) do
		local playerData = world:get(villagerComp.playerEntity, Data)
		local _binding = villagerComp
		local villagerData = _binding.villagerData
		local villagerModel = _binding.villagerModel
		local requiredResource = villagerData.Progress.Required
		local buildingTimes = villagerData.Progress.Building
		local timeTillFullyBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) - os.time()
		local resources = villagerData.Progress.Progression.Resources
		local progression = villagerData.Progress.Progression
		local totalResourcesSoFar = #resources
		local requiredProximityPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
		local villagerAnimationFolder = paths.Assets.Animations.Villager:FindFirstChild(villagerData.Name)
		local _productionAnimation = villagerAnimationFolder
		if _productionAnimation ~= nil then
			_productionAnimation = _productionAnimation:FindFirstChild("Production")
		end
		local productionAnimation = _productionAnimation
		-- toggles the interaction visiblity
		requiredProximityPrompt.ActionText = if (requiredResource and requiredResource.Amount < requiredResource.Max) then `Requires {requiredResource.Produce}` else ""
		-- requiredProximityPrompt.Enabled = requiredResource ? requiredResource.Amount < requiredResource.Max : false;
		-- if fully built then start progressing the foods
		if timeTillFullyBuilt < 0 then
			local maxResources = #villagerModel.Station.Parts.Resources:GetChildren()
			local hasMaxedResources = totalResourcesSoFar >= maxResources
			local totalTimeSinceLastResource = os.time() - progression.Time.StartTime
			local requiredTimePerResource = progression.Time.RequiredTimePerResource
			local hasMetRequiredTime = totalTimeSinceLastResource >= requiredTimePerResource and (not requiredResource or requiredResource.Amount > 0)
			local _result = playerData
			if _result ~= nil then
				_result = _result.Tutorial
			end
			local _condition = _result == 2
			if _condition then
				_condition = villagerData.Name == "Farmer"
			end
			local _result_1
			if _condition then
				_result_1 = 5
			else
				local _name = villagerData.Name
				local _result_2 = villagersProgressData[_name]
				if _result_2 ~= nil then
					_result_2 = _result_2.Progression.Time.RequiredTimePerResource
				end
				local _condition_1 = _result_2
				if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
					_condition_1 = 0
				end
				_result_1 = _condition_1
			end
			progression.Time.RequiredTimePerResource = _result_1
			-- if has maxed resources then
			if hasMaxedResources then
				addComponent(villagerEntity, MaxedOut)
			else
				-- if has met required time then
				if hasMetRequiredTime then
					-- takes the resource spot
					local _resources = progression.Resources
					local _arg0 = randomVariant()
					table.insert(_resources, _arg0)
					-- takes away from required
					if requiredResource then
						requiredResource.Amount -= 1
					end
					-- updates the start time
					progression.Time.StartTime = os.time() + math.max((totalTimeSinceLastResource - requiredTimePerResource), 0)
				elseif requiredResource and requiredResource.Amount <= 0 then
					-- if has not met required time and has no resources then
					progression.Time.StartTime = os.time()
				end
			end
		else
			progression.Time.StartTime = os.time()
		end
		-- updates the component
		addComponent(villagerEntity, Villager, villagerComp)
	end
	-- if a player has a produce all component then take their villagers and set their resources amount to the max
	for villagerEntity, villagerComp in world:query(Villager, ProduceAll):without(MaxedOut) do
		local _binding = villagerComp
		local villagerData = _binding.villagerData
		local villagerModel = _binding.villagerModel
		local buildingTimes = villagerData.Progress.Building
		local progression = villagerData.Progress.Progression
		local totalResources = #villagerData.Progress.Progression.Resources
		local maxResources = #villagerModel.Station.Parts.Resources:GetChildren()
		-- sets to fully built
		buildingTimes.TotalTime = 0
		-- loops through all resources and sets it to the max
		do
			local i = 0
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				if not (i < (maxResources - totalResources)) then
					break
				end
				local _resources = progression.Resources
				local _arg0 = randomVariant()
				table.insert(_resources, _arg0)
			end
		end
		-- removes its self
		addComponent(villagerEntity, Villager, villagerComp)
		removeComponent(villagerEntity, ProduceAll)
	end
	-- when ever player has produce all
	for playerEntity, villagers in world:query(ActiveVillagers, ProduceAll) do
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(_param)
			local entity = _param.entity
			-- if villager entity exists then
			if world:contains(entity) then
				-- adds produce all to villager
				addComponent(entity, ProduceAll)
			end
		end
		for _k, _v in villagers do
			_callback(_v, _k - 1, villagers)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- removes produce all from player
		removeComponent(playerEntity, ProduceAll)
	end
end
return {
	default = default,
}
