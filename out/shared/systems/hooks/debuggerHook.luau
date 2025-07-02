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
	phase = Phases.DebuggerHook,
	system = function(world)
		-- goes through all the debuggers
		-- for (const [_, { name }] of world.query(Debug)) createDebugger(true, name)
	end,
}
return {
	appendJecs = appendJecs,
	default = default,
}
