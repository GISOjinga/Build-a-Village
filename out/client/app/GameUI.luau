-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local HudPage = TS.import(script, script.Parent, "pages", "HudButtonPage").default
local ReplicatedStorage = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").ReplicatedStorage
local OpenPage = TS.import(script, script.Parent, "pages", "OpenPage").default
local VillagersPage = TS.import(script, script.Parent, "pages", "VillagersPage").default
local GiftPage = TS.import(script, script.Parent, "pages", "GiftPage").default
local WallPage = TS.import(script, script.Parent, "pages", "WallPage").default
local RobuxStorePage = TS.import(script, script.Parent, "pages", "RobuxStorePage").default
local IntroTextPage = TS.import(script, script.Parent, "pages", "IntroTextPage").default
local PlacementPage = TS.import(script, script.Parent, "pages", "PlacementPage").default
local PromoPage = TS.import(script, script.Parent, "pages", "PromoPage").default
local InviteIncentivePage = TS.import(script, script.Parent, "pages", "InviteIncentivePage").default
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local ConfirmationPage = TS.import(script, script.Parent, "pages", "ConfirmationPage").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local pages = { HudPage, OpenPage, VillagersPage, GiftPage, WallPage, RobuxStorePage, IntroTextPage, PlacementPage, ConfirmationPage, PromoPage, InviteIncentivePage }
	-- listen to page changes
	trash:Add(routes.togglePage:listen(pageStates.openPage))
	-- renders the hud page
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(page)
		return trash:Add(page(pagePaths))
	end
	for _k, _v in pages do
		_callback(_v, _k - 1, pages)
	end
	-- ▲ ReadonlyArray.forEach ▲
	-- when trash gets cleaned up
	trash:Add(function()
		local _result = ReplicatedStorage:FindFirstChild("BytenetStorage")
		if _result ~= nil then
			_result:Destroy()
		end
		local _result_1 = ReplicatedStorage:FindFirstChild("ByteNetReliable")
		if _result_1 ~= nil then
			_result_1:Destroy()
		end
		local _result_2 = ReplicatedStorage:FindFirstChild("ByteNetUnreliable")
		if _result_2 ~= nil then
			_result_2:Destroy()
		end
	end)
	return trash
end
return {
	default = default,
}
