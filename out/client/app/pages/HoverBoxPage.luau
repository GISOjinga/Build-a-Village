-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(hoverBoxUI)
	local trash = Janitor.new()
	-- loops through all the options and when one is pressed then
	trash:Add(useEffect(function()
		hoverBoxUI.Enabled = pageStates.hoverInfo().visible
		hoverBoxUI.Frame.TextLabel.Text = pageStates.hoverInfo().info
	end))
	return trash
end
return {
	default = default,
}
