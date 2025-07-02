-- Compiled with roblox-ts v3.0.0
local basePart = {
	createBall = function(data)
		local part = Instance.new("Part")
		local _result = data
		if _result ~= nil then
			_result = _result.Size
		end
		local _condition = _result
		if not _condition then
			_condition = Vector3.one
		end
		part.Size = _condition
		local _result_1 = data
		if _result_1 ~= nil then
			_result_1 = _result_1.Color
		end
		local _condition_1 = _result_1
		if not _condition_1 then
			_condition_1 = Color3.fromRGB()
		end
		part.Color = _condition_1
		local _result_2 = data
		if _result_2 ~= nil then
			_result_2 = _result_2.Position
		end
		local _condition_2 = _result_2
		if not _condition_2 then
			_condition_2 = Vector3.one
		end
		part.Position = _condition_2
		part.Material = Enum.Material.Neon
		part.Anchored = true
		part.CanTouch = false
		part.CanCollide = false
		part.CanQuery = false
		part.Shape = Enum.PartType.Ball
		part.Name = "Ball"
		return part
	end,
}
-- This will get you a random point in a part
local randomPointOnPart = function(part)
	local size = part.Size
	local position = part.Position
	local x = math.random(-size.X / 2, size.X / 2)
	local y = math.random(-size.Y / 2, size.Y / 2)
	local z = math.random(-size.Z / 2, size.Z / 2)
	local point = Vector3.new(x, y, z) + position
	return point
end
return {
	basePart = basePart,
	randomPointOnPart = randomPointOnPart,
}
