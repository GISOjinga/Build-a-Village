-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local TweenService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").TweenService
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(sellPage)
	local trash = Janitor.new()
	-- loops through all the options and when one is pressed then
	local _exp = sellPage.Frame:GetChildren()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(child)
		local option = child.Name
		if child:IsA("Frame") then
			local hoverButton = child:FindFirstChild("HoverDetect")
			--if hover button exists then bind the action
			if hoverButton then
				trash:Add(UIUtilities.ButtonAction({
					Button = hoverButton,
				}, function()
					routes.confirmSellOptions:send(option)
				end))
			end
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
	-- when the route to toggle sell menu is called then
	trash:Add(routes.toggleSellMenuOpen:listen(function(open)
		pageStates.openPage(if open then "Sell" else "None")
	end))
	-- listens to changes to sell menu open
	trash:Add(useEffect(function(newTrash)
		local sellMenuOpen = pageStates.openPage()
		newTrash:Add(TweenService:Create(sellPage.Frame, TweenInfo.new(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), {
			Size = if sellMenuOpen == "Sell" then UDim2.fromScale(1, 1) else UDim2.fromScale(0, 0),
		})):Play()
	end))
	return trash
end
return {
	default = default,
}
