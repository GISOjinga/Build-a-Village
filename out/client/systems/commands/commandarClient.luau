-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useMemo = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useMemo
local Centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out").Centurion
local CenturionUI = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion-ui", "out").CenturionUI
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local default = function()
	useMemo(function()
		return task.spawn(function()
			if Players.LocalPlayer:GetRankInGroup(36086761) >= 254 or Players.LocalPlayer.UserId < 0 then
				local client = Centurion.client()
				client.registry:load(ReplicatedStorage:WaitForChild("TS"):WaitForChild("utils"):WaitForChild("typeContainer"))
				client:start():andThen(function()
					return CenturionUI.start(Centurion.client(), {})
				end):catch(function(err)
					return warn("Failed to start Centurion:", err)
				end)
			end
		end)
	end, {})
end
return {
	default = default,
}
