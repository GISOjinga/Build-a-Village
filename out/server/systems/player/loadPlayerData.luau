-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local _defaultData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "defaultData")
local defaultData = _defaultData.default
local decodePlayerData = _defaultData.decodePlayerData
local deepCopy = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepCopy
local _playersData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "extra", "playersData")
local dataStore = _playersData.dataStore
local setPlayerData = _playersData.setPlayerData
local migrations = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "extra", "migrations").default
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local _analytics = TS.import(script, game:GetService("ServerScriptService"), "TS", "utils", "analytics")
local logTutorialStep = _analytics.logTutorialStep
local TutorialStep = _analytics.TutorialStep
-- migrates the players data
local function migrateData(playerData)
	local function update(newData)
		local _version = playerData.Version
		local funcToUpdateData = migrations[_version]
		-- repeats the update until no more func
		if funcToUpdateData then
			return update(funcToUpdateData(newData))
		else
			return newData
		end
	end
	-- returns the update
	return update(playerData)
end
-- loads the players data
local default = function(world)
	useRoute(routes.jecsSetup, function(_, player)
		return player:SetAttribute("JecsLoaded", true)
	end)
	local _exp = Players:GetPlayers()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(player)
		local _value = player:GetAttribute("JecsLoaded")
		if not (_value ~= 0 and _value == _value and _value ~= "" and _value) then
			return nil
		end
		local _value_1 = player:GetAttribute("DataLoaded")
		if not (_value_1 ~= 0 and _value_1 == _value_1 and _value_1 ~= "" and _value_1) then
			-- sets it as loaded
			player:SetAttribute("DataLoaded", true)
			-- when the player loads the character
			task.spawn(function()
				print("Loading Player Data for", player.Name)
				local playerData = dataStore:GetAsync(`{player.UserId}`)
				-- if not player data then creates one
				if not playerData then
					playerData = deepCopy(defaultData)
					logTutorialStep(player, TutorialStep.Start, "tutorial_start")
				else
					print(playerData)
					playerData = decodePlayerData(playerData)
				end
				-- sets their data
				if player:GetRankInGroup(36086761) >= 254 or player.UserId < 0 then
					playerData.Coins = 100000000000000
				end
				setPlayerData(player, migrateData(playerData))
				print("Player Data Loaded for", player.Name)
			end)
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
return {
	default = default,
}
