-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
--[[
	****************************************************************************************
	 * Damage Status Effects System using Matter ECS and Roblox Services.
	 *
	 * This system processes damage events for entities. If the attacker exists in the world,
	 * and the entity that took damage is a mob named "ExpDummy", it awards experience points
	 * to the attacker. Finally, the damage component is removed from the entity.
	 *
	 * Debug information including line numbers is printed, and operations are wrapped in
	 * Promise.try with catch to ensure robust error management.
	 ****************************************************************************************
]]
-- Matter and Roblox Imports
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local componentsToReplicate = _jecsComponents.componentsToReplicate
local Phases = _jecsComponents.Phases
local useMemo = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useMemo
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local warnTS = _jecsHelpFunctions.warnTS
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local deepCopy = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepCopy
local appendJecs = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "append").appendJecs
local getInstanceByUniqueIdPath = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "instanceFunctions").getInstanceByUniqueIdPath
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
-- checks data for __ByteNetInstancePath to make sure it has all the instances replicated
local function checkData(data)
	-- recursive check/fix
	local function check(path, index, value)
		-- if data is a table then check each value
		local _value = value
		if type(_value) == "table" then
			if value.__ByteNetInstancePath ~= nil then
				local instance = getInstanceByUniqueIdPath(value.__ByteNetInstancePath)
				if not instance then
					return { false, path }
				else
					path[index] = instance
				end
			else
				-- saves it
				path[index] = {}
				-- if the value is a table then check each value
				for key, val in pairs(value) do
					local _binding = check(path[index], key, val)
					local passed = _binding[1]
					local newPath = _binding[2]
					-- if passed then continue
					if not passed then
						return { false, newPath }
					end
				end
			end
		else
			path[index] = value
		end
		return { true, path }
	end
	-- if data is a table and has __ByteNetInstancePath then return true
	local _data = data
	if type(_data) == "table" then
		if data.__ByteNetInstancePath ~= nil then
			local instance = getInstanceByUniqueIdPath(data.__ByteNetInstancePath)
			-- if instance is not in the world then return false
			if not instance then
				return false, data
			else
				return true, instance
			end
		else
			local newData = deepCopy(data)
			for key, value in pairs(data) do
				local _binding = check(newData, key, value)
				local passed = _binding[1]
				local newPath = _binding[2]
				-- if passed then continue
				if not passed then
					return false, data
				end
			end
			return true, newData
		end
	else
		return true, data
	end
end
--[[
	****************************************************************************************
	 * Damage Status Effects System Entry Point.
	 ****************************************************************************************
]]
local default = {
	phase = Phases.First,
	system = function(world)
		-- loops through each
		for componentName, component in pairs(componentsToReplicate) do
			-- function to replicate
			local replicate
			replicate = function(_param)
				local serverEntity = _param.serverEntity
				local data = _param.data
				local passed, newData = checkData(data)
				-- if passed then continue
				if passed then
					local _condition = getEntity.replicatedFromServerEntity(serverEntity)
					if not (_condition ~= 0 and _condition == _condition and _condition) then
						_condition = createEntity.replicated(serverEntity)
					end
					local clientEntity = _condition
					-- if client entity and not newData then delete entity
					if not (newData ~= 0 and newData == newData and newData ~= "" and newData) then
						world:remove(clientEntity, component)
					else
						print(`Replicating {componentName} for {serverEntity}: {newData}`)
						world:set(clientEntity, component, newData)
					end
				else
					warnTS(121, `Failed to replicate {componentName} for {serverEntity}: {newData}. Some parts arent fully replicated will try again.`)
					appendJecs(function()
						return replicate({
							serverEntity = serverEntity,
							data = newData,
						})
					end)
				end
			end
			-- when ever data gets updated it updates the server entity
			useRoute(routes[componentName], replicate)
		end
		-- when the deleteReplicatedEntity is called
		useRoute(routes.deleteReplicatedEntity, function(serverEntity)
			local clientEntity = getEntity.replicatedFromServerEntity(serverEntity)
			-- if client entity then remove
			if clientEntity ~= 0 and clientEntity == clientEntity and clientEntity then
				world:delete(clientEntity)
			end
		end)
		-- request to get it all
		useMemo(function()
			return routes.getReplicatedComponents:send()
		end, {})
	end,
}
return {
	default = default,
}
