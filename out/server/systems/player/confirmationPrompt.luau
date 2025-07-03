-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local routes = TS.import(script, game:GetService("ServerScriptService"), "TS", "routes").default
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local removeComponent = _jecsHelpFunctions.removeComponent
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local ConfirmationPrompt = _jecsComponents.ConfirmationPrompt
local Removed = _jecsComponents.Removed
local TargetEntity = _jecsComponents.TargetEntity
local default = function(world)
	-- use route on confirmPrompt when the bool is true then it confirms the prompt and removes it
	useRoute(routes.confirmPrompt, function(yes, player)
		local playerEntity = getEntity.fromInstance(player)
		local _condition = playerEntity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(playerEntity, ConfirmationPrompt)
		end
		local confirmationPrompt = _condition
		-- if data then
		if confirmationPrompt then
			printJecs(23, "Confirmation Prompt: ", confirmationPrompt, " for player: ", player.Name)
			-- if yes then removes the prompt
			local _object = table.clone(confirmationPrompt)
			setmetatable(_object, nil)
			_object.confirmation = yes
			addComponent(playerEntity, ConfirmationPrompt, _object)
			removeComponent(playerEntity, ConfirmationPrompt)
		end
	end)
	-- when the confirmation prompt is removed then does the calls
	for _, playerEntity, confirmationPrompt in world:query(TargetEntity, Removed(ConfirmationPrompt)) do
		printJecs(32, "Confirmation Prompt removed for player: ", playerEntity, " with confirmation: ", confirmationPrompt.confirmation)
		if confirmationPrompt.confirmation then
			-- if the confirmation is true then calls the callback
			local _result = confirmationPrompt.onConfirm
			if _result ~= nil then
				_result()
			end
		else
			-- if the confirmation is false then calls the cancel callback
			local _result = confirmationPrompt.onDecline
			if _result ~= nil then
				_result()
			end
		end
	end
end
return {
	default = default,
}
