-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local MarketplaceService = _services.MarketplaceService
local Players = _services.Players
local TweenService = _services.TweenService
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local formatDuration = function(totalSeconds)
	--Handle negative durations by converting to positive
	if totalSeconds < 0 then
		totalSeconds = -totalSeconds
	end
	--Calculate each unit
	local secondsInMinute = 60
	local secondsInHour = 60 * secondsInMinute
	local secondsInDay = 24 * secondsInHour
	local secondsInMonth = 30 * secondsInDay
	local months = math.floor(totalSeconds / secondsInMonth)
	local days = math.floor((totalSeconds % secondsInMonth) / secondsInDay)
	local hours = math.floor((totalSeconds % secondsInDay) / secondsInHour)
	local minutes = math.floor((totalSeconds % secondsInHour) / secondsInMinute)
	local seconds = math.floor(totalSeconds % secondsInMinute)
	--Build parts in order, skipping zero values except seconds
	local parts = {}
	if months > 0 then
		local _arg0 = tostring(months) .. "mo"
		table.insert(parts, _arg0)
	end
	if days > 0 then
		local _arg0 = tostring(days) .. "d"
		table.insert(parts, _arg0)
	end
	if hours > 0 then
		local _arg0 = tostring(hours) .. "h"
		table.insert(parts, _arg0)
	end
	if minutes > 0 then
		local _arg0 = tostring(minutes) .. "m"
		table.insert(parts, _arg0)
	end
	local _arg0 = tostring(seconds) .. "s"
	table.insert(parts, _arg0)
	--Concatenate with spaces
	-- ▼ ReadonlyArray.reduce ▼
	if #parts == 0 then
		error("Attempted to call `ReadonlyArray.reduce()` on an empty array without an initialValue.")
	end
	local _result = parts[1]
	local _callback = function(newString, oldString)
		return newString .. " " .. oldString
	end
	for _i = 2, #parts do
		_result = _callback(_result, parts[_i], _i - 1, parts)
	end
	-- ▲ ReadonlyArray.reduce ▲
	return _result
