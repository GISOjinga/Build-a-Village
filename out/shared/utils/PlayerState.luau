-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local PlayerState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents").PlayerState
local Object = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils")
local PlayerStateSchema = {
	movement = { "isGliding", "isDoubleJumping", "isDecidingAirDash", "isAirDashing", "isChargingLeap", "isChargeleaping" },
}
-- Various statuses (add as needed)
local function getHardPriorityState(world, entity)
	local state = world:get(entity, PlayerState)
	if not state then
		return nil
	end
	-- Define your hard-priority keys here
	local hardPriorityKeys = {}
	for _, _binding in hardPriorityKeys do
		local category = _binding.category
		local key = _binding.key
		local _arg0 = state[category]
		local _condition = type(_arg0) == "table"
		if _condition then
			local _result = (state[category])[key]
			if _result ~= nil then
				_result = _result.active
			end
			_condition = _result
		end
		if _condition then
			return key
		end
	end
	return nil
end
local function createInitialPlayerState()
	local initial = {}
	for _, _binding in Object.entries(PlayerStateSchema) do
		local categoryName = _binding[1]
		local keys = _binding[2]
		-- print(categoryName);
		local categoryObj = {}
		for _1, key in keys do
			categoryObj[key] = {
				active = false,
				lastUpdated = 0,
			}
			-- print(key);
		end
		initial[categoryName] = categoryObj
	end
	return initial
end
return {
	getHardPriorityState = getHardPriorityState,
	createInitialPlayerState = createInitialPlayerState,
	PlayerStateSchema = PlayerStateSchema,
}
