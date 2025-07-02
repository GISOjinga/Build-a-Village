-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useEvent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useEvent
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local encodePlayerData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "defaultData").encodePlayerData
local _playersData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "extra", "playersData")
local dataStore = _playersData.dataStore
local getPlayerData = _playersData.getPlayerData
local printJecs = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").printJecs
local Villager = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents").Villager
print("Saving Player Data System Loaded")
-- saves the players data
local default = function(world)
	for _binding in useEvent(Players.PlayerRemoving) do
		local player = _binding[1]
		local playerData = getPlayerData(player)
		local entity = player:GetAttribute("ServerId")
		-- gets the entity
		printJecs(23, "Destroying Player Entity: ", entity)
		-- if entity exists then destroy it
		local _condition = entity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = playerData
		end
		if _condition then
			-- when ever a villager updates it also updates that players data
			for _, newData in world:query(Villager) do
				local playerEntity = newData.playerEntity
				if playerEntity == entity then
					local _exp = playerData.Villagers
					-- ▼ ReadonlyArray.findIndex ▼
					local _callback = function(v)
						return v.UniqueId == newData.villagerData.UniqueId
					end
					local _result = -1
					for _i, _v in _exp do
						if _callback(_v, _i - 1, _exp) == true then
							_result = _i - 1
							break
						end
					end
					-- ▲ ReadonlyArray.findIndex ▲
					local indexOfVillager = _result
					if indexOfVillager ~= -1 then
						playerData.Villagers[indexOfVillager + 1] = newData.villagerData
					end
				end
			end
			world:delete(entity)
		end
		print(playerData)
		-- if player data then set async
		if playerData then
			task.spawn(function()
				return dataStore:SetAsync(`{player.UserId}`, encodePlayerData(playerData))
			end)
		end
	end
end
return {
	default = default,
}
