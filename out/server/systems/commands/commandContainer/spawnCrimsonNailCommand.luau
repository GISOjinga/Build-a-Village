-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out")
local Command = _centurion.Command
local Guard = _centurion.Guard
local Register = _centurion.Register
local spawnCrimsonNailSignal = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "commands", "commandBindings", "justusCommandSignals").spawnCrimsonNailSignal
local isAdmin = function(ctx)
	if ctx.executor:GetRankInGroup(36086761) < 254 and ctx.executor.UserId >= 0 then
		ctx:error("Insufficient permission!")
		return false
	end
	return true
end
-- signal to give
local spawnCrimsonNailCommand
do
	spawnCrimsonNailCommand = setmetatable({}, {
		__tostring = function()
			return "spawnCrimsonNailCommand"
		end,
	})
	spawnCrimsonNailCommand.__index = spawnCrimsonNailCommand
	function spawnCrimsonNailCommand.new(...)
		local self = setmetatable({}, spawnCrimsonNailCommand)
		return self:constructor(...) or self
	end
	function spawnCrimsonNailCommand:constructor()
	end
	function spawnCrimsonNailCommand:spawnCrimsonNail(ctx)
		local character = ctx.executor.Character
		local _bodyEntity = character
		if _bodyEntity ~= nil then
			_bodyEntity = _bodyEntity:GetAttribute("ServerId")
		end
		local bodyEntity = _bodyEntity
		-- if the server id exist
		if bodyEntity ~= 0 and bodyEntity == bodyEntity and bodyEntity then
			spawnCrimsonNailSignal:Invoke(bodyEntity)
		end
	end
	local _decorator = Command({
		name = "spawnCrimsonNail",
		description = "Spawn Crimson Nail",
		arguments = {},
	})
	local _descriptor = Guard(isAdmin)(spawnCrimsonNailCommand, "spawnCrimsonNail", {
		value = spawnCrimsonNailCommand.spawnCrimsonNail,
	})
	if _descriptor then
		spawnCrimsonNailCommand.spawnCrimsonNail = _descriptor.value
	end
	local _descriptor_1 = _decorator(spawnCrimsonNailCommand, "spawnCrimsonNail", {
		value = spawnCrimsonNailCommand.spawnCrimsonNail,
	})
	if _descriptor_1 then
		spawnCrimsonNailCommand.spawnCrimsonNail = _descriptor_1.value
	end
	spawnCrimsonNailCommand = Register()(spawnCrimsonNailCommand) or spawnCrimsonNailCommand
end
return {
	spawnCrimsonNailCommand = spawnCrimsonNailCommand,
}
