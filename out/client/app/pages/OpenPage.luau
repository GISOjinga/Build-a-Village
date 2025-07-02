-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local TweenService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").TweenService
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.1, 1.1)
	local robuxStoreDirection, wallDirection = 1, 1
	local originalPositions = {
		Gift = pagePaths.GiftPage.Position,
		Wall = pagePaths.WallPage.Position,
		Buy = pagePaths.VillagersPage.Position,
		RobuxStore = pagePaths.RobuxStore.Position,
		Promo = pagePaths.PromoPage.Position,
	}
	local pageNameToInstance = {
		Gift = pagePaths.GiftPage,
		Wall = pagePaths.WallPage,
		Buy = pagePaths.VillagersPage,
		RobuxStore = pagePaths.RobuxStore,
		Promo = pagePaths.PromoPage,
	}
	-- loops through all the page paths
	for _, page in pairs(pagePaths) do
		local closeButton = page:FindFirstChild("Close")
		-- binds an action animation to close the page
		if closeButton then
			trash:Add(UIUtilities.ButtonAction({
				Button = closeButton,
				ExpandedSize = UIUtilities.MultiplyUdim2(closeButton.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(closeButton.Size, sizeOffset),
			}, function()
				pageStates.openPage("None")
			end))
		end
	end
	trash:Add(useEffect(function(newTrash)
		local openPage = pageStates.openPage()
		-- if the page is not open then return
		robuxStoreDirection = if openPage == "RobuxStore" then robuxStoreDirection * -1 else robuxStoreDirection
		wallDirection = if openPage == "Wall" then wallDirection * -1 else wallDirection
		-- loops through all of them to tween each
		for pageName, page in pairs(pageNameToInstance) do
			local originalPagePosition = originalPositions[pageName]
			local closePosition = if pageName == "Gift" then UDim2.fromScale(originalPositions.Gift.X.Scale, 2) elseif pageName == "Buy" then UDim2.fromScale(originalPositions.Buy.X.Scale, -2) elseif pageName == "RobuxStore" then UDim2.fromScale(-2 * robuxStoreDirection, originalPositions.RobuxStore.Y.Scale) elseif pageName == "Wall" then UDim2.fromScale(-2 * wallDirection, originalPositions.Wall.Y.Scale) elseif pageName == "Promo" then UDim2.fromScale(originalPositions.Promo.X.Scale, 2) else UDim2.fromScale(.5, -2)
			-- sets the position of the page
			page.Visible = true
			-- creates a tween to move the page to its position
			newTrash:Add(TweenService:Create(page, TweenInfo.new(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), {
				Position = if openPage == pageName then originalPagePosition else closePosition,
			})):Play()
		end
	end))
	return trash
end
return {
	default = default,
}
