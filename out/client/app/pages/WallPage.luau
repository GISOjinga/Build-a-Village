-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local MarketplaceService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").MarketplaceService
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local printTS = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").printTS
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local addCommasEveryThreeDigits = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "stringHelp").addCommasEveryThreeDigits
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- mapped to the game pass id to the product info
local wallsAndGamePassInfo = {}
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.2, 1.2)
	local wallPage = pagePaths.WallPage
	local scrollingFrame = wallPage.ScrollingFrame
	local sample = scrollingFrame.Sample
	-- when ever the walls update
	trash:Add(useEffect(function(newTrash)
		local _wallsShop = pageStates.wallsShop()
		-- if the walls shop is empty then return
		newTrash:Add(task.spawn(function()
			-- if the walls shop is not loaded then return
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(wall)
				local _condition = wall.GamePassId > 0
				if _condition then
					local _gamePassId = wall.GamePassId
					_condition = not (wallsAndGamePassInfo[_gamePassId] ~= nil)
				end
				if _condition then
					local _gamePassId = wall.GamePassId
					local _arg1 = MarketplaceService:GetProductInfo(wall.GamePassId, Enum.InfoType.GamePass)
					wallsAndGamePassInfo[_gamePassId] = _arg1
				end
			end
			for _k, _v in _wallsShop do
				_callback(_v, _k - 1, _wallsShop)
			end
			-- ▲ ReadonlyArray.forEach ▲
			-- if the walls shop is empty then return
			table.sort(_wallsShop, function(a, b)
				local _condition = a.GamePassId
				if not (_condition ~= 0 and _condition == _condition and _condition) then
					_condition = b.GamePassId
				end
				if _condition ~= 0 and _condition == _condition and _condition then
					local _result
					if a.GamePassId > 0 then
						local _gamePassId = a.GamePassId
						local _result_1 = wallsAndGamePassInfo[_gamePassId]
						if _result_1 ~= nil then
							_result_1 = _result_1.PriceInRobux
						end
						local _condition_1 = _result_1
						if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
							_condition_1 = 0
						end
						_result = _condition_1
					else
						_result = -1
					end
					local aTotalPrice = _result
					local _result_1
					if b.GamePassId > 0 then
						local _gamePassId = b.GamePassId
						local _result_2 = wallsAndGamePassInfo[_gamePassId]
						if _result_2 ~= nil then
							_result_2 = _result_2.PriceInRobux
						end
						local _condition_1 = _result_2
						if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
							_condition_1 = 0
						end
						_result_1 = _condition_1
					else
						_result_1 = -1
					end
					local bTotalPrice = _result_1
					return aTotalPrice < bTotalPrice
				else
					local aTotalPrice = a.Price
					local bTotalPrice = b.Price
					return aTotalPrice < bTotalPrice
				end
			end)
			local wallsShop = _wallsShop
			-- starts off by clearing up the wall shop scrolling frame
			local _exp = scrollingFrame:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_1 = function(child)
				if child ~= sample and child:IsA("Frame") then
					child:Destroy()
				end
			end
			for _k, _v in _exp do
				_callback_1(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			-- loads in each of the walls
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_2 = function(wallInfo, index)
				local wallBox = sample:Clone()
				local buyButton = wallBox.buy
				local equipButton = wallBox.equip
				local unequipButton = wallBox.unequip
				local robuxButton = wallBox.robux
				local _condition = wallInfo.GamePassId
				if not (_condition ~= 0 and _condition == _condition and _condition) then
					_condition = 0
				end
				local passInfo = wallsAndGamePassInfo[_condition]
				-- set up
				sample.Visible = false
				paths.Assets.UI.WallRenders[wallInfo.Name]:Clone().Parent = wallBox.WallViewPort
				wallBox.Visible = true
				wallBox.Name = wallBox.Name
				wallBox.LayoutOrder = index
				wallBox.equip.Visible = wallInfo.Owned and not wallInfo.Equipped
				wallBox.unequip.Visible = wallInfo.Equipped
				wallBox.buy.Visible = not wallInfo.Owned
				wallBox.Price.Visible = wallInfo.Price > 0
				wallBox.RobuxPrice.Visible = wallInfo.GamePassId > 0
				wallBox.buy.Visible = wallInfo.Price > 0 and not wallInfo.Owned
				wallBox.robux.Visible = wallInfo.GamePassId > 0 and not wallInfo.Owned
				wallBox.Price.Text = `${addCommasEveryThreeDigits(wallInfo.Price)}`
				wallBox.Multiplier.Text = `X{wallInfo.CashMultiplier} CASH GAIN`
				wallBox.SampleName.Text = wallInfo.Name
				wallBox.Parent = scrollingFrame
				-- sets up the pricing for robux walls
				local _result
				if passInfo then
					local _condition_1 = passInfo.PriceInRobux
					if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
						_condition_1 = 0
					end
					_result = _condition_1 > 0
				else
					_result = false
				end
				wallBox.RobuxPrice.Visible = _result
				wallBox.RobuxPrice.Text = `{if passInfo then passInfo.PriceInRobux else 0}`
				-- binds the focus action
				if wallInfo.Owned and not wallInfo.Equipped then
					-- sets the buttons to be interactable
					robuxButton.Interactable = false
					buyButton.Interactable = false
					equipButton.Interactable = true
					unequipButton.Interactable = false
					-- binds equip
					newTrash:Add(UIUtilities.ButtonAction({
						Button = equipButton,
						ExpandedSize = UIUtilities.MultiplyUdim2(equipButton.Size, sizeOffset),
						DeExpandedSize = UIUtilities.DivideUdim2(equipButton.Size, sizeOffset),
					}, function()
						printTS(102, "equipping wall", wallInfo.Name)
						routes.equipWall:send({
							wallName = wallInfo.Name,
							equip = true,
						})
					end))
				elseif wallInfo.Equipped and wallInfo.Owned then
					-- sets the buttons to be interactable
					robuxButton.Interactable = false
					buyButton.Interactable = false
					equipButton.Interactable = false
					unequipButton.Interactable = true
					-- binds un unequip
					newTrash:Add(UIUtilities.ButtonAction({
						Button = unequipButton,
						ExpandedSize = UIUtilities.MultiplyUdim2(unequipButton.Size, sizeOffset),
						DeExpandedSize = UIUtilities.DivideUdim2(unequipButton.Size, sizeOffset),
					}, function()
						printTS(122, "unequipping wall", wallInfo.Name)
						routes.equipWall:send({
							wallName = wallInfo.Name,
							equip = false,
						})
					end))
				else
					local realBuyButton = if wallInfo.Price > 0 then buyButton else robuxButton
					-- sets the buttons to be interactable
					robuxButton.Interactable = false
					buyButton.Interactable = false
					equipButton.Interactable = false
					unequipButton.Interactable = false
					realBuyButton.Interactable = true
					-- binds the robux button to prompt the purchase
					newTrash:Add(UIUtilities.ButtonAction({
						Button = realBuyButton,
						ExpandedSize = UIUtilities.MultiplyUdim2(realBuyButton.Size, sizeOffset),
						DeExpandedSize = UIUtilities.DivideUdim2(realBuyButton.Size, sizeOffset),
					}, function()
						printTS(144, "buying wall", wallInfo.Name, wallInfo.Price)
						routes.buyWall:send({
							wallName = wallInfo.Name,
							currency = if realBuyButton == robuxButton then "Robux" else "Coins",
						})
					end))
				end
			end
			for _k, _v in wallsShop do
				_callback_2(_v, _k - 1, wallsShop)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end))
	end))
	return trash
end
return {
	default = default,
}
