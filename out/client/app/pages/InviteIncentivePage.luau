-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local label = pagePaths.Page.InviteIncentive.InviteIncentive
	trash:Add(useEffect(function()
		label.Text = if pageStates.friendsBonus() then "10% bonus active" else "Play with a friend for 10% bonus"
	end))
	return trash
end
return {
	default = default,
}
