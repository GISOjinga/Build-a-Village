-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local Workspace = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Workspace
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local UIUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local promoPage = pagePaths.PromoPage
	local sizeOffset = UDim2.fromScale(1.05, 1.05)
	-- Redeem button
	trash:Add(UIUtilities.ButtonAction({
		Button = promoPage.RedeemButton,
		ExpandedSize = UIUtilities.MultiplyUdim2(promoPage.RedeemButton.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(promoPage.RedeemButton.Size, sizeOffset),
	}, function()
		local code = promoPage.TextBox.Text
		routes.redeemPromo:send(code)
	end))
	-- Close button hides the page
	trash:Add(UIUtilities.ButtonAction({
		Button = promoPage.Close,
		ExpandedSize = UIUtilities.MultiplyUdim2(promoPage.Close.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(promoPage.Close.Size, sizeOffset),
	}, function()
		pageStates.openPage("None")
	end))
	trash:Add(routes.promoResult:listen(function(_param)
		local success = _param.success
		local message = _param.message
		promoPage.Title.Text = message
	end))
	-- when open pages changes
	trash:Add(useEffect(function()
		Workspace:SetAttribute("PromoCodes", if pageStates.openPage() == "Promo" then true else false)
	end))
	-- when ever promo codes get set and if open pages wasnt promo codes then sets it
	trash:Add(Workspace:GetAttributeChangedSignal("PromoCodes"):Connect(function()
		local _condition = Workspace:GetAttribute("PromoCodes")
		if _condition ~= 0 and _condition == _condition and _condition ~= "" and _condition then
			_condition = pageStates.openPage() ~= "Promo"
		end
		if _condition ~= 0 and _condition == _condition and _condition ~= "" and _condition then
			pageStates.openPage("Promo")
		else
			local _value = Workspace:GetAttribute("PromoCodes")
			local _condition_1 = not (_value ~= 0 and _value == _value and _value ~= "" and _value)
			if _condition_1 then
				_condition_1 = pageStates.openPage() == "Promo"
			end
			if _condition_1 then
				pageStates.openPage("None")
			end
		end
	end))
	return trash
end
return {
	default = default,
}
