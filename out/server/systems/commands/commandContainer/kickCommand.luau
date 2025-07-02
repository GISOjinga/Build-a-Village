-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out")
local CenturionType = _centurion.CenturionType
local Command = _centurion.Command
local Guard = _centurion.Guard
local Register = _centurion.Register
local isAdmin = function(ctx)
	if ctx.executor:GetRankInGroup(36086761) < 254 and ctx.executor.UserId >= 0 then
		ctx:error("Insufficient permission!")
		return false
	end
	return true
end
local KickCommand
do
	KickCommand = setmetatable({}, {
		__tostring = function()
			return "KickCommand"
		end,
	})
	KickCommand.__index = KickCommand
	function KickCommand.new(...)
		local self = setmetatable({}, KickCommand)
		return self:constructor(...) or self
	end
	function KickCommand:constructor()
	end
	function KickCommand:kick(ctx, player)
		player:Kick("You have been kicked from the server.")
		ctx:Reply(`Successfully kicked {player.Name}`)
	end
	local _decorator = Command({
		name = "kick",
		description = "Kick a player",
		arguments = { {
			name = "player",
			description = "Player to kick",
			type = CenturionType.Player,
		} },
	})
	local _descriptor = Guard(isAdmin)(KickCommand, "kick", {
		value = KickCommand.kick,
	})
	if _descriptor then
		KickCommand.kick = _descriptor.value
	end
	local _descriptor_1 = _decorator(KickCommand, "kick", {
		value = KickCommand.kick,
	})
	if _descriptor_1 then
		KickCommand.kick = _descriptor_1.value
	end
	KickCommand = Register()(KickCommand) or KickCommand
end
return {
	KickCommand = KickCommand,
}
