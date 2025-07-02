-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local ContentProvider = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").ContentProvider
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local removeComponent = _jecsHelpFunctions.removeComponent
local warnJecs = _jecsHelpFunctions.warnJecs
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Body = _jecsComponents.Body
local LoadedAnimations = _jecsComponents.LoadedAnimations
local LoadingAnimations = _jecsComponents.LoadingAnimations
local Villager = _jecsComponents.Villager
local VillagerAnimator = _jecsComponents.VillagerAnimator
local Removed = _jecsComponents.Removed
local TargetEntity = _jecsComponents.TargetEntity
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
task.spawn(function()
	local _exp = paths.Assets.Animations:GetDescendants()
	-- ▼ ReadonlyArray.filter ▼
	local _newValue = {}
	local _callback = function(asset)
		return asset:IsA("Animation")
	end
	local _length = 0
	for _k, _v in _exp do
		if _callback(_v, _k - 1, _exp) == true then
			_length += 1
			_newValue[_length] = _v
		end
	end
	-- ▲ ReadonlyArray.filter ▲
	return ContentProvider:PreloadAsync(_newValue)
end)
-- list of all animations
local savedAnimationTracks = setmetatable({}, {
	__mode = "k",
})
-- to get the animation
local function getAnimation(animator, animation)
	local _animator = animator
	local _track = savedAnimationTracks[_animator]
	if _track ~= nil then
		local _animation = animation
		_track = _track[_animation]
	end
	local track = _track
	if not track then
		track = animator:LoadAnimation(animation)
		local _animator_1 = animator
		if not (savedAnimationTracks[_animator_1] ~= nil) then
			local _animator_2 = animator
			savedAnimationTracks[_animator_2] = {}
		end
		local _animator_2 = animator
		local _exp = savedAnimationTracks[_animator_2]
		local _animation = animation
		local _track_1 = track
		_exp[_animation] = _track_1
	end
	return track
end
local default = function(world)
	-- villagers without loading animations
	for entity, _binding in world:query(Villager):without(LoadingAnimations) do
		local villagerModel = _binding.villagerModel
		TS.Promise.try(function()
			if not villagerModel:FindFirstChild("Npc") then
				return nil
			end
			local animator = Instance.new("Animator", villagerModel.Npc.Humanoid)
			local animations = {}
			local totalToLoad = 0
			-- loops through all assets for animations to load
			local _exp = paths.Assets.Animations:GetDescendants()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(asset)
				if asset:IsA("Animation") then
					local loadedAnimation = animator:LoadAnimation(asset)
					-- saves the animation
					totalToLoad += 1
					local _asset = asset
					animations[_asset] = loadedAnimation
				end
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			-- saves it to the entity
			addComponent(entity, LoadedAnimations)
			addComponent(entity, LoadingAnimations)
			addComponent(entity, VillagerAnimator, animator)
			savedAnimationTracks[animator] = animations
		end):catch(function(err)
			return warnJecs(57, "Error loading animations for villager: ", entity)
		end)
	end
	-- for all bodies with out loaded animations
	for entity, _binding in world:query(Body):without(LoadingAnimations) do
		local animator = _binding.animator
		TS.Promise.try(function()
			local animations = {}
			local totalToLoad = 0
			-- loops through all assets for animations to load
			local _exp = paths.Assets.Animations:GetDescendants()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(asset)
				if asset:IsA("Animation") then
					local loadedAnimation = animator:LoadAnimation(asset)
					-- saves the animation
					totalToLoad += 1
					local _asset = asset
					animations[_asset] = loadedAnimation
				end
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			-- saves it to the entity
			addComponent(entity, LoadingAnimations)
			addComponent(entity, LoadedAnimations)
			savedAnimationTracks[animator] = animations
		end):catch(function(err)
			return warnJecs(84, "Error loading animations for body: ", entity)
		end)
	end
	-- if body gets removed then remove loading animation and loaded animations
	for _, entity, _binding in world:query(TargetEntity, Removed(Body)) do
		local animator = _binding.animator
		TS.Promise.try(function()
			if not animator then
				return nil
			end
			-- remove loading animations
			if world:contains(entity) then
				removeComponent(entity, LoadingAnimations, LoadedAnimations)
			end
			-- remove saved animations
			savedAnimationTracks[animator] = nil
		end):catch(function(err)
			return warnJecs(96, "Error removing animations for body: ", entity)
		end)
	end
end
return {
	getAnimation = getAnimation,
	savedAnimationTracks = savedAnimationTracks,
	default = default,
}
