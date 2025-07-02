-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local createMotion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "ripple", "src").createMotion
local Workspace = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Workspace
-- this will loop through all descendannts for particles and emit a certian amount
local function particlesEmit(instance, amount)
	local _exp = instance:GetDescendants()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(descendant)
		if descendant:IsA("ParticleEmitter") then
			local _descendant = descendant
			local _condition = amount
			if not (_condition ~= 0 and _condition == _condition and _condition) then
				_condition = descendant:GetAttribute("EmitCount")
				if not (_condition ~= 0 and _condition == _condition and _condition) then
					_condition = 1
				end
			end
			_descendant:Emit(_condition)
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
-- loops through particles toggling their ennabledd
local function particlesToggle(instance, toggle)
	local _exp = instance:GetDescendants()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(descendant)
		if descendant:IsA("ParticleEmitter") then
			descendant.Enabled = toggle
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
-- loops through particles toggling their ennabledd
local function pointLightToggle(instance, toggle)
	local _exp = instance:GetDescendants()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(descendant)
		if descendant:IsA("PointLight") then
			descendant.Enabled = toggle
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
-- adds a parrticle to a location and emits it
local function addParticleAttachmentToLocation(attachment, amount, CFrame, destroyTime)
	local newParticle = attachment:Clone()
	-- setup
	newParticle.Parent = Workspace.Terrain
	newParticle.CFrame = CFrame
	particlesEmit(newParticle, amount)
end
-- function to get you the keypoints mapped
local function getKeyPointsMapped(particles, property)
	local originalKeyPoints = {}
	-- loops through all the particles and maps the original key points
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(particle)
		-- sets the particle
		local _particle = particle
		originalKeyPoints[_particle] = {}
		-- loops through each keypoint to be added
		local _exp = particle[property].Keypoints
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(keypoint)
			local _particle_1 = particle
			local _result = originalKeyPoints[_particle_1]
			if _result ~= nil then
				local _keypoint = keypoint
				table.insert(_result, _keypoint)
			end
		end
		for _k, _v in _exp do
			_callback_1(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	for _k, _v in particles do
		_callback(_v, _k - 1, particles)
	end
	-- ▲ ReadonlyArray.forEach ▲
	return originalKeyPoints
end
-- update particles Keypoints
local function updateParticlesKeypoints(percentile, property, originalKeyPoints)
	-- ▼ ReadonlyMap.forEach ▼
	local _callback = function(keypoints, particle)
		local newKeyPoints = {}
		-- loops through each keypoint to be added
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(keypoint, index)
			newKeyPoints[index + 1] = NumberSequenceKeypoint.new(keypoint.Time, if property == "Size" then (keypoint.Value * percentile) else (keypoint.Value + ((1 - keypoint.Value) * (1 - percentile))), keypoint.Envelope)
		end
		for _k, _v in keypoints do
			_callback_1(_v, _k - 1, keypoints)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- sets the keypoints
		particle[property] = NumberSequence.new(newKeyPoints)
	end
	for _k, _v in originalKeyPoints do
		_callback(_v, _k, originalKeyPoints)
	end
	-- ▲ ReadonlyMap.forEach ▲
end
-- particles tween to 0
local function particlesTweenToZero(properties, particles, time)
	local originalSizeKeyPoints = table.find(properties, "Size") ~= nil and getKeyPointsMapped(particles, "Size")
	local originalTransparencyKeyPoints = table.find(properties, "Transparency") ~= nil and getKeyPointsMapped(particles, "Transparency")
	local fakeTween = createMotion(1, {
		start = true,
	})
	-- for each step lerps each keypoint to 0
	fakeTween:onStep(function(percentile)
		-- loops through all the particles and maps the original key points
		if originalSizeKeyPoints then
			updateParticlesKeypoints(percentile, "Size", originalSizeKeyPoints)
		end
		if originalTransparencyKeyPoints then
			updateParticlesKeypoints(percentile, "Transparency", originalTransparencyKeyPoints)
		end
	end)
	-- when completed destroys itself
	fakeTween:onComplete(function()
		return fakeTween:destroy()
	end)
	-- plays the tween
	fakeTween:tween(0, {
		time = time,
	})
end
return {
	particlesEmit = particlesEmit,
	particlesToggle = particlesToggle,
	pointLightToggle = pointLightToggle,
	addParticleAttachmentToLocation = addParticleAttachmentToLocation,
	particlesTweenToZero = particlesTweenToZero,
}
