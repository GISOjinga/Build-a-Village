-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local function cleanup(storage)
	return os.clock() >= storage.expiry
end
--[[
	*
	 * Utility for easy time-based throttling.
	 *
	 * Accepts a duration and returns `true` if it has been that long since the last
	 * time this function returned `true`. Always returns `true` the first time.
	 *
	 * @param seconds - The number of seconds to throttle for.
	 * @param discriminator - An optional value to additionally key by.
	 * @param key - An automatically generated key to store the throttle state.
	 * @returns - Returns true every x seconds, otherwise false.
	 * @metadata macro
	 
]]
local function useThrottle(seconds, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator, cleanup)
	local currentTime = os.clock()
	if storage.time == nil or currentTime - storage.time >= seconds then
		storage.time = currentTime
		storage.expiry = currentTime + seconds
		return true
	end
	return false
end
return {
	useThrottle = useThrottle,
}
