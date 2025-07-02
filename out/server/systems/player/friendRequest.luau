-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local GiftTo = _jecsComponents.GiftTo
local Player = _jecsComponents.Player
local Removed = _jecsComponents.Removed
local TargetEntity = _jecsComponents.TargetEntity
local default = function(world)
	-- when gift to gets removed
	-- printTS($line, "Watching for removed GiftTo components");
	for _, playerEntity, giftTo in world:query(TargetEntity, Removed(GiftTo)) do
		local player = world:get(playerEntity, Player)
		local playerToFriend = giftTo.target
		local playerToFriendEntity = getEntity.fromInstance(playerToFriend)
		-- sends out a friend request to both players
		local _value = player and playerToFriendEntity
		if _value ~= 0 and _value == _value and _value then
			printJecs(18, `Removing gift to: {playerToFriend.Name} from player: {player.Name}`)
			createEntity.confirmationPrompt(playerToFriendEntity, `Accept Friend Request?`, `Friend Request From @{player.Name}`, function()
				printJecs(20, `Adding friend: {playerToFriend.Name}`)
				routes.sendFriendRequest.sendTo(playerToFriend, player)
				routes.sendFriendRequest.sendTo(player, playerToFriend)
			end)
		end
	end
end
return {
	default = default,
}
