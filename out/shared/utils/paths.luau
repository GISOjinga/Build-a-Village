-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local ReplicatedStorage = _services.ReplicatedStorage
local SoundService = _services.SoundService
local Workspace = _services.Workspace
local default = {
	Characters = Workspace:WaitForChild("Characters"),
	Assets = ReplicatedStorage:WaitForChild("Assets"),
	Map = Workspace:WaitForChild("GameMap"),
	TestPlacementFolder = Workspace:WaitForChild("TestPlacementFolder"),
	SFX = SoundService:WaitForChild("SFXFolder"),
	GameSettingsConfig = ReplicatedStorage:WaitForChild("GameSettingsConfig"),
}
return {
	default = default,
}
