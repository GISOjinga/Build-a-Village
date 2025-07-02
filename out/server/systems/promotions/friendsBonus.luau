-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local FriendsBonus = _jecsComponents.FriendsBonus
local Player = _jecsComponents.Player
local Removed = _jecsComponents.Removed
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local getEntity = _jecsHelpFunctions.getEntity
local removeComponent = _jecsHelpFunctions.removeComponent
local default = function(world)
	local updateFriendBonus = function()
		local multiplier = 1.1
		-- checks through all players to see if you have a friend
		for _, player in pairs(Players:GetPlayers()) do
			local playerEntity = getEntity.fromInstance(player)
			if playerEntity ~= 0 and playerEntity == playerEntity and playerEntity then
				removeComponent(playerEntity, FriendsBonus)
				for _, otherPlayer in pairs(Players:GetPlayers()) do
					local otherPlayerEntity = getEntity.fromInstance(otherPlayer)
					local _value = otherPlayer ~= player and player:IsFriendsWith(otherPlayer.UserId) and otherPlayerEntity
					if _value ~= 0 and _value == _value and _value then
						addComponent(playerEntity, FriendsBonus, {
							multiplier = multiplier,
						})
						routes.updateFriendsBonus:sendTo(true, player)
						return nil
					end
				end
			end
		end
	end
	-- when players get added/removed checks all players if they are friends if so give them both friend bounus only 
	for playerEntity, player in world:query(Added(Player)) do
		updateFriendBonus()
	end
	for playerEntity, player in world:query(Removed(Player)) do
		updateFriendBonus()
	end
end
return {
	default = default,
}
