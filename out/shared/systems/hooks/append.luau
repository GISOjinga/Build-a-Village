-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Phases = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents").Phases
local waitingList = {}
local appendList = {}
-- adds it to a waiting list then when the cycle finaly sees it then calls it as a group with the others appends
local appendJecs = function(callback)
	local _callback = callback
	table.insert(waitingList, _callback)
	return #waitingList
end
-- for change
local default = {
	phase = Phases.AppendHook,
	system = function(world)
		-- call all append group waiting since last cycle
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(callback)
			return callback()
		end
		for _k, _v in appendList do
			_callback(_v, _k - 1, appendList)
		end
		-- ▲ ReadonlyArray.forEach ▲
		table.clear(appendList)
		-- pushes a group for next cycle (because a appen can happen last second and get removed last second before being cycled through)
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(callback)
			local _callback_2 = callback
			table.insert(appendList, _callback_2)
			return #appendList
		end
		for _k, _v in waitingList do
			_callback_1(_v, _k - 1, waitingList)
		end
		-- ▲ ReadonlyArray.forEach ▲
		table.clear(waitingList)
	end,
}
return {
	appendJecs = appendJecs,
	default = default,
}
