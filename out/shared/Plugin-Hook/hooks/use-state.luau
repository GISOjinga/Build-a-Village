-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local function useState(value, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator)
	if storage.value == nil then
		local _value = value
		if type(_value) == "function" then
			storage.value = { value() }
		else
			storage.value = { value }
		end
	end
	local setter = function(newValue)
		local value = storage.value[1]
		local _newValue = newValue
		if type(_newValue) == "function" then
			newValue = newValue(value)
		end
		storage.value = { newValue }
	end
	return storage.value[1], setter
end
return {
	useState = useState,
}
