-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local deepEquals = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepEquals
local getAnimation = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "animator", "loadAnimations").getAnimation
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local warnJecs = _jecsHelpFunctions.warnJecs
local warnTS = _jecsHelpFunctions.warnTS
local _particlesFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "particlesFunctions")
local particlesEmit = _particlesFunctions.particlesEmit
local particlesToggle = _particlesFunctions.particlesToggle
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local CanQuery = _jecsComponents.CanQuery
local ReplicatedComponent = _jecsComponents.ReplicatedComponent
local TargetEntity = _jecsComponents.TargetEntity
local Villager = _jecsComponents.Villager
local VillagerAnimator = _jecsComponents.VillagerAnimator
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- function to togggle transparency
local toggleTransparency = function(_instance, visible, customInvis)
	if customInvis == nil then
		customInvis = 1
	end
	local instance = _instance
	-- if the instance is a BasePart or Decal then
	if instance:IsA("BasePart") or instance:IsA("Decal") then
		local realTransparency = instance:GetAttribute("Transparency")
		local trueTransparency = if realTransparency ~= nil then realTransparency else instance.Transparency
		-- set up
		instance:SetAttribute("Transparency", trueTransparency)
		instance.Transparency = if visible then trueTransparency else customInvis
		if instance:IsA("BasePart") then
			instance.CollisionGroup = if visible then "Default" else "NoCollision"
		end
	end
