-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local effect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "charm", "src").effect
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local default = function(callback)
	return effect(function()
		local newTrash = Janitor.new()
		callback(newTrash)
		return function()
			local _self = newTrash
			local _result = _self.Destroy
			if _result ~= nil then
				_result = _result(_self)
			end
			return _result
		end
	end)
end
return {
	default = default,
}
