-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local placementPage = pagePaths.PlacementPage
	local sizeOffset = UDim2.fromScale(1.1, 1.1)
	trash:Add(useEffect(function()
		local openPage = pageStates.openPage()
		-- if open page is not Placement then show the page
		placementPage.Visible = openPage == "Placement" or openPage == "Dig"
		placementPage.Placetext.Text = if openPage == "Placement" then "Place" else "Dig"
		placementPage.Placetext.BackgroundColor3 = if openPage == "Placement" then Color3.fromRGB(112, 227, 25) else Color3.fromRGB(227, 26, 26)
		placementPage.Placetext.BorderColor3 = if openPage == "Placement" then Color3.fromRGB(10, 99, 0) else Color3.fromRGB(99, 0, 0)
		placementPage.Placetext.UIStrokeBG.Color = if openPage == "Placement" then Color3.fromRGB(10, 99, 0) else Color3.fromRGB(99, 0, 0)
		placementPage.Placetext.UIStrokeText.Color = if openPage == "Placement" then Color3.fromRGB(10, 99, 0) else Color3.fromRGB(99, 0, 0)
		placementPage.RightPress.Visible = openPage == "Placement"
		placementPage.LeftPress.Visible = openPage == "Placement"
	end))
	-- when ever the right press is pressed
	trash:Add(UIUtilities.ButtonAction({
		Button = placementPage.RightPress,
		ExpandedSize = UIUtilities.MultiplyUdim2(placementPage.RightPress.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(placementPage.RightPress.Size, sizeOffset),
	}, function()
		return pageStates.placementRotationOffset(function(offset)
			return offset + 90
		end)
	end))
	-- when ever the left press is pressed
	trash:Add(UIUtilities.ButtonAction({
		Button = placementPage.LeftPress,
		ExpandedSize = UIUtilities.MultiplyUdim2(placementPage.LeftPress.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(placementPage.LeftPress.Size, sizeOffset),
	}, function()
		return pageStates.placementRotationOffset(function(offset)
			return offset - 90
		end)
	end))
	-- when the place button is pressed
	trash:Add(UIUtilities.ButtonAction({
		Button = placementPage.Placetext,
		ExpandedSize = UIUtilities.MultiplyUdim2(placementPage.Placetext.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(placementPage.Placetext.Size, sizeOffset),
	}, function()
		if pageStates.openPage() == "Placement" then
			pageStates.placeVillager(true)
		elseif pageStates.openPage() == "Dig" then
			pageStates.digVillager(true)
		end
	end))
	return trash
end
return {
	default = default,
}
