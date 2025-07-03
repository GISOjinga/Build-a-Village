-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local useEvent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useEvent
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local printJecs = _jecsHelpFunctions.printJecs
local warnJecs = _jecsHelpFunctions.warnJecs
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local ReplicatedComponent = _jecsComponents.ReplicatedComponent
local Villager = _jecsComponents.Villager
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local player = Players.LocalPlayer
local default = function(world)
	local playerEntity = player:GetAttribute("ServerId")
	for _, villagerEntity, villagerComp in world:query(ReplicatedComponent, Villager) do
		TS.Promise.try(function()
			local villagerModel = villagerComp.villagerModel
			local owner = villagerComp.playerEntity == playerEntity
			local required = villagerComp.villagerData.Progress.Required
			local requirementPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
			local totalResources = #villagerComp.villagerData.Progress.Progression.Resources
			requirementPrompt.ActionText = if (owner and required and required.Amount < required.Max) then `Requires {required.Produce}` else ""
			requirementPrompt.Enabled = if owner and required then ((required.Amount + totalResources) < required.Max) else false
			if owner then
				for _binding in useEvent(requirementPrompt.Triggered, debug.traceback() .. tostring(villagerEntity)) do
					routes.supplyVillager:send(villagerEntity)
				end
			end
			local _exp = villagerModel.Station.Parts.Resources:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(model, index)
				local proximityPromptPart = model:FindFirstChild("ProximityPromptPart")
				local prompt = proximityPromptPart and (proximityPromptPart:FindFirstChild("ResourcesPrompt") or paths.Assets.ProximityPrompts.ResourcesPrompt:Clone())
				if not prompt then
					return nil
				end
				if not owner then
					prompt.ActionText = "Steal"
				else
					prompt.ActionText = "Collect"
				end
				-- print(owner)
				prompt.Enabled = model:GetAttribute("Ready") or false
				prompt.Parent = proximityPromptPart
				for _binding in useEvent(prompt.Triggered, debug.traceback() .. tostring(index) .. tostring(villagerEntity)) do
					printJecs(41, `Collecting {model.Name} from villager: `, villagerEntity)
					routes.collectVillagerProduce:send({
						villagerEntity = villagerEntity,
						resourceModelName = model.Name,
					})
				end
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end):catch(function(promiseError)
			return warnJecs(45, "Error in villager prompt handler: ", promiseError, "Villager Entity: ", villagerEntity)
		end)
	end
end
return {
	default = default,
}
