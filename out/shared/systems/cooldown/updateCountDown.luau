-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local CountDown = _jecsComponents.CountDown
local systemQueue = _jecsComponents.systemQueue
local DestroyAfterCounting = _jecsComponents.DestroyAfterCounting
-- takes down cooldown
local default = function(world)
	local delta = systemQueue:getDeltaTime()
	-- loops through all cooldowns
	for entity, duration in world:query(CountDown) do
		-- if the duration is less than 0
		if duration < 0 then
			local destroyAfterCounting = world:get(entity, DestroyAfterCounting)
			if destroyAfterCounting then
				world:delete(entity)
				if type(destroyAfterCounting) == "function" then
					destroyAfterCounting()
				end
			else
				world:remove(entity, CountDown)
			end
		else
			world:set(entity, CountDown, (duration - delta))
		end
	end
end
return {
	default = default,
}
