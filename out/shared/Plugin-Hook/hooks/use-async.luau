-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local useChange = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-change").useChange
local function useAsync(callback, dependencies, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator, function(state)
		local _result = state.promise
		if _result ~= nil then
			_result:cancel()
		end
		return false
	end)
	if useChange(dependencies, storage) then
		local _result = storage.promise
		if _result ~= nil then
			_result:cancel()
		end
		storage.promise = callback()
		storage.promise:andThen(function(value)
			storage.value = value
		end, function(err)
			storage.value = err
		end):finally(function()
			storage.status = storage.promise:getStatus()
		end)
	end
	return { storage.status, storage.value }
end
return {
	useAsync = useAsync,
}
