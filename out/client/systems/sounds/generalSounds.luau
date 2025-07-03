-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local SoundService = _services.SoundService
local Workspace = _services.Workspace
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local default = function(world)
	-- when ever sounds is called to play
	useRoute(routes.playSound, function(data)
		local soundPosition = data.position
		local sound = data.sound:Clone()
		local goalParent = if soundPosition then Instance.new("Attachment", Workspace.Terrain) else SoundService
		-- if the sound has a position, it will create an attachment in the terrain
		if soundPosition and goalParent:IsA("Attachment") then
			goalParent.Position = soundPosition
			goalParent.Name = "SoundAttachment"
			sound.Destroying:Connect(function()
				return goalParent:Destroy()
			end)
		end
		-- parents and plays it
		sound.Parent = goalParent
		sound:Play()
		sound.Stopped:Connect(function()
			return sound:Destroy()
		end)
	end)
end
return {
	default = default,
}
