-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local MarketplaceService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").MarketplaceService
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local _stringHelp = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "stringHelp")
local addCommasEveryThreeDigits = _stringHelp.addCommasEveryThreeDigits
local formatToDDHHMMSS = _stringHelp.formatToDDHHMMSS
local WEEK_LENGTH = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "robuxStoreData").WEEK_LENGTH
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.02, 1.02)
	local robuxStorePage = pagePaths.RobuxStore
	local scrollingFrame = robuxStorePage.ScrollingFrame
	local starterPackFrame = scrollingFrame.StarterPack
	local launchPackFrame = scrollingFrame.LaunchPack
	trash:Add(useEffect(function(effectTrash)
		local setupPurchase = function(frame, purchaseKey)
			local purchaseData = pageStates.robuxStore()[purchaseKey]
			frame.packname.Text = purchaseData.Name
			local buyButton = frame.purchaseoptions.buy
			local giftButton = frame.purchaseoptions.gift
			-- show robux price
			task.spawn(function()
				local ok, info = pcall(function()
					return MarketplaceService:GetProductInfo(purchaseData.ProductId, Enum.InfoType.Product)
				end)
				local price = if ok then info.PriceInRobux else 0
				if frame == starterPackFrame then
					buyButton.Text = ` {price}`
				else
					local launchBuy = buyButton
					launchBuy.price.Text = ` {price}`
				end
			end)
			if frame == starterPackFrame then
				frame.items.cash.Text = `+${addCommasEveryThreeDigits(purchaseData.Coins)}!`
			end
			-- load villager renders
			local slots = if frame == starterPackFrame then { frame.items.b1, frame.items.m1, frame.items.m2 } else { launchPackFrame.items.b1, launchPackFrame.items.s1, launchPackFrame.items.s2, launchPackFrame.items.s3, launchPackFrame.items.s4 }
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(slot)
				local _exp = slot:GetChildren()
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_1 = function(child)
					if not child:IsA("UIStroke") then
						child:Destroy()
					end
				end
				for _k, _v in _exp do
					_callback_1(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
			for _k, _v in slots do
				_callback(_v, _k - 1, slots)
			end
			-- ▲ ReadonlyArray.forEach ▲
			local _exp = purchaseData.Villagers
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_1 = function(villager, index)
				local slot = slots[index + 1]
				local _result = paths.Assets.UI.VillagerRenders:FindFirstChild(villager)
				if _result ~= nil then
					_result = _result:Clone()
				end
				local render = _result
				if slot and render then
					render.Parent = slot
					render.Visible = true
				end
			end
			for _k, _v in _exp do
				_callback_1(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			effectTrash:Add(UIUtilities.ButtonAction({
				Button = buyButton,
				ExpandedSize = UIUtilities.MultiplyUdim2(buyButton.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(buyButton.Size, sizeOffset),
			}, function()
				routes.buyRobuxPack:send({
					purchase = purchaseKey,
				})
			end))
			effectTrash:Add(UIUtilities.ButtonAction({
				Button = giftButton,
				ExpandedSize = UIUtilities.MultiplyUdim2(giftButton.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(giftButton.Size, sizeOffset),
			}, function()
				pageStates.productToGift(purchaseData.ProductId)
				pageStates.openPage("Gift")
			end))
			effectTrash:Add(task.spawn(function()
				while true do
					local timeLeft = WEEK_LENGTH - (os.time() % WEEK_LENGTH)
					frame.CountDown.Text = formatToDDHHMMSS(timeLeft)
					task.wait(1)
				end
			end))
		end
		setupPurchase(starterPackFrame, "StarterPack")
		setupPurchase(launchPackFrame, "LaunchPack")
	end))
	return trash
end
return {
	default = default,
}
