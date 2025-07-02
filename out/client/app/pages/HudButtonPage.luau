-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.05, 1.05)
	-- binds an action animation to buy
	trash:Add(UIUtilities.ButtonAction({
		Button = pagePaths.HUD.Buy,
		ExpandedSize = UIUtilities.MultiplyUdim2(pagePaths.HUD.Buy.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(pagePaths.HUD.Buy.Size, sizeOffset),
	}, function()
		routes.teleportToShop:send("Buy")
	end))
	-- binds an action animation to sell
	trash:Add(UIUtilities.ButtonAction({
		Button = pagePaths.HUD.Sell,
		ExpandedSize = UIUtilities.MultiplyUdim2(pagePaths.HUD.Sell.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(pagePaths.HUD.Sell.Size, sizeOffset),
	}, function()
		routes.teleportToShop:send("Sell")
	end))
	-- binds an action animation to village
	trash:Add(UIUtilities.ButtonAction({
		Button = pagePaths.HUD.Village,
		ExpandedSize = UIUtilities.MultiplyUdim2(pagePaths.HUD.Village.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(pagePaths.HUD.Village.Size, sizeOffset),
	}, function()
		routes.teleportToVillage:send()
		pageStates.openPage("None")
	end))
	-- binds an action animation to shop
	trash:Add(UIUtilities.ButtonAction({
		Button = pagePaths.HUD.Shop,
		ExpandedSize = UIUtilities.MultiplyUdim2(pagePaths.HUD.Shop.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(pagePaths.HUD.Shop.Size, sizeOffset),
		AccountForTouch = true,
	}, function()
		pageStates.openPage("RobuxStore")
	end))
	-- binds the wall button to open the shop
	trash:Add(UIUtilities.ButtonAction({
		Button = pagePaths.HUD.Walls,
		ExpandedSize = UIUtilities.MultiplyUdim2(pagePaths.HUD.Walls.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(pagePaths.HUD.Walls.Size, sizeOffset),
	}, function()
		routes.teleportToShop:send("Wall")
	end))
	-- updates your coins
	trash:Add(useEffect(function(newTrash)
		local newPrice = pageStates.coins()
		local oldPriceString = string.gsub(pagePaths.Page.Playercash.Text, "%$", "")
		local _condition = tonumber(oldPriceString)
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = 0
		end
		local oldPrice = _condition
		-- tweens the price
		pagePaths.Page.Playercash:SetAttribute("Coins", newPrice)
		newTrash:Add(task.spawn(function()
			while oldPrice ~= newPrice do
				local directionToNewPrice = if newPrice - oldPrice > 0 then 1 else -1
				oldPrice += math.floor(directionToNewPrice * math.max(1, math.abs(newPrice - oldPrice) / 10))
				pagePaths.Page.Playercash.Text = `${oldPrice}`
				task.wait(0.01)
			end
			pagePaths.Page.Playercash.Text = `${newPrice}`
		end))
	end))
	return trash
end
return {
	default = default,
}