end
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.05, 1.05)
	local villagersContent = pagePaths.VillagersPage.ScrollingFrame
	local buyButton = villagersContent.Buy
	local buyButtonGoalSize = buyButton.Size
	local exampleBox = villagersContent.Sample
	local buyButtonTweenInfo = TweenInfo.new(0.3, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out)
	-- sets the buy button size to be invisible
	pagePaths.VillagersPage.Visible = true
	exampleBox.Visible = false
	buyButton.Size = UDim2.fromScale(0, 0)
	buyButton.Visible = true
	-- when restock is pressed
	trash:Add(UIUtilities.ButtonAction({
		Button = pagePaths.VillagersPage.ReStock,
		ExpandedSize = UIUtilities.MultiplyUdim2(pagePaths.VillagersPage.ReStock.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(pagePaths.VillagersPage.ReStock.Size, sizeOffset),
	}, function()
		MarketplaceService:PromptProductPurchase(Players.LocalPlayer, 3308848691)
	end))
	-- loads in each box
	trash:Add(useEffect(function(newTrash)
		local villagersShop = pageStates.villagersShop()
		local buyButtonFocus = pageStates.buyButtonFocus()
		-- cleans up the old ones
		local _exp = villagersContent:GetChildren()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(child)
			if child:IsA("ImageButton") and child ~= buyButton and child ~= exampleBox then
				child:SetAttribute("InUse", false)
			end
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- loads them in
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(villagerInfo, index)
			local villagerBox = villagersContent:FindFirstChild(villagerInfo.Name) or exampleBox:Clone()
			local sizeOffset = UDim2.fromScale(1.01, 1.01)
			local rarityImage = villagerBox:FindFirstChild("Rarity" .. villagerInfo.Rarity)
			local _result = paths.Assets.UI.VillagerRenders:FindFirstChild(villagerInfo.Name)
			if _result ~= nil then
				_result = _result:Clone()
			end
			local villagerRenderViewPort = _result
			-- set up
			villagerBox:SetAttribute("InUse", true)
			villagerBox.Visible = true
			villagerBox.Name = villagerInfo.Name
			villagerBox.LayoutOrder = (index + 1) * 2
			villagerBox.Price.Text = `${villagerInfo.Price}`
			villagerBox.Stock.Text = `x{villagerInfo.InStock} stock`
			villagerBox.VillagerName.Text = villagerInfo.Name
			villagerBox.Tier.Text = `Tier {villagerInfo.Tier}`
			villagerBox.Parent = villagersContent
			-- sets the rarity
			if rarityImage then
				rarityImage.Visible = true
			end
			-- sets up the view port
			if villagerRenderViewPort then
				villagerRenderViewPort.Visible = true
				villagerRenderViewPort.Parent = villagerBox.VillagerViewPort
			end
			-- binds the focus action
			newTrash:Add(UIUtilities.ButtonAction({
				Button = villagerBox,
				ExpandedSize = UIUtilities.MultiplyUdim2(villagerBox.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(villagerBox.Size, UDim2.fromScale(1.08, 1.08)),
			}, function()
				pageStates.buyButtonFocus({
					visible = if (buyButtonFocus.selectedVillagerIndex == index and buyButtonFocus.visible) then false else true,
					selectedVillagerIndex = index,
				})
			end))
		end
		for _k, _v in villagersShop do
			_callback_1(_v, _k - 1, villagersShop)
		end
		-- ▲ ReadonlyArray.forEach ▲
		local _exp_1 = villagersContent:GetChildren()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_2 = function(child)
			local _condition = child:IsA("ImageButton") and child ~= buyButton and child ~= exampleBox
			if _condition then
				local _value = child:GetAttribute("InUse")
				_condition = not (_value ~= 0 and _value == _value and _value ~= "" and _value)
			end
			if _condition then
				child:Destroy()
			end
		end
		for _k, _v in _exp_1 do
			_callback_2(_v, _k - 1, _exp_1)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end))
	-- updates the buy button visibility
	trash:Add(useEffect(function(newTrash)
		local buyButtonFocus = pageStates.buyButtonFocus()
		local tween = newTrash:Add(TweenService:Create(buyButton, buyButtonTweenInfo, {
			BorderSizePixel = if buyButtonFocus.visible then 4 else 0,
			Size = if buyButtonFocus.visible then buyButtonGoalSize else UDim2.fromScale(0, -0.01),
		}))
		-- tweens the shadow holder
		newTrash:Add(TweenService:Create(buyButton.bg, buyButtonTweenInfo, {
			ImageTransparency = if buyButtonFocus.visible then 0 else 1,
		})):Play()
		-- buyButton.shadowHolder.Visible = buyButtonFocus.visible;
		-- toggles all ui strokes
		local _exp = buyButton:GetDescendants()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(descendant)
			if descendant:IsA("UIStroke") then
				local _condition = descendant:GetAttribute("OriginalThickness")
				if not (_condition ~= 0 and _condition == _condition and _condition) then
					_condition = descendant.Thickness
				end
				local originalThickness = _condition
				-- sets the original thickness
				descendant:SetAttribute("OriginalThickness", originalThickness)
				trash:Add(TweenService:Create(descendant, buyButtonTweenInfo, {
					Thickness = if buyButtonFocus.visible then originalThickness else 0,
				})):Play()
			end
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- updates the visibility of the buy button
		local _condition = buyButtonFocus.selectedVillagerIndex
		if _condition == nil then
			_condition = -1
		end
		buyButton.LayoutOrder = ((_condition + 1) * 2) + 1
		buyButton.Size = if buyButtonFocus.visible then UDim2.fromScale(0, 0) else buyButtonGoalSize
		tween:Play()
	end))
	-- when ever the robux or buy coins get pressed
	trash:Add(useEffect(function(newTrash)
		local buyButtonFocus = pageStates.buyButtonFocus()
		local villagersShop = pageStates.villagersShop()
		local villagerInfo = villagersShop[buyButtonFocus.selectedVillagerIndex + 1]
		-- updates the villager info box
		if villagerInfo then
			trash:Add(task.spawn(function()
				local passed, productInfo = pcall(function()
					return MarketplaceService:GetProductInfo(villagerInfo.ProductId, Enum.InfoType.Product)
				end)
				buyButton.Robux.Text = `{if passed then productInfo.PriceInRobux else 0}`
				-- if (!passed) printTS($line, "Failed to get product info for villager", villagerInfo.Name, ":", productInfo);
			end))
			buyButton.Normal.Visible = if villagerInfo.InStock > 0 then true else false
			buyButton.Normal.Text = `${villagerInfo.Price}`
			-- when buying with coins
			newTrash:Add(UIUtilities.ButtonAction({
				Button = buyButton.Normal,
				ExpandedSize = UIUtilities.MultiplyUdim2(buyButton.Normal.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(buyButton.Normal.Size, sizeOffset),
			}, function()
				routes.buyVillager:send({
					villagerIndex = buyButtonFocus.selectedVillagerIndex,
					currency = "Coins",
				})
			end))
			-- when buying with robux
			newTrash:Add(UIUtilities.ButtonAction({
				Button = buyButton.Robux,
				ExpandedSize = UIUtilities.MultiplyUdim2(buyButton.Robux.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(buyButton.Robux.Size, sizeOffset),
			}, function()
				routes.buyVillager:send({
					villagerIndex = buyButtonFocus.selectedVillagerIndex,
					currency = "Robux",
				})
			end))
			-- request to buy
			newTrash:Add(UIUtilities.ButtonAction({
				Button = buyButton.Gift,
				ExpandedSize = UIUtilities.MultiplyUdim2(buyButton.Gift.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(buyButton.Gift.Size, sizeOffset),
			}, function()
				pageStates.productToGift(villagerInfo.ProductId)
				pageStates.openPage("Gift")
			end))
		end
	end))
	-- any time totalTimeForNewVillager changes, we update the time
	trash:Add(task.spawn(function()
		while true do
			local totalTimeForNewVillager = pageStates.totalTimeForNewVillager()
			local formattedTime = formatDuration(totalTimeForNewVillager)
			-- updates the countdown text in a formated way
			pagePaths.VillagersPage.Countdown.Text = `New Villagers in {formattedTime}`
			task.wait(1)
		end
	end))
	return trash
end
return {
	default = default,
}
