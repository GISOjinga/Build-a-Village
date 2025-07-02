-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out")
local Command = _centurion.Command
local Guard = _centurion.Guard
local Register = _centurion.Register
local spawnFlameTornadoSignal = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "commands", "commandBindings", "justusCommandSignals").spawnFlameTornadoSignal
local isAdmin = function(ctx)
	if ctx.executor:GetRankInGroup(36086761) < 254 and ctx.executor.UserId >= 0 then
		ctx:error("Insufficient permission!")
		return false
	end
	return true
end
-- signal to give
local spawnFlameTornadoCommand
do
	spawnFlameTornadoCommand = setmetatable({}, {
		__tostring = function()
			return "spawnFlameTornadoCommand"
		end,
	})
	spawnFlameTornadoCommand.__index = spawnFlameTornadoCommand
	function spawnFlameTornadoCommand.new(...)
		local self = setmetatable({}, spawnFlameTornadoCommand)
		return self:constructor(...) or self
	end
	function spawnFlameTornadoCommand:constructor()
	end
	function spawnFlameTornadoCommand:spawnFlameTornado(ctx)
		local character = ctx.executor.Character
		local _bodyEntity = character
		if _bodyEntity ~= nil then
			_bodyEntity = _bodyEntity:GetAttribute("ServerId")
		end
		local bodyEntity = _bodyEntity
		-- if the server id exist
		if bodyEntity ~= 0 and bodyEntity == bodyEntity and bodyEntity then
			spawnFlameTornadoSignal:Invoke(bodyEntity)
		end
	end
	local _decorator = Command({
		name = "spawnFlameTornado",
		description = "Spawn Flame Tornado",
		arguments = {},
	})
	local _descriptor = Guard(isAdmin)(spawnFlameTornadoCommand, "spawnFlameTornado", {
		value = spawnFlameTornadoCommand.spawnFlameTornado,
	})
	if _descriptor then
		spawnFlameTornadoCommand.spawnFlameTornado = _descriptor.value
	end
	local _descriptor_1 = _decorator(spawnFlameTornadoCommand, "spawnFlameTornado", {
		value = spawnFlameTornadoCommand.spawnFlameTornado,
	})
	if _descriptor_1 then
		spawnFlameTornadoCommand.spawnFlameTornado = _descriptor_1.value
	end
	spawnFlameTornadoCommand = Register()(spawnFlameTornadoCommand) or spawnFlameTornadoCommand
end
return {
	spawnFlameTornadoCommand = spawnFlameTornadoCommand,
}
