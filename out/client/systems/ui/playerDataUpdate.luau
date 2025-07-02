-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Changed = _jecsComponents.Changed
local Data = _jecsComponents.Data
local TargetEntity = _jecsComponents.TargetEntity
-- variables
local player = Players.LocalPlayer
local mouse = player:GetMouse()
local default = function(world)
	-- prints all villagers changed
	for _, __, change in world:query(TargetEntity, Changed(Data)) do
		local _result = change.new
		if _result ~= nil then
			_result = _result.Coins
		end
		local _condition = _result
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = 0
		end
		pageStates.coins(_condition)
	end
end
return {
	default = default,
}