end
local villageModelStates = setmetatable({}, {
	__mode = "k",
})
local villagerPartCaches = setmetatable({}, {
	__mode = "k",
})
local function cacheVillagerParts(villagerModel)
	local _villagerModel = villagerModel
	local cache = villagerPartCaches[_villagerModel]
	if not cache then
		local _object = {
			resourcesGroup = villagerModel.Station.Parts.Resources:GetDescendants(),
			progressFull = villagerModel.Station.Parts.ProgressFull:GetDescendants(),
			stationParts = villagerModel.Station.Parts.StationParts:GetDescendants(),
			npc = villagerModel.Npc:GetDescendants(),
			accessories = villagerModel.Accessories:GetDescendants(),
		}
		local _left = "inProgress"
		local _exp = villagerModel.Station.Parts.InProgress:GetChildren()
		-- ▼ ReadonlyArray.map ▼
		local _newValue = table.create(#_exp)
		local _callback = function(child)
			local _object_1 = {}
			local _left_1 = "phase"
			local _condition = tonumber(child.Name)
			if not (_condition ~= 0 and _condition == _condition and _condition) then
				_condition = 1
			end
			_object_1[_left_1] = _condition
			_object_1.parts = child:GetDescendants()
			return _object_1
		end
		for _k, _v in _exp do
			_newValue[_k] = _callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.map ▲
		_object[_left] = _newValue
		local _left_1 = "resourceModels"
		local _exp_1 = villagerModel.Station.Parts.Resources:GetChildren()
		-- ▼ ReadonlyArray.map ▼
		local _newValue_1 = table.create(#_exp_1)
		local _callback_1 = function(model)
			return {
				model = model,
				parts = model:GetDescendants(),
			}
		end
		for _k, _v in _exp_1 do
			_newValue_1[_k] = _callback_1(_v, _k - 1, _exp_1)
		end
		-- ▲ ReadonlyArray.map ▲
		_object[_left_1] = _newValue_1
		cache = _object
		local _villagerModel_1 = villagerModel
		local _cache = cache
		villagerPartCaches[_villagerModel_1] = _cache
	end
	return cache
end
-- change village model state
local function updateVillagerState(villagerModel, newState)
	local _villagerModel = villagerModel
	local _condition = not (villageModelStates[_villagerModel] ~= nil)
	if not _condition then
		local _villagerModel_1 = villagerModel
		_condition = not deepEquals(villageModelStates[_villagerModel_1], newState)
	end
	if _condition then
		local parts = cacheVillagerParts(villagerModel)
		local _exp = parts.resourcesGroup
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(child)
			return toggleTransparency(child, false)
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local _exp_1 = parts.inProgress
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(cache)
			local _exp_2 = cache.parts
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_2 = function(child)
				return toggleTransparency(child, false)
			end
			for _k, _v in _exp_2 do
				_callback_2(_v, _k - 1, _exp_2)
			end
			-- ▲ ReadonlyArray.forEach ▲
			return nil
		end
		for _k, _v in _exp_1 do
			_callback_1(_v, _k - 1, _exp_1)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local _exp_2 = parts.progressFull
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_2 = function(child)
			return toggleTransparency(child, false)
		end
		for _k, _v in _exp_2 do
			_callback_2(_v, _k - 1, _exp_2)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local _exp_3 = parts.stationParts
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_3 = function(child)
			return toggleTransparency(child, false)
		end
		for _k, _v in _exp_3 do
			_callback_3(_v, _k - 1, _exp_3)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local _exp_4 = parts.npc
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_4 = function(child)
			return toggleTransparency(child, false)
		end
		for _k, _v in _exp_4 do
			_callback_4(_v, _k - 1, _exp_4)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local _exp_5 = parts.accessories
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_5 = function(child)
			return toggleTransparency(child, false)
		end
		for _k, _v in _exp_5 do
			_callback_5(_v, _k - 1, _exp_5)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- if maxed then
		if newState.isBeingBuilt then
			local _exp_6 = parts.progressFull
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_6 = function(child)
				return toggleTransparency(child, false, .5)
			end
			for _k, _v in _exp_6 do
				_callback_6(_v, _k - 1, _exp_6)
			end
			-- ▲ ReadonlyArray.forEach ▲
			local _exp_7 = parts.stationParts
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_7 = function(child)
				return toggleTransparency(child, false, .5)
			end
			for _k, _v in _exp_7 do
				_callback_7(_v, _k - 1, _exp_7)
			end
			-- ▲ ReadonlyArray.forEach ▲
			local _exp_8 = parts.resourcesGroup
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_8 = function(child)
				return toggleTransparency(child, false, .5)
			end
			for _k, _v in _exp_8 do
				_callback_8(_v, _k - 1, _exp_8)
			end
			-- ▲ ReadonlyArray.forEach ▲
		else
			local _exp_6 = parts.npc
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_6 = function(child)
				return toggleTransparency(child, true)
			end
			for _k, _v in _exp_6 do
				_callback_6(_v, _k - 1, _exp_6)
			end
			-- ▲ ReadonlyArray.forEach ▲
			local _exp_7 = parts.accessories
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_7 = function(child)
				return toggleTransparency(child, true)
			end
			for _k, _v in _exp_7 do
				_callback_7(_v, _k - 1, _exp_7)
			end
			-- ▲ ReadonlyArray.forEach ▲
			local _exp_8 = parts.stationParts
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_8 = function(child)
				return toggleTransparency(child, true)
			end
			for _k, _v in _exp_8 do
				_callback_8(_v, _k - 1, _exp_8)
			end
			-- ▲ ReadonlyArray.forEach ▲
			if newState.hasMaxedResources then
				local _exp_9 = parts.progressFull
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_9 = function(child)
					return toggleTransparency(child, true)
				end
				for _k, _v in _exp_9 do
					_callback_9(_v, _k - 1, _exp_9)
				end
				-- ▲ ReadonlyArray.forEach ▲
				local _exp_10 = parts.resourcesGroup
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_10 = function(child)
					return toggleTransparency(child, true)
				end
				for _k, _v in _exp_10 do
					_callback_10(_v, _k - 1, _exp_10)
				end
				-- ▲ ReadonlyArray.forEach ▲
			else
				-- toggles the in progress parts
				local _exp_9 = parts.inProgress
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_9 = function(_param)
					local phase = _param.phase
					local phaseParts = _param.parts
					local visible = phase <= newState.currentInProgressPhase
					-- ▼ ReadonlyArray.forEach ▼
					local _callback_10 = function(descendant)
						return toggleTransparency(descendant, visible)
					end
					for _k, _v in phaseParts do
						_callback_10(_v, _k - 1, phaseParts)
					end
					-- ▲ ReadonlyArray.forEach ▲
				end
				for _k, _v in _exp_9 do
					_callback_9(_v, _k - 1, _exp_9)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
			-- toggles the station parts
			local _exp_9 = parts.resourceModels
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_9 = function(_param)
				local resourceModel = _param.model
				local resParts = _param.parts
				local _condition_1 = tonumber(resourceModel.Name)
				if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
					_condition_1 = 0
				end
				local modelIndex = _condition_1 - 1
				local resourcePartParticles = resourceModel:FindFirstChild("__ResourceParticles__")
				local variant = newState.resources[modelIndex + 1]
				resourceModel:SetAttribute("Ready", if variant then true else false)
				resourceModel:SetAttribute("ProduceName", newState.produce)
				resourceModel:SetAttribute("Variant", variant)
				if resourcePartParticles then
					particlesToggle(resourcePartParticles, false)
				end
				if modelIndex > -1 and resourcePartParticles and variant then
					local particleAttachment = resourcePartParticles:FindFirstChild(variant)
					-- if the resource particles data exists then
					-- ▼ ReadonlyArray.forEach ▼
					local _callback_10 = function(child)
						return toggleTransparency(child, true)
					end
					for _k, _v in resParts do
						_callback_10(_v, _k - 1, resParts)
					end
					-- ▲ ReadonlyArray.forEach ▲
					-- toggles the particles
					if particleAttachment then
						particlesToggle(particleAttachment, variant == "Gold" or variant == "Rainbow")
					end
				end
			end
			for _k, _v in _exp_9 do
				_callback_9(_v, _k - 1, _exp_9)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		-- where the transparancey changes
		local _villagerModel_1 = villagerModel
		local _newState = newState
		villageModelStates[_villagerModel_1] = _newState
	end
end
local default = function(world)
	-- when villager is added but not fully built then
	for _, _binding in world:query(Added(Villager)) do
		local villagerModel = _binding.villagerModel
		TS.Promise.try(function()
			-- loops through all the resource models and add their attachments
			local _exp = villagerModel.Station.Parts.Resources:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(model)
				local resourcePartParticles = model:FindFirstChild("__ResourceParticles__") or Instance.new("Part")
				local goldAttachment = paths.Assets.Particles.Gold:Clone()
				local rainbowAttachment = paths.Assets.Particles.Rainbow:Clone()
				-- sets up the part
				resourcePartParticles.Name = "__ResourceParticles__"
				resourcePartParticles.Size = Vector3.zero
				resourcePartParticles.CFrame = model:GetPivot()
				resourcePartParticles.Anchored = true
				resourcePartParticles.CanCollide = false
				resourcePartParticles.Transparency = 1
				resourcePartParticles.CanQuery = false
				resourcePartParticles.Parent = model
				-- set up particles
				goldAttachment.Parent = resourcePartParticles
				rainbowAttachment.Parent = resourcePartParticles
				goldAttachment.Position = Vector3.zero
				rainbowAttachment.Position = Vector3.zero
				particlesToggle(goldAttachment, false)
				particlesToggle(rainbowAttachment, false)
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			cacheVillagerParts(villagerModel)
		end):catch(function(err)
			return warnJecs(167, "Villager", "Error setting up villager model particles", err)
		end)
	end
	-- when vilalger animator gets added
	for _, villagerEntity, animator in world:query(TargetEntity, Added(VillagerAnimator)) do
		TS.Promise.try(function()
			local villagerComp = world:get(villagerEntity, Villager)
			-- if the villager component exists then
			if villagerComp then
				local _binding = villagerComp
				local villagerData = _binding.villagerData
				local villagerModel = _binding.villagerModel
				local villagerAnimationFolder = paths.Assets.Animations.Villager:FindFirstChild(villagerData.Name)
				local _productionAnimation = villagerAnimationFolder
				if _productionAnimation ~= nil then
					_productionAnimation = _productionAnimation:FindFirstChild("Production")
				end
				local productionAnimation = _productionAnimation
				local productionTrack = productionAnimation and getAnimation(animator, productionAnimation)
				local sleepTrack = getAnimation(animator, paths.Assets.Animations.Villager.Sleep)
				-- plays the idle animation
				if productionTrack and sleepTrack then
					productionTrack:GetMarkerReachedSignal("impact"):Connect(function()
						return particlesEmit(villagerModel.Station.Particles)
					end)
				end
			end
		end):catch(function(err)
			return warnJecs(186, "Villager", "Error setting up villager animator", err)
		end)
	end
	-- controls the animations
	for _, _binding, animator in world:query(Villager, VillagerAnimator):with(CanQuery(Villager)) do
		local villagerData = _binding.villagerData
		local villagerModel = _binding.villagerModel
		TS.Promise.try(function()
			local villagerAnimationFolder = paths.Assets.Animations.Villager:FindFirstChild(villagerData.Name)
			local _productionAnimation = villagerAnimationFolder
			if _productionAnimation ~= nil then
				_productionAnimation = _productionAnimation:FindFirstChild("Production")
			end
			local productionAnimation = _productionAnimation
			local productionTrack = productionAnimation and getAnimation(animator, productionAnimation)
			local sleepTrack = getAnimation(animator, paths.Assets.Animations.Villager.Sleep)
			local progress = villagerData.Progress
			local progression = progress.Progression
			local buildingTimes = progress.Building
			local isBeingBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) > os.time()
			local requiredResource = progress.Required
			local resources = progression.Resources
			local totalResourcesSoFar = #resources
			local maxResources = #villagerModel.Station.Parts.Resources:GetChildren()
			local forceSleep = (maxResources == totalResourcesSoFar) or (requiredResource and requiredResource.Amount < 1)
			-- plays the idle animation
			if productionTrack and sleepTrack then
				productionTrack.Looped = true
				sleepTrack.Looped = true
				-- plays the idle animation
				if isBeingBuilt then
					sleepTrack:Stop(.1)
					productionTrack:Stop(.1)
				elseif forceSleep then
					if not sleepTrack.IsPlaying then
						sleepTrack:Play(.1)
						productionTrack:Stop(.1)
					end
				else
					if not productionTrack.IsPlaying then
						productionTrack:Play(.1)
						sleepTrack:Stop(.1)
					end
				end
			end
		end):catch(function(err)
			return warnJecs(226, "Villager", "Error setting up villager animations", err)
		end)
	end
	-- watches for changes
	for villagerClientEntity, villagerInfo in world:query(Villager):with(CanQuery(Villager)) do
		TS.Promise.try(function()
			local villagerEntity = world:get(villagerClientEntity, ReplicatedComponent)
			-- const oldChange = changedVillager.old
			-- const newChange = changedVillager.new
			-- const villagerInfo = newChange || oldChange;
			-- if one of the changes
			local _value = villagerInfo and villagerEntity
			if _value ~= 0 and _value == _value and _value then
				local _binding = villagerInfo
				local villagerData = _binding.villagerData
				local villagerModel = _binding.villagerModel
				local playerEntity = _binding.playerEntity
				local progress = villagerData.Progress
				local progression = progress.Progression
				local buildingTimes = progress.Building
				local isBeingBuilt = (buildingTimes.StartTime + buildingTimes.TotalTime) > os.time()
				local resources = progression.Resources
				local totalResourcesSoFar = #resources
				local maxResources = #villagerModel.Station.Parts.Resources:GetChildren()
				local hasMaxedResources = totalResourcesSoFar >= maxResources
				local maxInProgressPhases = #villagerModel.Station.Parts.InProgress:GetChildren()
				local totalTimeSinceLastResource = os.time() - progression.Time.StartTime
				local requiredTimePerResource = progression.Time.RequiredTimePerResource
				local inProgressPercentile = totalTimeSinceLastResource / requiredTimePerResource
				local currentInProgressPhase = math.floor(math.max(1, maxInProgressPhases * inProgressPercentile))
				updateVillagerState(villagerModel, {
					isBeingBuilt = isBeingBuilt,
					hasMaxedResources = hasMaxedResources,
					currentInProgressPhase = if hasMaxedResources then 1 else currentInProgressPhase,
					resources = progression.Resources,
					produce = villagerData.Progress.Produce,
				})
			end
		end):catch(function(err)
			return warnTS(261, "Villager", "Error updating villager state", err)
		end)
	end
end
return {
	default = default,
}
