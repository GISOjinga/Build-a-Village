-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecs = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "jecs")
local Name = _jecs.Name
local pair = _jecs.pair
local components = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local AlignPosition = _jecsComponents.AlignPosition
local CountDown = _jecsComponents.CountDown
local DestroyAfterCounting = _jecsComponents.DestroyAfterCounting
local Float = _jecsComponents.Float
local MoveTo = _jecsComponents.MoveTo
local world = _jecsComponents.world
local ZeroOutVelocity = _jecsComponents.ZeroOutVelocity
local _object_utils = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils")
local Object = _object_utils
local deepCopy = _object_utils.deepCopy
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local RunService = _services.RunService
local PlayerStateComponent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents").PlayerState
local getInstanceByName = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "instanceFunctions").getInstanceByName
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local villagersProgressData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "villagersProgressData").default
local MappedComponents = components
local _exp = Object.entries(MappedComponents)
-- ▼ ReadonlyArray.map ▼
local _newValue = table.create(#_exp)
local _callback = function(_param)
	local k = _param[1]
	local v = _param[2]
	return { v, k }
end
for _k, _v in _exp do
	_newValue[_k] = _callback(_v, _k - 1, _exp)
end
-- ▲ ReadonlyArray.map ▲
-- ▼ ReadonlyArray.reduce ▼
local _result = {}
local _callback_1 = function(acc, _param)
	local k = _param[1]
	local v = _param[2]
	acc[k] = v
	return acc
end
for _i = 1, #_newValue do
	_result = _callback_1(_result, _newValue[_i], _i - 1, _newValue)
end
-- ▲ ReadonlyArray.reduce ▲
local MappedComponentsSwitched = _result
local checkEntity = {
	hasCountDown = function(entityLink, component)
		return (world:query(CountDown, pair(entityLink, component)):iter()())
	end,
}
-- for getting
local getEntity
getEntity = {
	replicatedFromServerEntity = function(serverEntity)
		for replicatedEntity, serverEntity2 in world:query(components.ReplicatedComponent) do
			if serverEntity2 == serverEntity then
				return replicatedEntity
			end
		end
	end,
	bodyFromPlayer = function(player)
		local entity = getEntity.fromInstance(player)
		local _condition = entity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(entity, components.Body)
		end
		local body = _condition
		return body
	end,
	countDownRelationship = function(component)
		return pair(component, components.CountDown)
	end,
	fromInstance = function(instance)
		local entity = instance:GetAttribute(if RunService:IsClient() then "ClientId" else "ServerId")
		-- if entity exists then return it
		return if entity ~= nil and world:contains(entity) then entity else nil
	end,
}
-- for setting
local setEntity = {
	countDown = function(entityLink, component, duration)
		for countDownEntity, countDownInfo in world:query(CountDown, pair(entityLink, component)) do
			world:set(countDownEntity, CountDown, duration)
		end
	end,
	addTargetForReplication = function(targetEntity, player, component)
		local _condition = world:get(targetEntity, components.TargetReplication)
		if not (_condition ~= 0 and _condition == _condition and _condition ~= "" and _condition) then
			_condition = {
				[component] = {},
			}
		end
		local targetReplication = _condition
		local oldTargets = targetReplication[component] or {}
		-- adds the targets to the table
		local _player = player
		if typeof(_player) == "Instance" then
			local _player_1 = player
			table.insert(oldTargets, _player_1)
		else
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_2 = function(player)
				local _player_1 = player
				table.insert(oldTargets, _player_1)
				return #oldTargets
			end
			for _k, _v in player do
				_callback_2(_v, _k - 1, player)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
		-- remove any duplicates
		-- ▼ ReadonlyArray.filter ▼
		local _newValue_1 = {}
		local _callback_2 = function(v, i, a)
			local _a = a
			local _v = v
			return (table.find(_a, _v) or 0) - 1 == i
		end
		local _length = 0
		for _k, _v in oldTargets do
			if _callback_2(_v, _k - 1, oldTargets) == true then
				_length += 1
				_newValue_1[_length] = _v
			end
		end
		-- ▲ ReadonlyArray.filter ▲
		-- sets tje targets in thje target replication
		local _exp_1 = targetEntity
		local _exp_2 = components.TargetReplication
		local _object = table.clone(targetReplication)
		setmetatable(_object, nil)
		_object[component] = oldTargets
		world:set(_exp_1, _exp_2, _object)
	end,
	alignPositionVelocity = function(alignPositionVelocity, velocity)
		local alignPositionComponent = world:get(alignPositionVelocity, AlignPosition)
		-- sets it
		if alignPositionComponent then
			local _exp_1 = alignPositionVelocity
			local _object = table.clone(alignPositionComponent)
			setmetatable(_object, nil)
			_object.velocity = velocity
			world:set(_exp_1, AlignPosition, _object)
		end
	end,
}
local function getUntakenNumber(villagersData)
	local number = 0
	-- loop through the villagers progress and find the first number that is not taken
	while true do
		-- ▼ ReadonlyArray.find ▼
		local _callback_2 = function(v)
			return v.UniqueId == number
		end
		local _result_1
		for _i, _v in villagersData do
			if _callback_2(_v, _i - 1, villagersData) == true then
				_result_1 = _v
				break
			end
		end
		-- ▲ ReadonlyArray.find ▲
		if not _result_1 then
			break
		else
			number += 1
		end
	end
	return number
end
local addComponent, createEntity
createEntity = {
	confirmationPrompt = function(playerEntity, title, message, onConfirm, onDecline)
		local player = world:get(playerEntity, components.Player)
		-- sets the confirmation prompt
		if player then
			setEntity.addTargetForReplication(playerEntity, player, components.ConfirmationPrompt)
			addComponent(playerEntity, components.ConfirmationPrompt, {
				title = title,
				message = message,
				onConfirm = onConfirm,
				onDecline = onDecline,
			})
		end
	end,
	villagerNpc = function(playerEntity, villagerData, platform, platformEntity)
		local player = world:get(playerEntity, components.Player)
		local name = villagerData.Name
		local villagerModel = paths.Assets.Villagers[name]:Clone()
		local villagerEntity = world:entity()
		local animateScript = villagerModel.Npc:FindFirstChild("Animate")
		-- sets the vilalgers unique id
		if animateScript then
			animateScript.Enabled = false
		end
		villagerModel:SetAttribute("UniqueId", villagerData.UniqueId)
		local _cFrame = platform.Floor.CFrame
		local _arg0 = villagerData.RelativeLocation or CFrame.new(0, 0, 0)
		villagerModel:PivotTo(_cFrame * _arg0)
		villagerModel.Parent = platform.Villagers
		-- sets the villager
		addComponent(villagerEntity, pair(components.TargetEntity, components.Platform), platformEntity)
		addComponent(villagerEntity, components.ModelDebugger, villagerModel)
		addComponent(villagerEntity, components.Villager, {
			villagerModel = villagerModel,
			villagerData = villagerData,
			playerEntity = playerEntity,
		})
		-- if player then adds it to target for replication 
		-- if (player) setEntity.addTargetForReplication(villagerEntity, player, components.Villager)
		-- returns it
		return villagerEntity
	end,
	inventoryVillager = function(bodyEntity, villagerName)
		createEntity.updateData(bodyEntity, function(oldData)
			-- if the villager already exists then return
			local _villagers = oldData.Villagers
			local _object = {
				Name = villagerName,
				RelativeLocation = nil,
				UniqueId = getUntakenNumber(oldData.Villagers),
			}
			local _left = "Progress"
			local _villagerName = villagerName
			_object[_left] = deepCopy(villagersProgressData[_villagerName])
			table.insert(_villagers, _object)
			-- returns the updated data
			return oldData
		end)
	end,
	insertProduce = function(bodyEntity, produceName, variant, amount)
		if amount == nil then
			amount = 1
		end
		createEntity.updateData(bodyEntity, function(oldData)
			-- goes through each amount and adds them up
			local _exp_1 = oldData.Produce
			-- ▼ ReadonlyArray.findIndex ▼
			local _callback_2 = function(p)
				return p.Name == produceName and p.Variant == variant
			end
			local _result_1 = -1
			for _i, _v in _exp_1 do
				if _callback_2(_v, _i - 1, _exp_1) == true then
					_result_1 = _i - 1
					break
				end
			end
			-- ▲ ReadonlyArray.findIndex ▲
			local produceIndex = _result_1
			-- sets the new amount
			if produceIndex > -1 then
				local _object = {
					Name = produceName,
				}
				local _left = "Amount"
				local _result_2 = oldData.Produce[produceIndex + 1]
				if _result_2 ~= nil then
					_result_2 = _result_2.Amount
				end
				local _condition = _result_2
				if not (_condition ~= 0 and _condition == _condition and _condition) then
					_condition = 0
				end
				_object[_left] = _condition + amount
				_object.Variant = variant
				oldData.Produce[produceIndex + 1] = _object
			else
				-- for the total amount
				local _produce = oldData.Produce
				local _arg0 = {
					Name = produceName,
					Amount = amount,
					Variant = variant,
				}
				table.insert(_produce, _arg0)
			end
			-- returns the updated data
			return oldData
		end)
	end,
	updateData = function(bodyEntity, updateFunction)
		local updateEntity = world:entity()
		-- sets the update data
		world:set(updateEntity, components.UpdateData, {
			updateFunction = updateFunction,
			bodyEntity = bodyEntity,
		})
		-- returns it
		return updateEntity
	end,
	countDown = function(entityLink, component, duration)
		local _condition = checkEntity.hasCountDown(entityLink, component)
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = world:entity()
		end
		local countDownEntity = _condition
		local countDownRelationship = getEntity.countDownRelationship(component)
		-- sets the countDown
		world:set(countDownEntity, pair(entityLink, component), true)
		world:set(countDownEntity, components.CountDown, duration)
		world:set(entityLink, getEntity.countDownRelationship(component), component)
		world:set(countDownEntity, components.DestroyAfterCounting, function()
			local _value = checkEntity.hasCountDown(entityLink, component)
			if not (_value ~= 0 and _value == _value and _value) then
				world:remove(entityLink, countDownRelationship)
			end
		end)
		-- returns it
		return countDownEntity
	end,
	replicated = function(serverEntity)
		local replicatedEntity = world:entity()
		-- adds relationship
		world:set(replicatedEntity, components.ReplicatedComponent, serverEntity)
		-- returns it
		return replicatedEntity
	end,
	zeroOutVelocity = function(basePart, duration)
		if duration == nil then
			duration = 1
		end
		local zeroOutVelocityEntity = world:entity()
		-- adds relationship
		world:set(zeroOutVelocityEntity, ZeroOutVelocity, basePart)
		world:set(zeroOutVelocityEntity, CountDown, duration)
		world:set(zeroOutVelocityEntity, DestroyAfterCounting, true)
		-- returns it
		return zeroOutVelocityEntity
	end,
	alignAttachments = function(attachment0, attachment1, velocity)
		local alignPositionEntity = world:entity()
		local alignPosition = Instance.new("AlignPosition", attachment0)
		-- adds relationship
		world:set(alignPositionEntity, AlignPosition, {
			alignPosition = alignPosition,
			attachment0 = attachment0,
			attachment1 = attachment1,
			velocity = velocity,
		})
		-- returns it
		return alignPositionEntity
	end,
	Float = function(bodyEntity, rootpart, duration)
		local floatEntity = world:entity()
		-- spawns float
		world:set(floatEntity, Float, ({
			linearVelocity = Instance.new("LinearVelocity"),
			bodyEntity = bodyEntity,
			duration = duration,
		}))
		-- returns it
		return floatEntity
	end,
	velocity = function(attachment, duration, direction, decelerationRate)
		local velocityEntity = world:entity()
		-- spawns velocity
		world:set(velocityEntity, MoveTo, ({
			destroyEntityOnComplete = true,
			linearVelocity = Instance.new("LinearVelocity", attachment),
			duration = duration,
			attachment = attachment,
			direction = direction,
			decelerationRate = decelerationRate,
		}))
		-- returns it
		return velocityEntity
	end,
	velocityToPart = function(basePart, data)
		local velocityEntity = world:entity()
		local attachment = Instance.new("Attachment")
		-- sets up attachment
		attachment.Name = "VelocityAttachment"
		attachment.Parent = basePart
		-- spawns velocity
		world:set(velocityEntity, MoveTo, ({
			destroyEntityOnComplete = true,
			forceLimitMode = if data.axesForce ~= nil then Enum.ForceLimitMode.PerAxis else Enum.ForceLimitMode.Magnitude,
			maxAxesForce = if data.axesForce ~= nil then data.axesForce else Vector3.one * 1e6,
			maxForce = if data.magnitudeForce ~= nil then data.magnitudeForce else 1e6,
			relativeTo = if data.relative then Enum.ActuatorRelativeTo.Attachment0 else Enum.ActuatorRelativeTo.World,
			linearVelocity = Instance.new("LinearVelocity", attachment),
			duration = data.duration,
			direction = data.direction,
			decelerationRate = data.decelerationRate,
			attachment = attachment,
			onDestroyedCallback = function()
				local _result_1 = data.onDestroyedCallback
				if _result_1 ~= nil then
					_result_1()
				end
				attachment:Destroy()
			end,
		}))
		-- returns it
		return velocityEntity
	end,
}
--[[
	*
	 * Retrieves the source file of the caller function by analyzing the stack trace.
	 * @returns {string} The source file path of the caller function, or 'unknown' if not found.
	 
]]
local getCallerSourceFromTraceback = function()
	local traceback = debug.traceback()
	local lines = {}
	local _iterFunc = string.gmatch(traceback, "[^\n]+")
	while true do
		local line = { _iterFunc() }
		if #line == 0 then
			break
		end
		local _arg0 = line[1]
		table.insert(lines, _arg0)
	end
	-- The third line typically contains the caller information
	local _condition = lines[3]
	if not (_condition ~= "" and _condition) then
		_condition = ""
	end
	local callerLine = _condition
	local source = string.match(callerLine, "([^:]+):")
	local _condition_1 = source
	if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 ~= "" and _condition_1 then
		_condition_1 = (if RunService:IsRunning() then source else (string.match(source, '%[string%s+"(.-)"%]')))
	end
	local _condition_2 = _condition_1
	if not (_condition_2 ~= "" and _condition_2) then
		_condition_2 = "unknown"
	end
	return _condition_2
end
-- registered print debug
local jecsPrintRecord = {}
local jecsWarnRecord = {}
local debugRegistry = {}
local createDebugger = function(line, _systemName)
	local scriptPath = getCallerSourceFromTraceback()
	local _condition = scriptPath
	if _condition ~= "" and _condition then
		_condition = getInstanceByName(scriptPath)
	end
	local sourceScript = _condition
	local _condition_1 = _systemName
	if not (_condition_1 ~= "" and _condition_1) then
		local _condition_2 = sourceScript
		if _condition_2 ~= "" and _condition_2 then
			_condition_2 = sourceScript.Name
		end
		_condition_1 = _condition_2
		if not (_condition_1 ~= "" and _condition_1) then
			_condition_1 = "UnknownSystem"
		end
	end
	local systemName = _condition_1
	local debugEntity = debugRegistry[systemName]
	local _condition_2 = debugEntity
	if _condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2 then
		_condition_2 = world:get(debugEntity, components.Debug)
	end
	local debugInfo = _condition_2
	local systemLineName = systemName .. ":" .. tostring(line)
	local jecsPrintMaping = jecsPrintRecord[systemLineName] or {}
	local jecsWarnMaping = jecsWarnRecord[systemLineName] or {}
	local debugName = "TS Line: " .. tostring(line)
	-- if the debug entity already exists, return the current state
	if not (debugRegistry[systemName] ~= nil) then
		local debugEntity = world:entity()
		world:set(debugEntity, components.Debug, {
			name = systemName,
			linesToDebug = {},
		})
		world:set(debugEntity, Name, systemName)
		debugRegistry[systemName] = debugEntity
	else
		local _condition_3 = debugEntity
		if _condition_3 ~= 0 and _condition_3 == _condition_3 and _condition_3 then
			_condition_3 = debugInfo
		end
		if _condition_3 then
			local _exp_1 = components.Debug
			local _object = table.clone(debugInfo)
			setmetatable(_object, nil)
			local _left = "linesToDebug"
			local _object_1 = table.clone(debugInfo.linesToDebug)
			setmetatable(_object_1, nil)
			_object_1[debugName] = debugInfo.linesToDebug[debugName] or false
			_object[_left] = _object_1
			world:set(debugEntity, _exp_1, _object)
		end
	end
	-- for warns++
	local _result_1 = debugInfo
	if _result_1 ~= nil then
		_result_1 = _result_1.linesToDebug[debugName]
	end
	local _condition_3 = _result_1 == true
	if _condition_3 then
		_condition_3 = #jecsWarnMaping > 0
	end
	if _condition_3 then
		-- if jecsMaping is greater than 0 then print 
		warn(`Previous Jecs Warnings ({#jecsWarnMaping}) On {systemName}:`)
		for index, previousCall in pairs(jecsWarnMaping) do
			local _array = {}
			local _length = #_array
			local _previousCallLength = #previousCall
			table.move(previousCall, 1, _previousCallLength, _length + 1, _array)
			_length += _previousCallLength
			_array[_length + 1] = ` (Previous Call #{index})`
			warn(unpack(_array))
		end
		-- clears the record
		jecsWarnRecord[systemLineName] = {}
	end
	-- for prints
	local _result_2 = debugInfo
	if _result_2 ~= nil then
		_result_2 = _result_2.linesToDebug[debugName]
	end
	local _condition_4 = _result_2 == true
	if _condition_4 then
		_condition_4 = #jecsPrintMaping > 0
	end
	if _condition_4 then
		-- if jecsMaping is greater than 0 then print 
		print(`Previous Jecs Calls ({#jecsPrintMaping}) On {systemName}:`)
		for index, previousCall in pairs(jecsPrintMaping) do
			local _array = {}
			local _length = #_array
			local _previousCallLength = #previousCall
			table.move(previousCall, 1, _previousCallLength, _length + 1, _array)
			_length += _previousCallLength
			_array[_length + 1] = ` (Previous Call #{index})`
			print(unpack(_array))
		end
		-- clears the record
		jecsPrintRecord[systemLineName] = {}
	end
	-- returns the current state of the print debug for the system
	local _result_3 = debugInfo
	if _result_3 ~= nil then
		_result_3 = _result_3.linesToDebug[debugName]
	end
	local _condition_5 = _result_3
	if not _condition_5 then
		_condition_5 = false
	end
	return _condition_5
end
-- for warnings
local warnJecs = function(line, ...)
	local message = { ... }
	local _array = {}
	local _length = #_array
	table.move(message, 1, #message, _length + 1, _array)
	local fullName = _array
	local scriptPath = getCallerSourceFromTraceback()
	local _condition = scriptPath
	if _condition ~= "" and _condition then
		_condition = getInstanceByName(scriptPath)
	end
	local sourceScript = _condition
	local _condition_1 = sourceScript
	if _condition_1 ~= "" and _condition_1 then
		_condition_1 = sourceScript.Name
	end
	local _condition_2 = _condition_1
	if not (_condition_2 ~= "" and _condition_2) then
		_condition_2 = "UnknownSystem"
	end
	local realSystemName = _condition_2
	local systemLineName = realSystemName .. ":" .. tostring(line)
	local _condition_3 = sourceScript
	if _condition_3 ~= "" and _condition_3 then
		_condition_3 = createDebugger(line, realSystemName)
	end
	local debugEnabled = _condition_3
	local _condition_4 = sourceScript
	if _condition_4 ~= "" and _condition_4 then
		_condition_4 = `   -   TypeScript(Jecs) {realSystemName}:{line}`
	end
	local firstMessage = _condition_4
	local jecsWarnMaping = jecsWarnRecord[systemLineName] or {}
	-- if debug is disabled then return
	if not (sourceScript ~= "" and sourceScript) then
		warn(`Script not found for line {line}: {scriptPath}`)
		return nil
	elseif debugEnabled == false then
		-- sets it
		local _array_1 = {}
		local _length_1 = #_array_1
		local _messageLength = #message
		table.move(message, 1, _messageLength, _length_1 + 1, _array_1)
		_length_1 += _messageLength
		_array_1[_length_1 + 1] = firstMessage
		table.insert(jecsWarnMaping, 1, _array_1)
		if #jecsWarnMaping > 200 then
			for i = 199, #jecsWarnMaping - 2 do
				jecsWarnMaping[#jecsWarnMaping] = nil
			end
		end
		jecsWarnRecord[systemLineName] = jecsWarnMaping
		return nil
	end
	-- prints the message
	table.insert(fullName, firstMessage)
	warn(unpack(fullName))
end
-- for printing
local printJecs = function(line, ...)
	local message = { ... }
	local _array = {}
	local _length = #_array
	table.move(message, 1, #message, _length + 1, _array)
	local fullName = _array
	local scriptPath = getCallerSourceFromTraceback()
	local _condition = scriptPath
	if _condition ~= "" and _condition then
		_condition = getInstanceByName(scriptPath)
	end
	local sourceScript = _condition
	local _condition_1 = sourceScript
	if _condition_1 ~= "" and _condition_1 then
		_condition_1 = sourceScript.Name
	end
	local _condition_2 = _condition_1
	if not (_condition_2 ~= "" and _condition_2) then
		_condition_2 = "UnknownSystem"
	end
	local realSystemName = _condition_2
	local systemLineName = realSystemName .. ":" .. tostring(line)
	local _condition_3 = sourceScript
	if _condition_3 ~= "" and _condition_3 then
		_condition_3 = createDebugger(line, realSystemName)
	end
	local debugEnabled = _condition_3
	local _condition_4 = sourceScript
	if _condition_4 ~= "" and _condition_4 then
		_condition_4 = `   -   TypeScript(Jecs) {realSystemName}:{line}`
	end
	local firstMessage = _condition_4
	local jecsMaping = jecsPrintRecord[systemLineName] or {}
	-- if debug is disabled then return
	if not (sourceScript ~= "" and sourceScript) then
		warn(`Script not found for line {line}: {scriptPath}`)
		return nil
	elseif debugEnabled == false then
		-- sets it
		local _array_1 = {}
		local _length_1 = #_array_1
		local _messageLength = #message
		table.move(message, 1, _messageLength, _length_1 + 1, _array_1)
		_length_1 += _messageLength
		_array_1[_length_1 + 1] = firstMessage
		table.insert(jecsMaping, 1, _array_1)
		if #jecsMaping > 200 then
			for i = 199, #jecsMaping - 2 do
				jecsMaping[#jecsMaping] = nil
			end
		end
		jecsPrintRecord[systemLineName] = jecsMaping
		return nil
	end
	-- prints the message
	table.insert(fullName, firstMessage)
	print(unpack(fullName))
end
-- prints the message
local printTS = function(line, ...)
	local message = { ... }
	local _array = {}
	local _length = #_array
	table.move(message, 1, #message, _length + 1, _array)
	local fullName = _array
	local scriptPath = getCallerSourceFromTraceback()
	local _condition = scriptPath
	if _condition ~= "" and _condition then
		_condition = getInstanceByName(scriptPath)
	end
	local sourceScript = _condition
	-- if debug is disabled then return
	if not (sourceScript ~= "" and sourceScript) then
		warn(`Script not found for line {line}: {scriptPath}`)
		return nil
	end
	-- prints the message
	local _arg0 = `   -   TypeScript(File) {sourceScript.Name}:{line}`
	table.insert(fullName, _arg0)
	print(unpack(fullName))
end
-- prints the message
local warnTS = function(line, ...)
	local message = { ... }
	local _array = {}
	local _length = #_array
	table.move(message, 1, #message, _length + 1, _array)
	local fullName = _array
	local scriptPath = getCallerSourceFromTraceback()
	local _condition = scriptPath
	if _condition ~= "" and _condition then
		_condition = getInstanceByName(scriptPath)
	end
	local sourceScript = _condition
	-- if debug is disabled then return
	if not (sourceScript ~= "" and sourceScript) then
		warn(`Script not found for line {line}: {scriptPath}`)
		return nil
	end
	-- prints the message
	local _arg0 = `   -   TypeScript(File) {sourceScript.Name}:{line}`
	table.insert(fullName, _arg0)
	warn(unpack(fullName))
end
-- Fetch local player context
local function getLocalPlayerContext(player)
	local character = player
	if not character then
		return nil
	end
	local entity = getEntity.fromInstance(Players.LocalPlayer)
	if not (entity ~= 0 and entity == entity and entity) then
		return nil
	end
	local body = world:get(entity, components.Body)
	if not body then
		return nil
	end
	local _binding = body
	local model = _binding.model
	local rootPart = _binding.rootPart
	local humanoid = _binding.humanoid
	local rootAttachment = _binding.rootAttachment
	local animator = _binding.animator
	if not humanoid or not rootPart or not rootAttachment or not animator then
		return nil
	end
	return {
		character = model,
		humanoid = humanoid,
		rootPart = rootPart,
		attachment = rootAttachment,
		entity = entity,
		animator = animator,
	}
end
-- default props
local jecsDefaultProps = {}
-- type Switched = ReturnType<<componentName extends AllComponentNames>()=>({[k in MappedComponents[componentName]]:componentName})>;
-- 1) Two-arg only for defaulted components
-- 2) Three-arg only for non-defaulted components
-- 3) Three-arg override for defaulted components
-- implementation
function addComponent(entity, component, value)
	-- Determine the component data to use
	local defaultTable = jecsDefaultProps[MappedComponentsSwitched[component]]
	local clonedTable = type(defaultTable) == "table" and deepCopy(defaultTable)
	local _result_1
	if value ~= nil then
		_result_1 = value
	else
		local _condition = clonedTable
		if not (_condition ~= 0 and _condition == _condition and _condition ~= "" and _condition) then
			_condition = (jecsDefaultProps[MappedComponentsSwitched[component]])
		end
		_result_1 = _condition
	end
	local componentInfo = _result_1
	-- Add the component to the entity
	world:set(entity, component, componentInfo)
end
-- removes component
local function removeComponent(entity, ...)
	local components = { ... }
	local _array = {}
	local _length = #_array
	table.move(components, 1, #components, _length + 1, _array)
	-- ▼ ReadonlyArray.forEach ▼
	local _callback_2 = function(component)
		return world:remove(entity, component)
	end
	for _k, _v in _array do
		_callback_2(_v, _k - 1, _array)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
-- Player state helper functions
local function setPlayerState(world, entity, category, key, active)
	local state = world:get(entity, PlayerStateComponent)
	if not state then
		return nil
	end
	local _arg0 = state[category]
	if type(_arg0) == "table" then
		local cat = state[category]
		if cat and cat[key] then
			cat[key].active = active
			cat[key].lastUpdated = os.clock()
			world:set(entity, PlayerStateComponent, state)
		end
	else
		warn(`Category '{category}' does not exist on PlayerState.`)
	end
end
local function getPlayerState(world, entity, category, key)
	local state = world:get(entity, PlayerStateComponent)
	if not state then
		print("No state, no bitches")
		return nil
	end
	local _arg0 = state[category]
	if type(_arg0) == "table" then
		local cat = state[category]
		if not cat then
			print("No category, no bitches")
			return nil
		end
		if cat[key] then
			return cat[key].active
		end
	else
		warn(`Category '{category}' does not exist on PlayerState.`)
		return nil
	end
end
local function getMostRecentActiveState(world, entity, category)
	local state = world:get(entity, PlayerStateComponent)
	if not state then
		return nil
	end
	local cat = state[category]
	if not cat then
		return nil
	end
	local mostRecentKey
	local mostRecentTime = -math.huge
	for key, data in pairs(cat) do
		if data.active and data.lastUpdated > mostRecentTime then
			mostRecentKey = key
			mostRecentTime = data.lastUpdated
		end
	end
	return mostRecentKey
end
return {
	getLocalPlayerContext = getLocalPlayerContext,
	addComponent = addComponent,
	removeComponent = removeComponent,
	setPlayerState = setPlayerState,
	getPlayerState = getPlayerState,
	getMostRecentActiveState = getMostRecentActiveState,
	MappedComponents = MappedComponents,
	MappedComponentsSwitched = MappedComponentsSwitched,
	checkEntity = checkEntity,
	getEntity = getEntity,
	setEntity = setEntity,
	createEntity = createEntity,
	createDebugger = createDebugger,
	warnJecs = warnJecs,
	printJecs = printJecs,
	printTS = printTS,
	warnTS = warnTS,
	jecsDefaultProps = jecsDefaultProps,
}
