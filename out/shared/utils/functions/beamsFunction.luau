-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local createMotion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "ripple", "src").createMotion
-- loops through beams toggling their ennabledd
local function beamsToggle(instance, toggle)
	local _exp = instance:GetDescendants()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(descendant)
		if descendant:IsA("Beam") then
			descendant.Enabled = toggle
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
-- function to get you the keypoints mapped
local function getKeyPointsMapped(beams, property)
	local originalKeyPoints = {}
	-- loops through all the beams and maps the original key points
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(beam)
		-- sets the beam
		local _beam = beam
		originalKeyPoints[_beam] = {}
		-- loops through each keypoint to be added
		local _exp = beam[property].Keypoints
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(keypoint)
			local _beam_1 = beam
			local _result = originalKeyPoints[_beam_1]
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
	for _k, _v in beams do
		_callback(_v, _k - 1, beams)
	end
	-- ▲ ReadonlyArray.forEach ▲
	return originalKeyPoints
end
-- update beams Keypoints
local function updateBeamsKeypoints(percentile, property, originalKeyPoints)
	-- ▼ ReadonlyMap.forEach ▼
	local _callback = function(keypoints, beam)
		local newKeyPoints = {}
		-- loops through each keypoint to be added
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(keypoint, index)
			newKeyPoints[index + 1] = NumberSequenceKeypoint.new(keypoint.Time, (keypoint.Value + ((1 - keypoint.Value) * (1 - percentile))), keypoint.Envelope)
		end
		for _k, _v in keypoints do
			_callback_1(_v, _k - 1, keypoints)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- sets the keypoints
		beam[property] = NumberSequence.new(newKeyPoints)
	end
	for _k, _v in originalKeyPoints do
		_callback(_v, _k, originalKeyPoints)
	end
	-- ▲ ReadonlyMap.forEach ▲
end
-- beams tween to 0
local function beamsTweenToZero(properties, beams, time)
	local originalTransparencyKeyPoints = table.find(properties, "Transparency") ~= nil and getKeyPointsMapped(beams, "Transparency")
	local fakeTween = createMotion(1, {
		start = true,
	})
	-- for each step lerps each keypoint to 0
	fakeTween:onStep(function(percentile)
		-- loops through all the beams and maps the original key points
		if originalTransparencyKeyPoints then
			updateBeamsKeypoints(percentile, "Transparency", originalTransparencyKeyPoints)
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
	beamsToggle = beamsToggle,
	beamsTweenToZero = beamsTweenToZero,
}
