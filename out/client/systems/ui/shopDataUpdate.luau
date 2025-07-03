-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local useThrottle = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook").useThrottle
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local robuxStoreData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "robuxStoreData").default
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local getEntity = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").getEntity
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- variables
local player = Players.LocalPlayer
local tmeTillRestock = 0
local robuxStore = robuxStoreData
local default = function(world)
	local body = getEntity.bodyFromPlayer(player)
	-- updates the villager shop data
	useRoute(routes.updateVillagersShop, function(Villagers)
		pageStates.villagersShop(Villagers)
	end)
	-- update restock time
	useRoute(routes.updateRestockTime, function(time)
		tmeTillRestock = time
	end)
	-- updates the walls shop data
	useRoute(routes.updateRobuxStore, function(data)
		robuxStore = data
		pageStates.robuxStore(data)
	end)
	-- updates the totalTimeForNewVillager
	if useThrottle(.1) then
		pageStates.totalTimeForNewVillager(math.max(0, tmeTillRestock - os.time()))
	end
	-- this can open and close the shop menus based on distance
	if body then
		local openPage = pageStates.openPage()
		local _position = body.rootPart.Position
		local _position_1 = paths.Map.Shops.King.Npc.HumanoidRootPart.Position
		local distanceFromBuyNoob = (_position - _position_1).Magnitude
		local _position_2 = body.rootPart.Position
		local _position_3 = paths.Map.Shops.Merchant.Npc.HumanoidRootPart.Position
		local distanceFromSellNoob = (_position_2 - _position_3).Magnitude
		local _position_4 = body.rootPart.Position
		local _position_5 = paths.Map.Shops.Architect.Npc.HumanoidRootPart.Position
		local distanceFromArchitectNoob = (_position_4 - _position_5).Magnitude
		local maxDistance = 20
		-- makes sure the player is within range of the buy/sell noob
		if openPage == "Buy" and distanceFromBuyNoob > maxDistance then
			pageStates.openPage("None")
		elseif openPage == "Sell" and distanceFromSellNoob > maxDistance then
			pageStates.openPage("None")
		elseif openPage == "Wall" and distanceFromArchitectNoob > maxDistance then
			pageStates.openPage("None")
		end
	end
end
return {
	default = default,
}
