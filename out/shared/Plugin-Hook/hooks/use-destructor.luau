-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local useChange = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-change").useChange
local function useDestructor(destructor, dependencies, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator, function(state)
		local _result = state.destructor
		if _result ~= nil then
			_result()
		end
		return false
	end)
	if not dependencies or useChange(dependencies, storage) then
		local _result = storage.destructor
		if _result ~= nil then
			_result()
		end
		storage.destructor = destructor
	end
end
return {
	useDestructor = useDestructor,
}
