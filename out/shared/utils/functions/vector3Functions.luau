-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Workspace = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Workspace
--[[
	*
	 * Given the CFrame and Size of a cube, this function returns the closest surface position.
	 *
	 * @param {CFrame} areaCFrame - The CFrame of the area (cube).
	 * @param {Vector3} areaSize - The Size of the area (cube).
	 * @param {Vector3} targetPosition - The target position to find the closest surface position to.
	 * @returns {Vector3} - The closest surface position on the cube.
	 
]]
local function vector3GetPointOnSurface(areaCFrame, areaSize, _targetPosition)
	local __targetPosition = _targetPosition
	local _position = areaCFrame.Position
	local direction = (__targetPosition - _position).Unit
	local _position_1 = areaCFrame.Position
	local _arg0 = direction * 100
	local targetPosition = _position_1 + _arg0
	-- Calculate half sizes of the cube
	local halfSize = areaSize / 2
	-- Convert the target position to the local space of the cube
	local localPosition = areaCFrame:PointToObjectSpace(targetPosition)
	-- Clamp the local position to the bounds of the cube to find the closest point on the surface
	local clampedLocalPosition = Vector3.new(math.clamp(localPosition.X, -halfSize.X, halfSize.X), math.clamp(localPosition.Y, -halfSize.Y, halfSize.Y), math.clamp(localPosition.Z, -halfSize.Z, halfSize.Z))
	-- Convert the clamped local position back to world space
	local surfacePosition = areaCFrame:PointToWorldSpace(clampedLocalPosition)
	return surfacePosition
end
local CreateVisualizer
do
	CreateVisualizer = setmetatable({}, {
		__tostring = function()
			return "CreateVisualizer"
		end,
	})
	CreateVisualizer.__index = CreateVisualizer
	function CreateVisualizer.new(...)
		local self = setmetatable({}, CreateVisualizer)
		return self:constructor(...) or self
	end
	function CreateVisualizer:constructor(parent)
		local beam = Instance.new("Beam")
		local container = Instance.new("Attachment")
		-- Creating the first attachment
		self.attachment0 = Instance.new("Attachment")
		self.attachment0.Parent = container
		-- Creating the second attachment
		self.attachment1 = Instance.new("Attachment")
		self.attachment1.Parent = container
		-- sets up beam
		beam.Parent = container
		beam.Attachment0 = self.attachment0
		beam.Attachment1 = self.attachment1
		beam.FaceCamera = true
		beam.Width0 = 0.1
		beam.Width1 = 0.1
		beam.Transparency = NumberSequence.new(0)
		beam.Color = ColorSequence.new(Color3.fromRGB(255, 0, 0))
		beam.LightEmission = 1
		self.beam = beam
		-- Creating the folder that will hold the attachments
		container.Name = "RayVisualizer"
		container.Parent = parent or Workspace.Terrain
		self.container = container
	end
	function CreateVisualizer:SetColor(color)
		self.beam.Color = ColorSequence.new(color)
		return self
	end
	function CreateVisualizer:MoveTo(startPoint, directionOrEndPoint, length)
		if length ~= nil then
			-- If length is provided, calculate the end point using the direction and length
			local direction = directionOrEndPoint.Unit
			local _startPoint = startPoint
			local _length = length
			local _arg0 = direction * _length
			local endPoint = _startPoint + _arg0
			self.attachment1.WorldPosition = endPoint
			self.attachment0.WorldPosition = startPoint
		else
			-- Otherwise, use the second method with start and end points
			self.attachment1.WorldPosition = directionOrEndPoint
			self.attachment0.WorldPosition = startPoint
		end
	end
	function CreateVisualizer:Destroy()
		self.container:Destroy()
	end
end
-- tells you if the params of two vectors are equal
local isVectorAxisEqual = function(a, b, axis)
	return (if axis.x == true then a.X == b.X else axis.x == nil) and (if axis.y == true then a.Y == b.Y else axis.y == nil) and (if axis.z == true then a.Z == b.Z else axis.z == nil)
end
--[[
	*
	 *
	 
]]
local isPointInView = function(origin, target, direction, distance, fov)
	local _target = target
	local _origin = origin
	local dirToEnemy = _target - _origin
	local angle = math.acos(math.clamp(direction:Dot(dirToEnemy.Unit), -1, 1))
	-- Check if the target is within the field of view and distance
	if dirToEnemy.Magnitude <= distance and math.abs(angle) <= math.rad(fov) / 2 then
		return true
	end
	return false
end
-- AngleUtils.ts
--[[
	*
	 * Returns the angle in degrees (0–180) between two Vector3s.
	 *
	 * @param vectorA - First vector
	 * @param vectorB - Second vector
	 * @returns Angle in degrees
	 
]]
local function vector3AngleBetween(vectorA, vectorB)
	local _exitType, _returns = TS.try(function()
		local magA = vectorA.Magnitude
		local magB = vectorB.Magnitude
		if magA == 0 or magB == 0 then
			warn(`vector3AngleBetween: zero-length vector at line {143}`)
			return TS.TRY_RETURN, { 0 }
		end
		local cosTheta = math.clamp(vectorA:Dot(vectorB) / (magA * magB), -1, 1)
		local angleRad = math.acos(cosTheta)
		return TS.TRY_RETURN, { math.deg(angleRad) }
	end, function(err)
		warn(`Error in vector3AngleBetween at line {155}: {tostring(err)}`)
		return TS.TRY_RETURN, { 0 }
	end)
	if _exitType then
		return unpack(_returns)
	end
end
return {
	vector3GetPointOnSurface = vector3GetPointOnSurface,
	vector3AngleBetween = vector3AngleBetween,
	CreateVisualizer = CreateVisualizer,
	isVectorAxisEqual = isVectorAxisEqual,
	isPointInView = isPointInView,
}
