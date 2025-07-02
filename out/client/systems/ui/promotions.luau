-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local StarterGui = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").StarterGui
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local default = function(world)
	useRoute(routes.updateFriendsBonus, pageStates.friendsBonus)
	useRoute(routes.sendFriendRequest, function(otherPlayer)
		StarterGui:SetCore("PromptSendFriendRequest", otherPlayer)
	end)
end
return {
	default = default,
}
