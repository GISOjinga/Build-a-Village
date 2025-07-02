-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out").Centurion
local useMemo = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useMemo
local ReplicatedStorage = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").ReplicatedStorage
local default = function()
	useMemo(function()
		return task.spawn(function()
			local server = Centurion.server()
			-- Load all child ModuleScripts under each container
			server.registry:load(ReplicatedStorage:WaitForChild("TS"):WaitForChild("utils"):WaitForChild("typeContainer"))
			server.registry:load(script.Parent:WaitForChild("commandContainer"))
			-- starts commander
			server:start()
		end)
	end, {})
end
return {
	default = default,
}
