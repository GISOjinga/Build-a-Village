-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local ConfirmationPrompt = _jecsComponents.ConfirmationPrompt
local Removed = _jecsComponents.Removed
local default = function(world)
	-- when ever confirmation prompt is added
	for _, _binding in world:query(Added(ConfirmationPrompt)) do
		local title = _binding.title
		local message = _binding.message
		pageStates.confirmPrompt({
			message = message,
			title = title,
		})
	end
	-- when removed hides the text
	for _, confirmationPrompt in world:query(Removed(ConfirmationPrompt)) do
		pageStates.confirmPrompt({
			title = "",
			message = "",
		})
	end
end
return {
	default = default,
}
