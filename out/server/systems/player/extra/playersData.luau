-- Compiled with roblox-ts v3.0.0
local playerData = {}
local dataStore = game:GetService("DataStoreService"):GetDataStore("Build A Village v.0.0.5")
-- lets you get the players data
local function waitForPlayerData(player)
	local _player = player
	if not (playerData[_player] ~= nil) then
		warn(`Waiting for {player.Name} data to load.`)
		return waitForPlayerData(player)
	else
		local _player_1 = player
		return playerData[_player_1]
	end
end
-- gets the player data
local function getPlayerData(player)
	local _player = player
	return playerData[_player]
end
-- sets the player data
local function setPlayerData(player, data)
	local _player = player
	local _data = data
	playerData[_player] = _data
end
return {
	waitForPlayerData = waitForPlayerData,
	getPlayerData = getPlayerData,
	setPlayerData = setPlayerData,
	dataStore = dataStore,
}
