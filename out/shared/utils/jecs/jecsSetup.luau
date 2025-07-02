-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local RunService = _services.RunService
local CollectionService = _services.CollectionService
local Players = _services.Players
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local hotReloader = _jecsComponents.hotReloader
local ModelDebugger = _jecsComponents.ModelDebugger
local Phases = _jecsComponents.Phases
local systemQueue = _jecsComponents.systemQueue
local world = _jecsComponents.world
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local jabby = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jabby", "out")
local PlankJabbyPlugin = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "planck-jabby", "out")
local PlanckHooksPlugin = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").PlanckHooksPlugin
local getInstanceByName = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "instanceFunctions").getInstanceByName
-- tags
local matterTag = function(tag, world, callback)
	local allInstancesTagged = CollectionService:GetTagged(tag)
	-- calls initally on all tagged instances
	for _, instance in allInstancesTagged do
		callback(true, instance, world)
	end
	-- when a new instance is tagged
	CollectionService:GetInstanceRemovedSignal(tag):Connect(function(instance)
		return callback(false, instance, world)
	end)
	CollectionService:GetInstanceAddedSignal(tag):Connect(function(instance)
		return callback(true, instance, world)
	end)
end
-- "Players.GIS_jinga.PlayerScripts.TS.systems.camera.updateCamera"
-- "StarterPlayer.StarterPlayerScripts.TS.systems.camera.updateCamera"
local function transformPath(inputPath)
	local _condition = (string.find(inputPath, "PlayerScripts."))
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 0
	end
	local startIndexOfP1 = _condition + (#"PlayerScripts." - 1)
	local endIndexOfP1 = #inputPath
	local newString = string.sub(inputPath, startIndexOfP1, endIndexOfP1)
	return "StarterPlayer.StarterPlayerScripts" .. newString
end
-- loads in the client systems with hot reloading
local function hotReload(systems)
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(systemStruct)
		local systemMod = getInstanceByName((debug.info(systemStruct.system, "s")))
		-- if system mod descendant of players
		if systemMod then
			if systemMod:IsDescendantOf(Players) then
				local systemToRemove
				local scriptToWatch = getInstanceByName(transformPath((debug.info(systemStruct.system, "s"))))
				local oldSystem
				-- for reloading the system
				hotReloader:listen(scriptToWatch, function(newSystemMod)
					if not newSystemMod:IsA("ModuleScript") then
						return nil
					end
					local theSystem = (require(newSystemMod)).default
					local _result
					if not (type(theSystem) == "function") then
						_result = theSystem
					else
						local _object = table.clone(systemStruct)
						setmetatable(_object, nil)
						local _left = "phase"
						local _condition = systemStruct.phase
						if not (_condition ~= 0 and _condition == _condition and _condition ~= "" and _condition) then
							_condition = Phases.Update
						end
						_object[_left] = _condition
						_object.system = theSystem
						_result = _object
					end
					local toInput = _result
					-- adds the system
					systemQueue:addSystem(toInput)
					systemToRemove = toInput
					if oldSystem then
						routes.getReplicatedComponents.send()
					end
					-- systemQueue.addSystem(systemStruct.system, systemStruct.phase || Phase.Update)
				end, function(oldSystemMod)
					if not oldSystemMod:IsA("ModuleScript") then
						return nil
					end
					-- removes the system
					systemQueue:removeSystem(systemToRemove)
					oldSystem = oldSystemMod
				end)
			else
				local systemToRemove
				-- for reloading the system
				hotReloader:listen(systemMod, function(newSystemMod)
					if not newSystemMod:IsA("ModuleScript") then
						return nil
					end
					local theSystem = (require(newSystemMod)).default
					local _result
					if not (type(theSystem) == "function") then
						_result = theSystem
					else
						local _object = table.clone(systemStruct)
						setmetatable(_object, nil)
						local _left = "phase"
						local _condition = systemStruct.phase
						if not (_condition ~= 0 and _condition == _condition and _condition ~= "" and _condition) then
							_condition = Phases.Update
						end
						_object[_left] = _condition
						_object.system = theSystem
						_result = _object
					end
					local toInput = _result
					-- adds the system
					systemQueue:addSystem(toInput)
					systemToRemove = toInput
					-- systemQueue.addSystem(systemStruct.system, systemStruct.phase || Phase.Update)
				end, function(oldSystemMod)
					if not oldSystemMod:IsA("ModuleScript") then
						return nil
					end
					-- removes the system
					systemQueue:removeSystem(systemToRemove)
				end)
			end
		end
	end
	for _k, _v in systems do
		_callback(_v, _k - 1, systems)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
-- setup matter
local setupMatter = function(systems, tags)
	if systems == nil then
		systems = {}
	end
	if tags == nil then
		tags = {}
	end
	local startUpsOrdered = { Phases.PreStartup, Phases.Startup, Phases.PostStartup }
	if RunService:IsServer() then
		jabby.broadcast_server()
	end
	-- registers the world
	jabby.register({
		name = "World " .. (if RunService:IsClient() then "Client" else "Server"),
		applet = jabby.applets.world,
		configuration = {
			world = world,
			get_entity_from_part = function(part)
				for entity, model in world:query(ModelDebugger) do
					if part:IsDescendantOf(model) or part == model then
						return entity, (model:IsA("Model") and model.PrimaryPart) or part
					end
				end
				return nil, part
			end,
		},
	})
	-- Create
	jabby.set_check_function(function(player)
		if player:GetRankInGroup(36086761) >= 254 or player.UserId < 0 then
			return true
		else
			return false
		end
	end)
	-- sets up the tagging
	for key, value in pairs(tags) do
		matterTag(key, world, value)
	end
	-- steps it
	systemQueue:addPlugin(PlankJabbyPlugin.new()):addPlugin(PlanckHooksPlugin.new())
	-- loops through all the start up systems and creates a debugger for them
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(systemStruct)
		local systemMod = getInstanceByName((debug.info(systemStruct.system, "s")))
		-- if (systemMod) createDebugger(false, systemMod.Name)
	end
	for _k, _v in systems do
		_callback(_v, _k - 1, systems)
	end
	-- ▲ ReadonlyArray.forEach ▲
	-- adds the systems for initial start up
	-- ▼ ReadonlyArray.forEach ▼
	local _callback_1 = function(phase)
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_2 = function(system)
			if system.phase == phase then
				local _exp = system.system
				local _condition = system.phase
				if not (_condition ~= 0 and _condition == _condition and _condition ~= "" and _condition) then
					_condition = phase
				end
				systemQueue:addSystem(_exp, _condition)
				systemQueue:run(system.system)
			end
		end
		for _k, _v in systems do
			_callback_2(_v, _k - 1, systems)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	for _k, _v in startUpsOrdered do
		_callback_1(_v, _k - 1, startUpsOrdered)
	end
	-- ▲ ReadonlyArray.forEach ▲
	-- adds the rest of the systems
	hotReload(systems)
	if RunService:IsClient() then
		routes.jecsSetup.send()
	end
	-- return the debugger
	return debug
end
return {
	setupMatter = setupMatter,
}
