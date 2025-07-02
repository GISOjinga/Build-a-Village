-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out")
local Command = _centurion.Command
local Guard = _centurion.Guard
local Register = _centurion.Register
local spawnFireBreathSignal = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "commands", "commandBindings", "justusCommandSignals").spawnFireBreathSignal
local isAdmin = function(ctx)
	if ctx.executor:GetRankInGroup(36086761) < 254 and ctx.executor.UserId >= 0 then
		ctx:error("Insufficient permission!")
		return false
	end
	return true
end
-- signal to give
local spawnFireBreathCommand
do
	spawnFireBreathCommand = setmetatable({}, {
		__tostring = function()
			return "spawnFireBreathCommand"
		end,
	})
	spawnFireBreathCommand.__index = spawnFireBreathCommand
	function spawnFireBreathCommand.new(...)
		local self = setmetatable({}, spawnFireBreathCommand)
		return self:constructor(...) or self
	end
	function spawnFireBreathCommand:constructor()
	end
	function spawnFireBreathCommand:spawnFireBreath(ctx)
		local character = ctx.executor.Character
		local _bodyEntity = character
		if _bodyEntity ~= nil then
			_bodyEntity = _bodyEntity:GetAttribute("ServerId")
		end
		local bodyEntity = _bodyEntity
		-- if the server id exist
		if bodyEntity ~= 0 and bodyEntity == bodyEntity and bodyEntity then
			spawnFireBreathSignal:Invoke(bodyEntity)
		end
	end
	local _decorator = Command({
		name = "spawnFireBreath",
		description = "Spawn Fire Breath",
		arguments = {},
	})
	local _descriptor = Guard(isAdmin)(spawnFireBreathCommand, "spawnFireBreath", {
		value = spawnFireBreathCommand.spawnFireBreath,
	})
	if _descriptor then
		spawnFireBreathCommand.spawnFireBreath = _descriptor.value
	end
	local _descriptor_1 = _decorator(spawnFireBreathCommand, "spawnFireBreath", {
		value = spawnFireBreathCommand.spawnFireBreath,
	})
	if _descriptor_1 then
		spawnFireBreathCommand.spawnFireBreath = _descriptor_1.value
	end
	spawnFireBreathCommand = Register()(spawnFireBreathCommand) or spawnFireBreathCommand
end
return {
	spawnFireBreathCommand = spawnFireBreathCommand,
}
