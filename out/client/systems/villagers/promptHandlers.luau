-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local printJecs = _jecsHelpFunctions.printJecs
local warnJecs = _jecsHelpFunctions.warnJecs
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local Changed = _jecsComponents.Changed
local ReplicatedComponent = _jecsComponents.ReplicatedComponent
local TargetEntity = _jecsComponents.TargetEntity
local Villager = _jecsComponents.Villager
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local player = Players.LocalPlayer
local default = function(world)
	local playerEntity = player:GetAttribute("ServerId")
	-- when villager gets added into the game conencts the triggered event regurally
	for _, clientVillagerEntity, villagerComp in world:query(TargetEntity, Added(Villager)) do
		local villagerEntity = world:get(clientVillagerEntity, ReplicatedComponent)
		TS.Promise.try(function()
			if villagerEntity ~= 0 and villagerEntity == villagerEntity and villagerEntity then
				local villagerModel = villagerComp.villagerModel
				local owner = villagerComp.playerEntity == playerEntity
				local requirementPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
				-- for collecting
				local _exp = villagerModel.Station.Parts.Resources:GetChildren()
				-- ▼ ReadonlyArray.forEach ▼
				local _callback = function(model, index)
					local proximityPromptPart = model:WaitForChild("ProximityPromptPart")
					local prompt = proximityPromptPart and (proximityPromptPart:FindFirstChild("ResourcesPrompt") or paths.Assets.ProximityPrompts.ResourcesPrompt:Clone())
					-- set up
					prompt.ActionText = if owner then "Collect" else "Steal"
					prompt.Parent = proximityPromptPart
					prompt.Enabled = model:GetAttribute("Ready") or false
					-- when triggered
					prompt.Triggered:Connect(function()
						printJecs(36, `Collecting {model.Name} from villager: `, villagerEntity)
						routes.collectVillagerProduce:send({
							villagerEntity = villagerEntity,
							resourceModelName = model.Name,
						})
					end)
					-- when attribute ready changes
					model:GetAttributeChangedSignal("Ready"):Connect(function()
						prompt.Enabled = model:GetAttribute("Ready") or false
					end)
				end
				for _k, _v in _exp do
					_callback(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
				-- for supplying
				if owner then
					requirementPrompt.Triggered:Connect(function()
						printJecs(48, "Supplying villager produce for: ", villagerEntity)
						routes.supplyVillager:send(villagerEntity)
					end)
				end
			end
		end):catch(function(promiseError)
			return warnJecs(52, "Error in villager prompt handler: ", promiseError, "Villager Entity: ", villagerEntity)
		end)
	end
	for _, clientVillagerEntity, changedVillager in world:query(TargetEntity, Changed(Villager)) do
		local villagerEntity = world:get(clientVillagerEntity, ReplicatedComponent)
		local villagerComp = changedVillager.new
		local _condition = villagerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = villagerComp
		end
		if _condition then
			TS.Promise.try(function()
				local villagerModel = villagerComp.villagerModel
				local owner = villagerComp.playerEntity == playerEntity
				local required = villagerComp.villagerData.Progress.Required
				local requirementPrompt = villagerModel.Station.Interaction.Collect.ProximityPrompt
				local totalResources = #villagerComp.villagerData.Progress.Progression.Resources
				requirementPrompt.ActionText = if (owner and required and required.Amount < required.Max) then `Requires {required.Produce}` else ""
				requirementPrompt.Enabled = if owner and required then ((required.Amount + totalResources) < required.Max) else false
			end):catch(function(promiseError)
				return warnJecs(71, "Error in villager prompt handler: ", promiseError, "Villager Entity: ", villagerEntity)
			end)
		end
	end
end
return {
	default = default,
}
