-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local function forEveryPlayer(joinFunc, leaveFunc)
	local events = {}
	local _exp = Players:GetPlayers()
	local _joinFunc = joinFunc
	for _k, _v in _exp do
		_joinFunc(_v, _k - 1, _exp)
	end
	local _arg0 = Players.PlayerAdded:Connect(joinFunc)
	table.insert(events, _arg0)
	if leaveFunc then
		local _arg0_1 = Players.PlayerRemoving:Connect(leaveFunc)
		table.insert(events, _arg0_1)
	end
	return events
end
return {
	forEveryPlayer = forEveryPlayer,
}
