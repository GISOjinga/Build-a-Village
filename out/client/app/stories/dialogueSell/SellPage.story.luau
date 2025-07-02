-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local DialogueSell = TS.import(script, script.Parent.Parent.Parent, "DialogueSellUI").default
-- return the controller
return function(sellPage)
	local trash = Janitor.new()
	-- Create a root for the frame
	local _exp = paths.Assets.UI.DialogueSell:GetChildren()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(child)
		local _exp_1 = child:Clone()
		_exp_1.Parent = sellPage
		return _exp_1.Parent
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
	trash:Add(DialogueSell(sellPage))
	--We need to return another function to unmount the handle
	return function()
		trash:Destroy()
	end
end
