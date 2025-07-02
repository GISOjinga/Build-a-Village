-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local TweenService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").TweenService
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local _uiUtilities = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "uiUtilities")
local UIUtilities = _uiUtilities
local AddUdim2 = _uiUtilities.AddUdim2
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.05, 1.05)
	local confirmPage = pagePaths.ConfirmPage
	local goalPosition = confirmPage.Position
	-- use effect on trash
	trash:Add(useEffect(function(newTrash)
		local tweenInPosition = newTrash:Add(TweenService:Create(confirmPage, TweenInfo.new(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), {
			Position = goalPosition,
		}))
		local tweenOutPosition = newTrash:Add(TweenService:Create(confirmPage, TweenInfo.new(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), {
			Position = AddUdim2(goalPosition, UDim2.fromScale(.5, 0)),
		}))
		local confirmInfo = pageStates.confirmPrompt()
		-- sets the texts
		confirmPage.title.Text = confirmInfo.title
		confirmPage.message.Text = confirmInfo.message
		-- if the confirm info is not set then return
		if confirmInfo.title == "" or confirmInfo.message == "" then
			tweenInPosition:Cancel()
			tweenOutPosition:Play()
		else
			tweenOutPosition:Cancel()
			tweenInPosition:Play()
		end
	end))
	-- when declined
	trash:Add(UIUtilities.ButtonAction({
		Button = confirmPage.Decline,
		ExpandedSize = UIUtilities.MultiplyUdim2(confirmPage.Decline.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(confirmPage.Decline.Size, sizeOffset),
	}, function()
		routes.confirmPrompt:send(false)
		pageStates.confirmPrompt({
			title = "",
			message = "",
		})
	end))
	-- when clicked on accpect
	trash:Add(UIUtilities.ButtonAction({
		Button = confirmPage.Accept,
		ExpandedSize = UIUtilities.MultiplyUdim2(confirmPage.Accept.Size, sizeOffset),
		DeExpandedSize = UIUtilities.DivideUdim2(confirmPage.Accept.Size, sizeOffset),
	}, function()
		routes.confirmPrompt:send(true)
		pageStates.confirmPrompt({
			title = "",
			message = "",
		})
	end))
	confirmPage.Visible = true
	return trash
end
return {
	default = default,
}
