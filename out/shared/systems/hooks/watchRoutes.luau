-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local Object = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils")
local Phases = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents").Phases
local appendJecs = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "append").appendJecs
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
-- export const routesData = new Map<packet<ByteNetType<unknown>>, (unknown[])[]>()
local routesData = {}
-- for change
local default = {
	phase = Phases.PreStartup,
	system = function(world)
		-- connected routes
		local connectedRoutes = {}
		local trash = Janitor.new()
		-- links the trash
		trash:LinkToInstance(script, true)
		trash:Add(function()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(routeCallback)
				return routeCallback()
			end
			for _k, _v in connectedRoutes do
				_callback(_v, _k - 1, connectedRoutes)
			end
			-- ▲ ReadonlyArray.forEach ▲
			return nil
		end)
		-- loops through all the routes to listen to them
		for _, _binding in Object.entries(routes) do
			local routeName = _binding[1]
			local route = _binding[2]
			local dataCalled = {}
			-- if route data doesnt have the route then adds it
			routesData[route] = dataCalled
			-- listens to it
			route:listen(function(routeData, player)
				-- print("Just Recieved route data", routeName, routeData, player)
				appendJecs(function()
					local _arg0 = { routeData, player }
					table.insert(dataCalled, _arg0)
					appendJecs(function()
						return table.remove(dataCalled, 1)
					end)
				end)
			end)
		end
	end,
}
return {
	routesData = routesData,
	default = default,
}
