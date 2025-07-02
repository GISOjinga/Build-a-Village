-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Changed = _jecsComponents.Changed
local Data = _jecsComponents.Data
local Player = _jecsComponents.Player
local Removed = _jecsComponents.Removed
local TargetEntity = _jecsComponents.TargetEntity
-- leader board instances
local leaderStatsMapping = setmetatable({}, {
	__mode = "k",
})
local default = function(world)
	for _, playerEntity, changed in world:query(TargetEntity, Changed(Data)) do
		local data = changed.new
		local player = world:get(playerEntity, Player)
		-- creates a leaderstat if it doesn't exist
		if player and data then
			if not (leaderStatsMapping[player] ~= nil) then
				local leaderstats = Instance.new("Folder")
				leaderstats.Name = "leaderstats"
				leaderstats.Parent = player
				local coins = Instance.new("IntValue")
				coins.Name = "Coins"
				coins.Value = 0
				coins.Parent = leaderstats
				local _arg1 = {
					Container = leaderstats,
					Coins = coins,
				}
				leaderStatsMapping[player] = _arg1
			end
			-- updates the coin value
			local _binding = leaderStatsMapping[player]
			local Coins = _binding.Coins
			Coins.Value = data.Coins
		end
	end
	-- when player removing then
	for playerEntity in world:query(Removed(Player)) do
		local player = world:get(playerEntity, Player)
		-- if player exists then remove the leaderstats
		if player and leaderStatsMapping[player] ~= nil then
			local _binding = leaderStatsMapping[player]
			local Container = _binding.Container
			Container:Destroy()
			leaderStatsMapping[player] = nil
		end
	end
end
return {
	default = default,
}
