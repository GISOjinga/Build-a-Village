-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local function cleanup(storage)
	return os.clock() >= storage.expiry
end
--[[
	*
	 * Utility for easy time based intervalues.
	 *
	 * Accepts a duration and returns `true` if it has been that long since the last
	 * time this function returned `true`. Returns `false` the first time it is called.
	 *
	 * @param seconds - The number of seconds to throttle for.
	 * @param discriminator - An optional value to additionally key by.
	 * @param key - An automatically generated key to store the throttle state.
	 * @returns - Returns true every x seconds, otherwise false.
	 * @metadata macro
	 
]]
local function useInterval(seconds, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator, cleanup)
	local currentTime = os.clock()
	if storage.time == nil then
		storage.time = currentTime
		storage.expiry = currentTime + seconds
		return false
	end
	if currentTime - storage.time >= seconds then
		storage.time = currentTime
		storage.expiry = currentTime + seconds
		return true
	end
	return false
end
return {
	useInterval = useInterval,
}
