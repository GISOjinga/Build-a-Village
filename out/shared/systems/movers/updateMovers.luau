-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Debris = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Debris
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Body = _jecsComponents.Body
local Float = _jecsComponents.Float
local MoveTo = _jecsComponents.MoveTo
local TurnTo = _jecsComponents.TurnTo
local systemQueue = _jecsComponents.systemQueue
local AlignPosition = _jecsComponents.AlignPosition
local Removed = _jecsComponents.Removed
local ZeroOutVelocity = _jecsComponents.ZeroOutVelocity
local default = function(world)
	local delta = systemQueue:getDeltaTime()
	-- makes you float
	for entity, floatInfo in world:query(Float) do
		local _binding = floatInfo
		local duration = _binding.duration
		local linearVelocity = _binding.linearVelocity
		local bodyEntity = _binding.bodyEntity
		local body = world:get(bodyEntity, Body)
		-- sets up the floater
		linearVelocity.ForceLimitMode = Enum.ForceLimitMode.PerAxis
		linearVelocity.MaxAxesForce = Vector3.new(0, 1e10, 0)
		linearVelocity.VectorVelocity = Vector3.zero
		local _result = body
		if _result ~= nil then
			_result = _result.rootAttachment
		end
		linearVelocity.Attachment0 = _result
		linearVelocity.Name = "FloaterBodyVelocity"
		local _result_1 = body
		if _result_1 ~= nil then
			_result_1 = _result_1.rootPart
		end
		linearVelocity.Parent = _result_1
		-- counts down the floater
		if duration > 0 then
			local _world = world
			local _object = table.clone(floatInfo)
			setmetatable(_object, nil)
			_object.duration = duration - delta
			_world:set(entity, Float, _object)
		else
			-- destroys the floater
			linearVelocity:Destroy()
			-- destroys the entity
			world:delete(entity)
		end
	end
	-- for all zerooutvelocity entites
	for _, basePart in world:query(ZeroOutVelocity) do
		basePart.AssemblyLinearVelocity = Vector3.zero
	end
	-- updates AlignPosition
	for entity, _binding in world:query(AlignPosition) do
		local attachment1 = _binding.attachment1
		local attachment0 = _binding.attachment0
		local velocity = _binding.velocity
		local alignPosition = _binding.alignPosition
		alignPosition.Attachment0 = attachment0
		alignPosition.Attachment1 = attachment1
		alignPosition.MaxForce = 1e6
		alignPosition.Responsiveness = 200
		alignPosition.MaxVelocity = velocity
	end
	-- when align position is removed
	for entity, _binding in world:query(Removed(AlignPosition)) do
		local alignPosition = _binding.alignPosition
		alignPosition.MaxVelocity = 0
		Debris:AddItem(alignPosition, .1)
	end
	-- Loop through all entities with the TurnTo component
	for entity, moveTo in world:query(MoveTo) do
		local _binding = moveTo
		local direction = _binding.direction
		local destroyEntityOnComplete = _binding.destroyEntityOnComplete
		local forceLimitMode = _binding.forceLimitMode
		local linearVelocity = _binding.linearVelocity
		local attachment = _binding.attachment
		local duration = _binding.duration
		local decelerationRate = _binding.decelerationRate
		local maxAxesForce = _binding.maxAxesForce
		local maxForce = _binding.maxForce
		local relativeTo = _binding.relativeTo
		local onDestroyedCallback = _binding.onDestroyedCallback
		-- Setup align orientation
		linearVelocity.RelativeTo = relativeTo or Enum.ActuatorRelativeTo.World
		linearVelocity.ForceLimitMode = forceLimitMode or linearVelocity.ForceLimitMode
		linearVelocity.VectorVelocity = direction
		linearVelocity.MaxAxesForce = maxAxesForce or Vector3.one * 1e6
		local _condition = maxForce
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = 1e6
		end
		linearVelocity.MaxForce = _condition
		linearVelocity.Attachment0 = attachment
		pcall(function()
			linearVelocity.Parent = attachment
			return linearVelocity.Parent
		end)
		-- does the count down
		local _condition_1 = duration
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			_condition_1 = duration > 0
		end
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			local currentSpeed = direction.Magnitude
			local newSpeed = if decelerationRate ~= 0 and decelerationRate == decelerationRate and decelerationRate then math.max(currentSpeed - decelerationRate * delta, 0) else currentSpeed
			-- destroys the align orientation
			local _world = world
			local _object = table.clone(moveTo)
			setmetatable(_object, nil)
			_object.duration = duration - delta
			_object.direction = if currentSpeed > 0 then direction.Unit * newSpeed else Vector3.new(0, 0, 0)
			_world:set(entity, MoveTo, _object)
		else
			local _condition_2 = duration == 0
			if not _condition_2 then
				local _condition_3 = duration
				if _condition_3 ~= 0 and _condition_3 == _condition_3 and _condition_3 then
					_condition_3 = duration <= 0
				end
				_condition_2 = _condition_3
			end
			if _condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2 then
				-- destroys the align orientation
				pcall(function()
					return linearVelocity:Destroy()
				end)
				-- destroys the entity
				if destroyEntityOnComplete then
					local _result = onDestroyedCallback
					if _result ~= nil then
						_result()
					end
					world:delete(entity)
				else
					world:remove(entity, MoveTo)
				end
			end
		end
	end
	-- Loop through all entities with the TurnTo component
	for entity, turnTo in world:query(TurnTo) do
		local _binding = turnTo
		local destroyEntityOnComplete = _binding.destroyEntityOnComplete
		local maxTorque = _binding.maxTorque
		local target = _binding.target
		local responsiveness = _binding.responsiveness
		local alignOrientation = _binding.alignOrientation
		local attachment = _binding.attachment
		-- Setup align orientation 
		alignOrientation.Mode = Enum.OrientationAlignmentMode.OneAttachment
		local _condition = maxTorque
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = 1e6
		end
		alignOrientation.MaxTorque = _condition
		local _condition_1 = responsiveness
		if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
			_condition_1 = 100
		end
		alignOrientation.Responsiveness = _condition_1
		alignOrientation.CFrame = attachment.WorldCFrame
		alignOrientation.Attachment0 = attachment
		-- Update the align orientation
		alignOrientation.CFrame = CFrame.lookAt(attachment.WorldPosition, if typeof(target) == "Instance" then target.Position else target)
		-- does the count down
		if turnTo.duration > 0 then
			local _world = world
			local _object = table.clone(turnTo)
			setmetatable(_object, nil)
			_object.duration = turnTo.duration - delta
			_world:set(entity, TurnTo, _object)
		else
			-- destroys the align orientation
			alignOrientation:Destroy()
			-- destroys the entity
			if destroyEntityOnComplete then
				world:delete(entity)
			else
				world:remove(entity, TurnTo)
			end
		end
	end
end
return {
	default = default,
}
