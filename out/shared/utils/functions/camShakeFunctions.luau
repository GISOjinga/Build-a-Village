-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local CameraShaker = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "camera-shaker", "CameraShaker")
local Workspace = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Workspace
local camera = Workspace.Camera
local cameraShaker = CameraShaker.new(Enum.RenderPriority.Camera.Value, function(shakeCFrame)
	local _cFrame = camera.CFrame
	local _shakeCFrame = shakeCFrame
	camera.CFrame = _cFrame * _shakeCFrame
end)
cameraShaker:Start()
local camshake = {
	HeavyImpact = function(percentage)
		if percentage == nil then
			percentage = 1
		end
		cameraShaker:ShakeOnce(5 * percentage, 30 * percentage, 0, 1 * percentage)
	end,
	Impact = function(percentage)
		if percentage == nil then
			percentage = 1
		end
		cameraShaker:ShakeOnce(3 * percentage, 20 * percentage, 0, 0.25 * percentage)
	end,
}
return {
	camshake = camshake,
}
