-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out")
local Command = _centurion.Command
local Guard = _centurion.Guard
local Register = _centurion.Register
local spawnLightningWebSignal = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "commands", "commandBindings", "justusCommandSignals").spawnLightningWebSignal
local isAdmin = function(ctx)
	if ctx.executor:GetRankInGroup(36086761) < 254 and ctx.executor.UserId >= 0 then
		ctx:error("Insufficient permission!")
		return false
	end
	return true
end
-- signal to give
local spawnLightningWebCommand
do
	spawnLightningWebCommand = setmetatable({}, {
		__tostring = function()
			return "spawnLightningWebCommand"
		end,
	})
	spawnLightningWebCommand.__index = spawnLightningWebCommand
	function spawnLightningWebCommand.new(...)
		local self = setmetatable({}, spawnLightningWebCommand)
		return self:constructor(...) or self
	end
	function spawnLightningWebCommand:constructor()
	end
	function spawnLightningWebCommand:spawnLightningWeb(ctx)
		local character = ctx.executor.Character
		local _bodyEntity = character
		if _bodyEntity ~= nil then
			_bodyEntity = _bodyEntity:GetAttribute("ServerId")
		end
		local bodyEntity = _bodyEntity
		-- if the server id exist
		if bodyEntity ~= 0 and bodyEntity == bodyEntity and bodyEntity then
			spawnLightningWebSignal:Invoke(bodyEntity)
		end
	end
	local _decorator = Command({
		name = "spawnLightningWeb",
		description = "Spawn Lightning Web",
		arguments = {},
	})
	local _descriptor = Guard(isAdmin)(spawnLightningWebCommand, "spawnLightningWeb", {
		value = spawnLightningWebCommand.spawnLightningWeb,
	})
	if _descriptor then
		spawnLightningWebCommand.spawnLightningWeb = _descriptor.value
	end
	local _descriptor_1 = _decorator(spawnLightningWebCommand, "spawnLightningWeb", {
		value = spawnLightningWebCommand.spawnLightningWeb,
	})
	if _descriptor_1 then
		spawnLightningWebCommand.spawnLightningWeb = _descriptor_1.value
	end
	spawnLightningWebCommand = Register()(spawnLightningWebCommand) or spawnLightningWebCommand
end
return {
	spawnLightningWebCommand = spawnLightningWebCommand,
}
