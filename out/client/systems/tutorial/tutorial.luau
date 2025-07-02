-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local Workspace = _services.Workspace
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local getEntity = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").getEntity
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Body = _jecsComponents.Body
local Data = _jecsComponents.Data
local Villager = _jecsComponents.Villager
local Changed = _jecsComponents.Changed
local ReplicatedComponent = _jecsComponents.ReplicatedComponent
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local player = Players.LocalPlayer
local trash = Janitor.new()
local arrow = trash:Add(paths.Assets.Tutorial.ArrowTutorial:Clone())
local lastStage
trash:LinkToInstance(script, true)
local function updateMessage(stage, force)
	if force == nil then
		force = false
	end
	if pageStates.introText().text == "" or force then
		if stage == 0 then
			pageStates.introText({
				text = "Welcome to Grow a Village! Let’s get started by visiting the King and buying a Farmer.",
				duration = 10000000,
			})
		elseif stage == 1 then
			pageStates.introText({
				text = "Great! Return to your plot and place your new Farmer.",
				duration = 10000000,
			})
		elseif stage == 2 then
			pageStates.introText({
				text = "Wait for the Farmer to produce Wheat, then collect it.",
				duration = 10000000,
			})
		elseif stage == 3 then
			pageStates.introText({
				text = "Head over to the Merchant to sell the Wheat.",
				duration = 10000000,
			})
		end
	end
end
local default = function(world)
	local bodyEntity = getEntity.fromInstance(player)
	local serverEntity = player:GetAttribute("ServerId")
	if not (bodyEntity ~= 0 and bodyEntity == bodyEntity and bodyEntity) or not (serverEntity ~= 0 and serverEntity == serverEntity and serverEntity) then
		return nil
	end
	local body = world:get(bodyEntity, Body)
	local data = world:get(bodyEntity, Data)
	if not body or not data then
		return nil
	end
	local computeTarget = function()
		if data.Tutorial == 0 then
			return paths.Map.Shops.King.Npc.HumanoidRootPart
		end
		if data.Tutorial == 1 then
			local _result = body.platform
			if _result ~= nil then
				_result = _result.Floor
			end
			return _result
		end
		if data.Tutorial == 2 then
			for _, __, villagerInfo in world:query(ReplicatedComponent, Villager) do
				if villagerInfo.playerEntity == serverEntity and villagerInfo.villagerData.Name == "Farmer" then
					return villagerInfo.villagerModel.PrimaryPart or villagerInfo.villagerModel
				end
			end
		end
		if data.Tutorial == 3 then
			return paths.Map.Shops.Merchant.Npc.HumanoidRootPart
		end
		return nil
	end
	local target = computeTarget()
	updateMessage(data.Tutorial)
	-- when data changes
	for _, changed in world:query(Changed(Data)) do
		local newData = changed.new
		local oldData = changed.old
		-- if the tutorial stage has changed
		local _result = newData
		if _result ~= nil then
			_result = _result.Tutorial
		end
		local _result_1 = oldData
		if _result_1 ~= nil then
			_result_1 = _result_1.Tutorial
		end
		if _result ~= _result_1 then
			local _result_2 = newData
			if _result_2 ~= nil then
				_result_2 = _result_2.Tutorial
			end
			local _condition = _result_2
			if not (_condition ~= 0 and _condition == _condition and _condition) then
				_condition = 0
			end
			local currentStage = _condition
			-- if stage was 3 then changed to done then
			if currentStage == "Done" then
				local _result_3 = oldData
				if _result_3 ~= nil then
					_result_3 = _result_3.Tutorial
				end
				if _result_3 == 3 then
					pageStates.introText({
						text = "Well done! +50 Coins.",
						duration = 5,
					})
				else
					pageStates.introText({
						text = "",
						duration = 5,
					})
				end
				arrow.Parent = ReplicatedStorage
				return nil
			else
				updateMessage(currentStage, true)
			end
		end
	end
	if target then
		local targetCFrame = target:GetPivot()
		arrow.Attachment0.Position = body.rootPart.Position
		arrow.Attachment1.Position = targetCFrame.Position
		arrow.Parent = Workspace
	else
		arrow.Parent = ReplicatedStorage
	end
end
return {
	default = default,
}
