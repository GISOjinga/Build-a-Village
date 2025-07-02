-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local pair = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "jecs").pair
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local removeComponent = _jecsHelpFunctions.removeComponent
local warnTS = _jecsHelpFunctions.warnTS
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local Body = _jecsComponents.Body
local ModelDebugger = _jecsComponents.ModelDebugger
local PlatformOccupied = _jecsComponents.PlatformOccupied
local Platform = _jecsComponents.Platform
local Player = _jecsComponents.Player
local Removed = _jecsComponents.Removed
local TargetEntity = _jecsComponents.TargetEntity
local Data = _jecsComponents.Data
local Villager = _jecsComponents.Villager
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- set up the gui containers
local function setUpSignGuiContainers(platform, playerName)
	local buyGui = platform.BuySign.Container.SurfaceGui
	local nameGui = platform.NameSign.Container.SurfaceGui
	local _exp = Players:GetPlayers()
	-- ▼ ReadonlyArray.find ▼
	local _callback = function(p)
		return p.Name == playerName
	end
	local _result
	for _i, _v in _exp do
		if _callback(_v, _i - 1, _exp) == true then
			_result = _v
			break
		end
	end
	-- ▲ ReadonlyArray.find ▲
	local player = _result
	-- set up the buy sign
	buyGui.Price.Visible = if playerName ~= "" and playerName then true else false
	buyGui.SubTitle.Visible = if playerName ~= "" and playerName then true else false
	buyGui.None.Visible = if not (playerName ~= "" and playerName) then true else false
	-- set up the name sign
	nameGui.Title.Visible = true
	nameGui.Title.Text = if playerName ~= "" and playerName then "Village" else "village"
	nameGui.PlayerName.Visible = true
	nameGui.PlayerName.Text = if playerName ~= "" and playerName then playerName .. "'s" else "empty"
	if player then
		platform.NameSign.Thumbnail:SetAttribute("UserId", player.UserId)
	end
end
-- to claim maps
local function claimPlatform(platformEntity, playerEntity, body, platform)
	-- sets the platform as occupied
	addComponent(platformEntity, PlatformOccupied, playerEntity)
	addComponent(platformEntity, pair(TargetEntity, Player), playerEntity)
	addComponent(playerEntity, pair(TargetEntity, Platform), platformEntity)
	-- pivots the character to the platform
	local _cFrame = platform.SpawnLocation.CFrame
	local _arg0 = Vector3.yAxis * 5
	body.rootPart.CFrame = _cFrame + _arg0
end
local default = function(world)
	local platformContainer = paths.Map.Platforms
	-- when player is removed from the world then remove the platform from the player
	for _, playerEntity in world:query(TargetEntity, Removed(Player)) do
		local platformEntity = world:get(playerEntity, pair(TargetEntity, Platform))
		-- if platform entity exists then the occupied and tags
		if platformEntity ~= nil then
			printJecs(50, "Removing platform from player: ", playerEntity, "Platform Entity: ", platformEntity)
			removeComponent(platformEntity, PlatformOccupied)
			removeComponent(platformEntity, pair(TargetEntity, Player))
			removeComponent(playerEntity, pair(TargetEntity, Platform))
		end
		-- removes the player from the platform
		for platformEntity, platform, playerEntityOccupying in world:query(Platform, PlatformOccupied) do
			if playerEntityOccupying == playerEntity then
				printJecs(59, "Removing player from platform: ", platformEntity, "Player Entity: ", playerEntity, "Platform: ", platform)
				removeComponent(platformEntity, PlatformOccupied)
				removeComponent(platformEntity, pair(TargetEntity, Player))
				removeComponent(playerEntity, pair(TargetEntity, Platform))
				-- hides the fences
				setUpSignGuiContainers(platform)
				break
			end
		end
	end
	-- when ever platform occupied is removed then hides all of the fences
	for _, platformEntity, playerOccupyingEntity in world:query(TargetEntity, Removed(PlatformOccupied)) do
		local platform = world:get(platformEntity, Platform)
		-- if platform exists then hides the fences
		if platform then
			-- loops through all pair(TargetEntity, Platform) and Villager with the platform entity to destroy the villager
			for platformEntity2, villagerEntity, villager in world:query(pair(TargetEntity, Platform)):with(Villager) do
				if platformEntity2 == platformEntity and world:contains(villagerEntity) then
					world:delete(villagerEntity)
				end
			end
			setUpSignGuiContainers(platform)
		end
	end
	-- for all players added chooses an un occupied platform
	for playerEntity, player in world:query(Player):without(pair(TargetEntity, Platform)) do
		local body = world:get(playerEntity, Body)
		local data = world:get(playerEntity, Data)
		local platformsSorted = {}
		if body and data then
			-- adds then into the list
			for platformEntity, platform in world:query(Platform):without(PlatformOccupied) do
				local _arg0 = { platformEntity, platform }
				table.insert(platformsSorted, _arg0)
			end
			-- sorts them by name
			table.sort(platformsSorted, function(a, b)
				return a[2].Name < b[2].Name
			end)
			-- if the first platform exist then
			if #platformsSorted > 0 then
				local _binding = platformsSorted[1]
				local platformEntity = _binding[1]
				local platform = _binding[2]
				-- claims the platform and sets it up
				printJecs(101, "Claiming platform for player: ", player.Name, "Platform: ", platformEntity, platform)
				claimPlatform(platformEntity, playerEntity, body, platform)
				local _object = table.clone(body)
				setmetatable(_object, nil)
				_object.platform = platform
				addComponent(playerEntity, Body, _object)
				setUpSignGuiContainers(platform, player.Name)
			else
				warnTS(106, "No platforms available for player: " .. player.Name)
			end
		end
	end
	-- if body gets added and you have a platform then pivots you to the platform
	for _, bodyEntity, body in world:query(TargetEntity, Added(Body)) do
		local platformEntity = world:get(bodyEntity, pair(TargetEntity, Platform))
		-- if platform entity exists then the occupied and tags
		if platformEntity ~= nil then
			local platform = world:get(platformEntity, Platform)
			-- if platform exists then pivots the character to the platform
			if platform then
				claimPlatform(platformEntity, bodyEntity, body, platform)
				local _object = table.clone(body)
				setmetatable(_object, nil)
				_object.platform = platform
				addComponent(bodyEntity, Body, _object)
			end
		end
	end
	-- for each platform makes sure that it has a entity attached
	local _exp = platformContainer:GetChildren()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(platform)
		local _value = getEntity.fromInstance(platform)
		if not (_value ~= 0 and _value == _value and _value) then
			local platformEntity = world:entity()
			-- sets up the components
			addComponent(platformEntity, Platform, platform)
			addComponent(platformEntity, ModelDebugger, platform.Floor)
			platform:SetAttribute("ServerId", platformEntity)
			-- hides the fences
			if platform then
				setUpSignGuiContainers(platform)
			end
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
