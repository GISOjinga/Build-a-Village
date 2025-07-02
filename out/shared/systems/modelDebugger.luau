-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").RunService
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local ModelDebugger = _jecsComponents.ModelDebugger
local Changed = _jecsComponents.Changed
local TargetEntity = _jecsComponents.TargetEntity
-- import
local name = RunService:IsServer() and "ServerId" or "ClientId"
local default = function(world)
	for _, entity, record in world:query(TargetEntity, Changed(ModelDebugger)) do
		local model = record.new or record.old
		if model then
			model:SetAttribute(name, if record.new then entity else nil)
		end
	end
end
return {
	default = default,
}
