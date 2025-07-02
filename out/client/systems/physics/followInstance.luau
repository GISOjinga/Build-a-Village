-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local FollowInstance = _jecsComponents.FollowInstance
local systemQueue = _jecsComponents.systemQueue
-- smoots out lerp
local function lerpSmoothing(startPos, endPos, deltaTime, smoothFactor)
	-- Ensure smoothFactor is clamped between 0 and 1
	smoothFactor = math.clamp(smoothFactor, 0, 1)
	local _startPos = startPos
	local _condition = typeof(_startPos) == "Vector3"
	if _condition then
		local _endPos = endPos
		_condition = typeof(_endPos) == "Vector3"
	end
	if _condition then
		return startPos:Lerp(endPos, deltaTime * smoothFactor)
	else
		local _startPos_1 = startPos
		local _condition_1 = typeof(_startPos_1) == "CFrame"
		if _condition_1 then
			local _endPos = endPos
			_condition_1 = typeof(_endPos) == "CFrame"
		end
		if _condition_1 then
			return startPos:Lerp(endPos, deltaTime * smoothFactor)
		else
			error("lerpSmoothing: startPos and endPos must be of the same type (Vector3 or CFrame)")
		end
	end
end
-- emits the particles
local default = function(world)
	local delta = systemQueue:getDeltaTime()
	-- for every single particle emitter
	for emitEntity, _binding in world:query(FollowInstance) do
		local appliedTo = _binding.appliedTo
		local appliedFor = _binding.appliedFor
		local offset = _binding.offset
		local speed = _binding.speed
		if not appliedTo.Parent or not appliedFor.Parent then
			world:delete(emitEntity)
		else
			local startPosition = appliedTo.Position
			local _cFrame = appliedFor.CFrame
			local _cFrame_1 = CFrame.new(offset or Vector3.zero)
			local goal = _cFrame * _cFrame_1
			local directionToGoal = goal.Position - startPosition
			local distanceToGo = math.min(delta * speed, directionToGoal.Magnitude)
			local totalDistanceToGo = directionToGoal.Unit * distanceToGo
			local _arg0 = if totalDistanceToGo == totalDistanceToGo then totalDistanceToGo else Vector3.zero
			local newPosition = startPosition + _arg0
			-- moves it to goal
			local _cFrame_2 = CFrame.new(newPosition)
			local _rotation = goal.Rotation
			appliedTo.CFrame = _cFrame_2 * _rotation
		end
	end
end
return {
	default = default,
}
