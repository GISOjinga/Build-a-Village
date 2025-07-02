-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local useChange = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-change").useChange
local function useMemo(callback, dependencies, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator)
	if useChange(dependencies, storage) then
		local newValues = callback()
		storage.oldValues = newValues
		return newValues
	end
	return storage.oldValues
end
return {
	useMemo = useMemo,
}
