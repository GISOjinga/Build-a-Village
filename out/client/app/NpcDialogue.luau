-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local ReplicatedStorage = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").ReplicatedStorage
local NpcDialoguePage = TS.import(script, script.Parent, "pages", "NpcDialoguePage").default
local default = function(dialoguePage)
	local trash = Janitor.new()
	local pages = { NpcDialoguePage }
	-- renders the hud page
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(page)
		return trash:Add(page(dialoguePage))
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
