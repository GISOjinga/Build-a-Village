-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local useChange = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-change").useChange
local function useInstance(creator, dependencies, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator, function(state)
		if state.instance then
			state.instance:Destroy()
		end
		return false
	end)
	if storage.instance == nil or useChange(dependencies, discriminator) then
		storage.instance = creator()
	end
	return storage.instance
end
return {
	useInstance = useInstance,
}
