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
local Changed = _jecsComponents.Changed
local componentsToReplicate = _jecsComponents.componentsToReplicate
local Phases = _jecsComponents.Phases
local TargetEntity = _jecsComponents.TargetEntity
local TargetReplication = _jecsComponents.TargetReplication
local warnTS = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").warnTS
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local routes = TS.import(script, game:GetService("ServerScriptService"), "TS", "routes").default
-- sets up a instance with a unique id path
local registeredInstance = setmetatable({}, {
	__mode = "k",
})
local function setInstanceWithUniqueId(instance, uniqueIdPath)
	if uniqueIdPath == nil then
		uniqueIdPath = {}
	end
	if instance == game then
		return uniqueIdPath
	end
	if instance == nil then
		error(tostring(instance) .. "Doesn't exist")
	end
	local uniqueId = instance:GetAttribute("__UniqueInstanceId")
	-- if it already has a unique id then uses it
	if uniqueId ~= nil then
		table.insert(uniqueIdPath, 1, uniqueId)
		return setInstanceWithUniqueId(instance.Parent, uniqueIdPath)
	else
		local newUniqueId = {
			instance = instance,
		}
		local _uniqueIdPath = uniqueIdPath
		local _arg0 = tostring(newUniqueId)
		table.insert(_uniqueIdPath, 1, _arg0)
		local _instance = instance
		registeredInstance[_instance] = newUniqueId
		instance:SetAttribute("__UniqueInstanceId", tostring(newUniqueId))
		return setInstanceWithUniqueId(instance.Parent, uniqueIdPath)
	end
end
-- to replicate to a certian player
local serializeForReplication
local function replicateAllToPlayer(world, player)
	-- loops through each
	for componentName, component in pairs(componentsToReplicate) do
		-- for each entity with the component
		for serverEntity, data in world:query(component) do
			local route = routes[componentName]
			-- if not route then error that you are missing the route for component replication
			if not route then
				error(`Missing route for component replication: {componentName}`)
			else
				local targetReplication = world:get(serverEntity, TargetReplication)
				local _condition = targetReplication
				if _condition ~= 0 and _condition == _condition and _condition ~= "" and _condition then
					_condition = targetReplication[component]
					if _condition then
						local _exp = targetReplication[component]
						local _player = player
						_condition = not (table.find(_exp, _player) ~= nil)
					end
				end
				if _condition then
					continue
				end
				routes[componentName]:sendTo({
					serverEntity = serverEntity,
					data = serializeForReplication(data),
				}, player)
			end
		end
	end
end
--[[
	****************************************************************************************
	 * Helper: Recursively serialize any Instance references in `data` into
	 * `{ __ByteNetInstancePath: string }` tables, preserving all other values.
	 ****************************************************************************************
]]
function serializeForReplication(data)
	-- 1) If it's an Instance, replace with its FullName path
	local _data = data
	if typeof(_data) == "Instance" then
		return {
			__ByteNetInstancePath = setInstanceWithUniqueId(data),
		}
	end
	-- 2) If it's a table, recurse into each key/value
	local _data_1 = data
	if type(_data_1) == "table" then
		local out = {}
		for key, val in pairs(data) do
			-- preserve the key, serialize the value
			out[key] = serializeForReplication(val)
		end
		return out
	end
	-- 3) Primitives (number, string, etc.) pass through unchanged
	return data
end
--[[
	****************************************************************************************
	 * Damage Status Effects System Entry Point.
	 ****************************************************************************************
]]
local default = {
	phase = Phases.First,
	system = function(world)
		-- when ever getReplicatedComponents is called
		useRoute(routes.getReplicatedComponents, function(_, player)
			return replicateAllToPlayer(world, player)
		end)
		-- when ever player gets added
		useRoute(routes.jecsSetup, function(_, player)
			return replicateAllToPlayer(world, player)
		end)
		-- loops through each component that needs replication
		for componentName, component in pairs(componentsToReplicate) do
			-- for each entity whose component just changed
			for changeEntity, serverEntity, changed in world:query(TargetEntity, Changed(component)) do
				local route = routes[componentName]
				local targetReplication = world:get(serverEntity, TargetReplication)
				local _condition = targetReplication
				if _condition ~= 0 and _condition == _condition and _condition ~= "" and _condition then
					_condition = targetReplication[component]
				end
				local _condition_1 = _condition
				if not _condition_1 then
					_condition_1 = Players:GetPlayers()
				end
				local players = _condition_1
				-- if the component is not a table then replicate to all players
				if not route then
					error(`Missing route for component replication: {componentName}`)
				else
					if not world:contains(serverEntity) then
						routes.deleteReplicatedEntity:sendToAll(serverEntity)
					else
						-- Wrap in Promise.try for robust error handling
						TS.Promise.try(function()
							-- Use our serializer for ANY data shape
							local payload = serializeForReplication(changed.new)
							-- send the serialized payload to all target players
							-- printTS($line, `Replicating ${componentName} for entity ${serverEntity} to players: ${players.map((p) => p.Name).join(", ")}`)
							route:sendToList({
								serverEntity = serverEntity,
								data = changed.new,
							}, players)
							if componentName == "Villager" then
								-- print("Replicating", changeEntity)
							end
						end):catch(function(err)
							warnTS(143, `Replication error for {componentName} at line {143}: {tostring(err)}`)
						end)
					end
				end
			end
		end
	end,
}
return {
	setInstanceWithUniqueId = setInstanceWithUniqueId,
	default = default,
}
