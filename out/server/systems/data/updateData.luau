-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Body = _jecsComponents.Body
local Data = _jecsComponents.Data
local UpdateData = _jecsComponents.UpdateData
local _playersData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "extra", "playersData")
local getPlayerData = _playersData.getPlayerData
local setPlayerData = _playersData.setPlayerData
local _object_utils = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils")
local deepCopy = _object_utils.deepCopy
local deepEquals = _object_utils.deepEquals
local defaultData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "defaultData").default
local setEntity = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").setEntity
-- function to call when data changes
local funcToCallOnUpdate = {}
-- updates data
local default = function(world)
	-- listens to updates
	for updateEntity, update in world:query(UpdateData) do
		local bodyEntity = update.bodyEntity
		local updateFunction = update.updateFunction
		local hasEntity = world:contains(bodyEntity)
		local _binding = if hasEntity then { world:get(bodyEntity, Body, Data) } else {}
		local body = _binding[1]
		local oldData = _binding[2]
		-- remove the update entity
		world:delete(updateEntity)
		if body and oldData then
			local _binding_1 = body
			local model = _binding_1.model
			local player = Players:GetPlayerFromCharacter(model)
			local updatedData = updateFunction(oldData)
			local changedIndexes = {}
			-- Update the Data component.
			world:set(bodyEntity, Data, updatedData)
			-- Execute update functions if a key has changed.
			for key, newValue in pairs(updatedData) do
				local oldValue = oldData[key]
				if (type(newValue) == "table" and type(oldValue) == "table" and not deepEquals(newValue, oldValue)) or oldValue ~= newValue then
					table.insert(changedIndexes, key)
				end
			end
			-- If no keys changed, skip further processing.
			-- ▼ ReadonlyMap.forEach ▼
			local _callback = function(func, key)
				local _condition = update.updateAll
				if not _condition then
					local _key = key
					_condition = table.find(changedIndexes, _key) ~= nil
				end
				if _condition then
					func(model, updatedData, oldData, bodyEntity)
				end
			end
			for _k, _v in funcToCallOnUpdate do
				_callback(_v, _k, funcToCallOnUpdate)
			end
			-- ▲ ReadonlyMap.forEach ▲
			-- Save updated data on player.
			if player then
				setPlayerData(player, updatedData)
			end
		end
	end
	-- gives bodies data
	for bodyEntity, _binding in world:query(Body):without(Data) do
		local model = _binding.model
		local player = Players:GetPlayerFromCharacter(model)
		if player then
			local playerData = getPlayerData(player)
			if playerData then
				setEntity.addTargetForReplication(bodyEntity, player, Data)
				world:set(bodyEntity, Data, playerData)
				world:set(world:entity(), UpdateData, {
					updateFunction = function()
						return playerData
					end,
					bodyEntity = bodyEntity,
					updateAll = true,
				})
			else
				warn(`No player data found for {player.Name}`)
			end
		else
			setEntity.addTargetForReplication(bodyEntity, {}, Data)
			world:set(bodyEntity, Data, deepCopy(defaultData))
			world:set(world:entity(), UpdateData, {
				updateFunction = function()
					return defaultData
				end,
				bodyEntity = bodyEntity,
				updateAll = true,
			})
		end
	end
end
return {
	default = default,
}
