-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local UserInputService = _services.UserInputService
local Workspace = _services.Workspace
local Tracer = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "tracer", "out").Tracer
local useChange = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useChange
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local getEntity = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").getEntity
local rayParamsInclude = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "rayFunctions").rayParamsInclude
local _stringHelp = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "stringHelp")
local formatToHHMMSS = _stringHelp.formatToHHMMSS
local formatToMMSS = _stringHelp.formatToMMSS
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Body = _jecsComponents.Body
local Data = _jecsComponents.Data
local HoverBoxAttachment = _jecsComponents.HoverBoxAttachment
local Villager = _jecsComponents.Villager
-- variables
local player = Players.LocalPlayer
local mouse = player:GetMouse()
local default = function(world)
	local camera = Workspace.Camera
	local clientEntity = getEntity.fromInstance(player)
	local _condition = clientEntity
	if _condition ~= 0 and _condition == _condition and _condition then
		_condition = world:get(clientEntity, Body)
	end
	local body = _condition
	local _condition_1 = clientEntity
	if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
		_condition_1 = world:get(clientEntity, Data)
	end
	local playerData = _condition_1
	local platform = body and body.platform
	local _result = platform
	if _result ~= nil then
		_result = _result:FindFirstChild("Villagers")
	end
	local villagers = _result
	local hoverAttachment = world:get(HoverBoxAttachment, HoverBoxAttachment)
	local target = platform and Tracer.ray(camera.CFrame.Position, if not UserInputService.MouseEnabled then camera.CFrame.LookVector else mouse.Hit.LookVector, 1000):useRaycastParams(rayParamsInclude({ platform.Villagers })):run()
	local _condition_2 = villagers
	if _condition_2 then
		local _result_1 = target
		if _result_1 ~= nil then
			_result_1 = _result_1.hit
			if _result_1 ~= nil then
				_result_1 = _result_1:IsDescendantOf(villagers)
			end
		end
		_condition_2 = _result_1
		if _condition_2 then
			_condition_2 = target.hit
		end
	end
	local villagerPartHovered = _condition_2
	local _condition_3 = villagerPartHovered
	if _condition_3 then
		local _result_1 = villagers
		if _result_1 ~= nil then
			local _exp = _result_1:GetChildren()
			-- ▼ ReadonlyArray.find ▼
			local _callback = function(child)
				return villagerPartHovered:IsDescendantOf(child)
			end
			local _result_2
			for _i, _v in _exp do
				if _callback(_v, _i - 1, _exp) == true then
					_result_2 = _v
					break
				end
			end
			-- ▲ ReadonlyArray.find ▲
			_result_1 = _result_2
		end
		_condition_3 = _result_1
	end
	local villagerModel = _condition_3
	local villagerEntity = villagerModel and getEntity.fromInstance(villagerModel)
	local _condition_4 = villagerEntity
	if _condition_4 ~= 0 and _condition_4 == _condition_4 and _condition_4 then
		_condition_4 = world:get(villagerEntity, Villager)
	end
	local villagerInfo = _condition_4
	local buildingTimes = villagerInfo and villagerInfo.villagerData.Progress.Building
	local timeTillFullyBuilt = buildingTimes and (buildingTimes.StartTime + buildingTimes.TotalTime) - os.time()
	local progressionInfo = villagerInfo and villagerInfo.villagerData.Progress
	local produce = progressionInfo and progressionInfo.Produce
	local produceStartTime = progressionInfo and progressionInfo.Progression.Time.StartTime
	local _condition_5 = progressionInfo
	if _condition_5 then
		local _result_1 = playerData
		if _result_1 ~= nil then
			_result_1 = _result_1.Tutorial
		end
		local _condition_6 = _result_1 == 2
		if _condition_6 then
			_condition_6 = villagerInfo.villagerData.Name == "Farmer"
		end
		_condition_5 = (if _condition_6 then 5 else progressionInfo.Progression.Time.RequiredTimePerResource)
	end
	local requiredProduceTime = _condition_5
	local _condition_6 = (progressionInfo and progressionInfo.Required and progressionInfo.Required.Amount)
	if not (_condition_6 ~= 0 and _condition_6 == _condition_6 and _condition_6) then
		_condition_6 = 0
	end
	local totalRequireResources = _condition_6
	local requiredProduceName = (progressionInfo and progressionInfo.Required and progressionInfo.Required.Produce) or ""
	local _condition_7 = produceStartTime
	if _condition_7 ~= 0 and _condition_7 == _condition_7 and _condition_7 then
		_condition_7 = requiredProduceTime
		if _condition_7 ~= 0 and _condition_7 == _condition_7 and _condition_7 then
			_condition_7 = produceStartTime + requiredProduceTime
		end
	end
	local produceEndTime = _condition_7
	local _condition_8 = progressionInfo
	if _condition_8 then
		_condition_8 = produceEndTime
		if _condition_8 ~= 0 and _condition_8 == _condition_8 and _condition_8 then
			_condition_8 = produceEndTime - os.time() > 0
		end
	end
	local timeTillNextProduce = if _condition_8 ~= 0 and _condition_8 == _condition_8 and _condition_8 then produceEndTime - os.time() else 0
	local resources = villagerInfo and villagerInfo.villagerData.Progress.Progression.Resources
	local totalProduce = resources and #resources
	local maxProduce = villagerModel and #villagerModel.Station.Parts.Resources:GetChildren()
	-- when the mouse moves
	local _result_1 = target
	if _result_1 ~= nil then
		_result_1 = _result_1.hit
	end
	local _condition_9 = _result_1
	if _condition_9 then
		_condition_9 = hoverAttachment.Position:Lerp(target.hit.Position, 0.2)
	end
	local _condition_10 = _condition_9
	if not _condition_10 then
		_condition_10 = hoverAttachment.Position
	end
	hoverAttachment.Position = _condition_10
	-- when ever platform updates then
	if useChange({ platform }) and platform then
		hoverAttachment.Position = platform.Floor.Position
	end
	-- when the mouse hovers over a villager and sets the time till built
	-- print(villagerEntity, timeTillFullyBuilt, timeTillNextProduce)
	-- if (useChange([villagerEntity, timeTillFullyBuilt, timeTillNextProduce])) {
	local _condition_11 = villagerEntity
	if _condition_11 ~= 0 and _condition_11 == _condition_11 and _condition_11 then
		_condition_11 = totalProduce == maxProduce
	end
	if _condition_11 then
		-- printTS($line, "Villager is fully built: ", villagerEntity, "Produce: ", produce, "Total Produce: ", totalProduce, "Max Produce: ", maxProduce);
		pageStates.hoverInfo({
			visible = true,
			info = `({totalProduce}/{maxProduce}) {produce} ready.`,
		})
	else
		local _condition_12 = timeTillFullyBuilt
		if _condition_12 ~= 0 and _condition_12 == _condition_12 and _condition_12 then
			_condition_12 = villagerEntity
			if _condition_12 ~= 0 and _condition_12 == _condition_12 and _condition_12 then
				_condition_12 = villagerInfo and timeTillFullyBuilt > 0
			end
		end
		if _condition_12 ~= 0 and _condition_12 == _condition_12 and _condition_12 then
			-- printTS($line, "Villager is building: ", villagerEntity, "Produce: ", produce, "Time Till Fully Built: ", timeTillFullyBuilt);
			pageStates.hoverInfo({
				visible = true,
				info = `Ready In {formatToHHMMSS(timeTillFullyBuilt)}.`,
			})
		else
			local _condition_13 = villagerEntity
			if _condition_13 ~= 0 and _condition_13 == _condition_13 and _condition_13 then
				_condition_13 = requiredProduceName
				if _condition_13 ~= "" and _condition_13 then
					_condition_13 = totalRequireResources <= 0
				end
			end
			if _condition_13 ~= "" and _condition_13 then
				-- printTS($line, "Villager is waiting for produce: ", villagerEntity, "Required Produce: ", requiredProduceName);
				pageStates.hoverInfo({
					visible = true,
					info = `Waiting on {requiredProduceName}`,
				})
			else
				local _condition_14 = villagerEntity
				if _condition_14 ~= 0 and _condition_14 == _condition_14 and _condition_14 then
					_condition_14 = timeTillNextProduce > 0
				end
				if _condition_14 then
					-- printTS($line, "Villager is producing: ", villagerEntity, "Produce: ", produce, "Time Till Next Produce: ", timeTillNextProduce);
					pageStates.hoverInfo({
						visible = true,
						info = `({totalProduce}/{maxProduce}) {produce} in {formatToMMSS(timeTillNextProduce)}.`,
					})
				elseif not (villagerEntity ~= 0 and villagerEntity == villagerEntity and villagerEntity) then
					-- print($line, "No villager hovered over1.", body, 3, platform?.Name, clientEntity, body, player.GetAttribute("ServerId"), playerData, villagers, villagerModel, target?.hit, villagerPartHovered, villagers && target?.hit?.IsDescendantOf(villagers));
					pageStates.hoverInfo({
						visible = false,
						info = "",
					})
				end
			end
		end
	end
	-- prints all villagers changed
	-- for (const [_, villagerEntity, change] of world.query(TargetEntity, Changed(Villager))) {
	--     // print(change)
	-- }
end
return {
	default = default,
}
