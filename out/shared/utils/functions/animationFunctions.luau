-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local Signal = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "signal")
-- this function will create a fake remote event that fires based on if a marker is reached or animation end
local function animationMarkerForced(animationTrack, markerName)
	local trash = Janitor.new()
	local signal = Signal.new()
	-- adds animation track marker to trash
	signal:Connect(function()
		print("Cleaning up animationMarkerForced")
		trash:Destroy()
	end)
	trash:Add(animationTrack:GetMarkerReachedSignal(markerName):Connect(function()
		return signal:Fire()
	end))
	trash:Add(animationTrack.Stopped:Connect(function()
		return signal:Fire()
	end))
	trash:Add(animationTrack.Ended:Connect(function()
		return signal:Fire()
	end))
	trash:Add(animationTrack.Destroying:Connect(function()
		return signal:Fire()
	end))
	-- trash.Add(createInterval(() => {
	--     if (!animationTrack.IsPlaying) signal.Fire();;
	-- }, .1))
	return signal
end
return {
	animationMarkerForced = animationMarkerForced,
}
