-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useCurrentFrame = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useCurrentFrame
local function useDeltaTime()
	local frameState = useCurrentFrame()
	return frameState.deltaTime
end
return {
	useDeltaTime = useDeltaTime,
}
