-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local useChange = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-change").useChange
local function useEffect(effect, dependencies, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator, function(state)
		local _value = state.cleanup
		if _value ~= nil then
			_value = _value()
		end
		local value = _value
		return if value == nil then false else value
	end)
	if not dependencies or useChange(dependencies, storage) then
		storage.dependencies = dependencies
		local cleanup = effect()
		if cleanup then
			storage.cleanup = cleanup
		end
	end
end
return {
	useEffect = useEffect,
}
