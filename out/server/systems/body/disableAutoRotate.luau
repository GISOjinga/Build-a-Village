-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local DisableAutoRotate = _jecsComponents.DisableAutoRotate
local systemQueue = _jecsComponents.systemQueue
-- for all the ones with disable auto rotate, disable it
local default = function(world)
	local delta = systemQueue:getDeltaTime()
	-- when auto rotate is disabled
	for entity, _binding in world:query(DisableAutoRotate) do
		local humanoid = _binding.humanoid
		local duration = _binding.duration
		local destroyEntityOnComplete = _binding.destroyEntityOnComplete
		humanoid.AutoRotate = false
		-- handles the count down
		if duration ~= 0 and duration == duration and duration then
			if duration > 0 then
				world:set(entity, DisableAutoRotate, ({
					duration = duration - delta,
					humanoid = humanoid,
				}))
			elseif destroyEntityOnComplete then
				humanoid.AutoRotate = true
				world:delete(entity)
			else
				humanoid.AutoRotate = true
				world:remove(entity, DisableAutoRotate)
			end
		end
	end
end
return {
	default = default,
}
