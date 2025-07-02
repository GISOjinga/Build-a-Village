-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RotatedRegion3 = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "fast-rotated-region3", "out")
-- checks if model is overlapping other models
local isVillagersOverlapping = function(models, villager, villagerPivot)
	if villagerPivot == nil then
		villagerPivot = villager:GetPivot()
	end
	-- const villagerCenter = villagerPivot.Position;
	local villagerSize = villager:GetExtentsSize()
	local region = RotatedRegion3.new(villagerPivot, villagerSize)
	for _, model in models do
		local hitBox = model:FindFirstChild("HitBox")
		local position = model:GetPivot().Position
		-- Skip comparing the villager to itself
		if model == villager then
			continue
		end
		-- Get other model's pivot and center
		if hitBox and (position == villagerPivot.Position or region:CastPart(hitBox)) then
			return true
		end
	end
	-- No overlaps
	return false
end
return {
	isVillagersOverlapping = isVillagersOverlapping,
}
