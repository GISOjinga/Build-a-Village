-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local pair = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "jecs").pair
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local getCharacterParts = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "characterFunctions").getCharacterParts
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local getEntity = _jecsHelpFunctions.getEntity
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local Body = _jecsComponents.Body
local Changed = _jecsComponents.Changed
local NoBodyCollisions = _jecsComponents.NoBodyCollisions
local ModelDebugger = _jecsComponents.ModelDebugger
local Player = _jecsComponents.Player
local TargetEntity = _jecsComponents.TargetEntity
local Removed = _jecsComponents.Removed
local Platform = _jecsComponents.Platform
local Data = _jecsComponents.Data
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local _analytics = TS.import(script, game:GetService("ServerScriptService"), "TS", "utils", "analytics")
local logTutorialStep = _analytics.logTutorialStep
local TutorialStep = _analytics.TutorialStep
-- players and their shop page states
local playersShopPageStates = {}
-- For all non-player characters, give them a body.
local default = function(world)
	local playerModels = paths.Characters.Players:GetChildren()
	-- Listen for players.
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(model)
		local player = Players:GetPlayerFromCharacter(model)
		-- If the character is not already a player and has no ServerId attribute, give it a body.
		local _condition = player
		if _condition then
			local _value = model:GetAttribute("ServerId")
			_condition = not (_value ~= 0 and _value == _value and _value ~= "" and _value)
		end
		if _condition then
			local humanoid, rootPart, head, animator, rootAttachment = getCharacterParts(model)
			-- Give the character a body if all required parts exist.
			if model and humanoid and rootPart and animator and rootAttachment and head then
				local _condition_1 = player:GetAttribute("ServerId")
				if not (_condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1) then
					_condition_1 = world:entity()
				end
				local entity = _condition_1
				addComponent(entity, Player, player)
				world:set(entity, Body, {
					head = head,
					model = model,
					humanoid = humanoid,
					rootPart = rootPart,
					animator = animator,
					rootAttachment = rootAttachment,
					platform = nil,
				})
				world:set(entity, ModelDebugger, model)
				-- Set the ServerId attribute on both player and model.
				player:SetAttribute("ServerId", entity)
				model:SetAttribute("ServerId", entity)
			end
		end
	end
	for _k, _v in playerModels do
		_callback(_v, _k - 1, playerModels)
	end
	-- ▲ ReadonlyArray.forEach ▲
	-- Listen for changes in Body components and handle death/despawn.
	for _, entity, _binding in world:query(TargetEntity, Added(Body)) do
		local model = _binding.model
		local humanoid = _binding.humanoid
		local newModel = model
		local player = world:get(entity, Player)
		-- sets the player page state
		if player then
			playersShopPageStates[player] = "None"
		end
		-- set up
		humanoid.MaxSlopeAngle = 45
		-- When the humanoid dies, destroy the model.
		local _result = newModel
		if _result ~= nil then
			_result = _result.Humanoid.Died:Connect(function()
				newModel:Destroy()
			end)
		end
		-- When the model is destroying, delete its entity.
		local _result_1 = newModel
		if _result_1 ~= nil then
			_result_1 = _result_1.Destroying:Connect(function()
				if world:contains(entity) then
					world:remove(entity, Body)
				end
			end)
		end
	end
	-- if dashing and locked on for side step
	-- for (const [bodyEntity, { linearVelocity, totalTime, directions }, { rootAttachment, rootPart, animator }, targetEntity] of world.query(Dashing, Body, LockedOn)) {
	--     const targetRootPart = world.contains(targetEntity) ? world.get(targetEntity, Body)?.rootPart : undefined;
	--     const maxDistanceFromTarget = getEntity.flashStepTargetDistance()
	--     const distanceFromTarget = targetRootPart ? (rootPart.Position.sub(targetRootPart.Position)).Magnitude : maxDistanceFromTarget + 1;
	--     // if distanceFromTarget is less than or equal to maxDistanceFromTarget then
	--     if (distanceFromTarget <= maxDistanceFromTarget) {
	--         // makes sure body is hidden
	--         world.set(bodyEntity, BodyHidden, true);
	--     }
	-- }
	-- When body spawns, add every part to the character.
	for _, targetEntity, changed in world:query(TargetEntity, Changed(Body)) do
		local _result = changed.new
		if _result ~= nil then
			_result = _result.model
		end
		local _condition = _result
		if not _condition then
			local _result_1 = changed.old
			if _result_1 ~= nil then
				_result_1 = _result_1.model
			end
			_condition = _result_1
		end
		local newModel = _condition
		if not changed.old and changed.new then
			local _result_1 = newModel
			if _result_1 ~= nil then
				local _exp = _result_1:GetDescendants()
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_1 = function(child)
					if child:IsA("BasePart") then
						child.CollisionGroup = if world:has(targetEntity, NoBodyCollisions) then "CharactersNoCollide" else "Characters"
					end
				end
				for _k, _v in _exp do
					_callback_1(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
			local _result_2 = newModel
			if _result_2 ~= nil then
				_result_2 = _result_2.DescendantAdded:Connect(function(descendant)
					if descendant:IsA("BasePart") then
						descendant.CollisionGroup = if world:has(targetEntity, NoBodyCollisions) then "CharactersNoCollide" else "Characters"
					end
				end)
			end
		end
	end
	-- when ever NoBodyCollisions added
	for _, targetEntity in world:query(TargetEntity, Added(NoBodyCollisions)) do
		local body = world:get(targetEntity, Body)
		-- if body then
		if body then
			local _exp = body.model:GetDescendants()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_1 = function(child)
				if child:IsA("BasePart") then
					child.CollisionGroup = "CharactersNoCollide"
				end
			end
			for _k, _v in _exp do
				_callback_1(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	-- when ever NoBodyCollisions removed
	for _, targetEntity in world:query(TargetEntity, Removed(NoBodyCollisions)) do
		local body = world:get(targetEntity, Body)
		-- if body then
		if body then
			local _exp = body.model:GetDescendants()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_1 = function(child)
				if child:IsA("BasePart") then
					child.CollisionGroup = "Characters"
				end
			end
			for _k, _v in _exp do
				_callback_1(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
		end
	end
	-- use route watching for village teleport
	useRoute(routes.teleportToVillage, function(_, player)
		local entity = getEntity.fromInstance(player)
		local _condition = entity
		if _condition ~= 0 and _condition == _condition and _condition then
			_condition = world:get(entity, Body)
		end
		local body = _condition
		local _condition_1 = entity
		if _condition_1 ~= 0 and _condition_1 == _condition_1 and _condition_1 then
			_condition_1 = world:get(entity, pair(TargetEntity, Platform))
		end
		local platformEntity = _condition_1
		local _condition_2 = platformEntity
		if _condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2 then
			_condition_2 = world:get(platformEntity, Platform)
		end
		local platform = _condition_2
		-- if platform and body then teleports the players rootpart to the platform spawn
		if platform and body then
			routes.togglePage.sendTo("None", player)
			local _cFrame = platform.SpawnLocation.CFrame
			local _arg0 = Vector3.yAxis * 5
			body.rootPart.CFrame = _cFrame + _arg0
		end
	end)
	-- use route watching for shop teleport
	useRoute(routes.teleportToShop, function(shopName, player)
		local entity = getEntity.fromInstance(player)
		local _binding = if entity ~= 0 and entity == entity and entity then { world:get(entity, Body, Data) } else {}
		local body = _binding[1]
		local data = _binding[2]
		local shopSpawn = paths.Map.Shops[if shopName == "Buy" then "King" elseif shopName == "Sell" then "Merchant" else "Architect"].SpawnLocation
		-- if platform and body then teleports the players rootpart to the platform spawn
		if body then
			body.rootPart.CFrame = shopSpawn.CFrame
		end
		if shopName == "Buy" and data and data.Tutorial == 0 then
			logTutorialStep(player, TutorialStep.ShopOpened, "tutorial_shop_opened")
		end
	end)
end
return {
	default = default,
}
