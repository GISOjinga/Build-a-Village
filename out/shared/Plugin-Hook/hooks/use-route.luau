-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local routesData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "watchRoutes").routesData
-- get instance by full name
local function getInstanceByName(fullName)
	-- Split the full name by '.' to get each part of the path
	local pathParts = string.split(fullName, ".")
	-- Start from the 'game' root
	local currentInstance = game
	-- Iterate over each part of the path
	for _, partName in pathParts do
		-- Check if the current instance is valid
		if currentInstance then
			-- Attempt to find the child with the given name
			local child = currentInstance:FindFirstChild(partName)
			-- If the child exists, update the current instance to this child
			if child then
				currentInstance = child
			end
		end
	end
	-- Return the found instance
	return currentInstance
end
local function useRoute(route, callback)
	-- if system mod descendant of players
	local _route = route
	local _result = routesData[_route]
	if _result ~= nil then
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(_param)
			local data = _param[1]
			local player = _param[2]
			return callback(data, player)
		end
		for _k, _v in _result do
			_callback(_v, _k - 1, _result)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
end
-- // use route 2
-- export function useRoute2<T extends Messages>(
--     route: T,
--     callback: (data: MessageData[T] | undefined, player: Player) => void,
-- ) {
--     // if system mod descendant of players
--     routesData.get(route as never)?.forEach(([data, player]) => callback(data as never, player as Player))
-- }
return {
	useRoute = useRoute,
}
