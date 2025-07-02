-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out")
local Command = _centurion.Command
local Guard = _centurion.Guard
local Register = _centurion.Register
local spawnWaterBreathSignal = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "commands", "commandBindings", "justusCommandSignals").spawnWaterBreathSignal
local isAdmin = function(ctx)
	if ctx.executor:GetRankInGroup(36086761) < 254 and ctx.executor.UserId >= 0 then
		ctx:error("Insufficient permission!")
		return false
	end
	return true
end
-- signal to give
local spawnWaterBreathCommand
do
	spawnWaterBreathCommand = setmetatable({}, {
		__tostring = function()
			return "spawnWaterBreathCommand"
		end,
	})
	spawnWaterBreathCommand.__index = spawnWaterBreathCommand
	function spawnWaterBreathCommand.new(...)
		local self = setmetatable({}, spawnWaterBreathCommand)
		return self:constructor(...) or self
	end
	function spawnWaterBreathCommand:constructor()
	end
	function spawnWaterBreathCommand:spawnWaterBreath(ctx)
		local character = ctx.executor.Character
		local _bodyEntity = character
		if _bodyEntity ~= nil then
			_bodyEntity = _bodyEntity:GetAttribute("ServerId")
		end
		local bodyEntity = _bodyEntity
		-- if the server id exist
		if bodyEntity ~= 0 and bodyEntity == bodyEntity and bodyEntity then
			spawnWaterBreathSignal:Invoke(bodyEntity)
		end
	end
	local _decorator = Command({
		name = "spawnWaterBreath",
		description = "Spawn Water Breath",
		arguments = {},
	})
	local _descriptor = Guard(isAdmin)(spawnWaterBreathCommand, "spawnWaterBreath", {
		value = spawnWaterBreathCommand.spawnWaterBreath,
	})
	if _descriptor then
		spawnWaterBreathCommand.spawnWaterBreath = _descriptor.value
	end
	local _descriptor_1 = _decorator(spawnWaterBreathCommand, "spawnWaterBreath", {
		value = spawnWaterBreathCommand.spawnWaterBreath,
	})
	if _descriptor_1 then
		spawnWaterBreathCommand.spawnWaterBreath = _descriptor_1.value
	end
	spawnWaterBreathCommand = Register()(spawnWaterBreathCommand) or spawnWaterBreathCommand
end
return {
	spawnWaterBreathCommand = spawnWaterBreathCommand,
}
