-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local MarketplaceService = _services.MarketplaceService
local Players = _services.Players
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.05, 1.05)
	local giftPage = pagePaths.GiftPage
	local scrollingFrame = giftPage.ScrollingFrame
	local sample = scrollingFrame.Sample
	-- loads in each box
	sample.Visible = false
	-- load players
	local loadPlayers = function()
		local _exp = Players:GetPlayers()
		-- ▼ ReadonlyArray.filter ▼
		local _newValue = {}
		local _callback = function(player)
			return player ~= Players.LocalPlayer
		end
		local _length = 0
		for _k, _v in _exp do
			if _callback(_v, _k - 1, _exp) == true then
				_length += 1
				_newValue[_length] = _v
			end
		end
		-- ▲ ReadonlyArray.filter ▲
		local players = _newValue
		-- clears all the samples that are already there and visible
		local _exp_1 = scrollingFrame:GetChildren()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(child)
			if child:IsA("ImageButton") and child.Visible and child ~= sample then
				child:Destroy()
			end
		end
		for _k, _v in _exp_1 do
			_callback_1(_v, _k - 1, _exp_1)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- loops through players makes a sample for each one
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_2 = function(player)
			local playerSample = sample:Clone()
			-- sets up sample
			playerSample.Visible = true
			playerSample.Parent = scrollingFrame
			-- sets the name
			playerSample.SampleName.Text = player.Name
			playerSample.SampleName.Text = player.Name
			-- when clicked
			trash:Add(UIUtilities.ButtonAction({
				Button = playerSample,
				ExpandedSize = UIUtilities.MultiplyUdim2(playerSample.Size, sizeOffset),
				DeExpandedSize = UIUtilities.DivideUdim2(playerSample.Size, sizeOffset),
			}, function()
				local productToGift = pageStates.productToGift()
				-- closes the gift page
				pageStates.openPage("None")
				-- if produict to gift then
				if productToGift ~= 0 and productToGift == productToGift and productToGift then
					routes.shopGiftTo.send(player)
					MarketplaceService:PromptProductPurchase(player, productToGift)
					return nil
				end
			end))
		end
		for _k, _v in players do
			_callback_2(_v, _k - 1, players)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	-- calls load players when ever player leaves or joins
	loadPlayers()
	Players.PlayerRemoving:Connect(loadPlayers)
	Players.PlayerAdded:Connect(loadPlayers)
	return trash
end
return {
	default = default,
}
