-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local instanceToAttributeTree = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "instanceFunctions").instanceToAttributeTree
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local default = instanceToAttributeTree(paths.GameSettingsConfig).GameSettingsConfig
return {
	default = default,
}
