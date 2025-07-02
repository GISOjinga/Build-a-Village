-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local useHookState = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").useHookState
local function connect(event, callback)
	local _event = event
	if type(_event) == "function" then
		return event(callback)
	else
		local _event_1 = event
		local _condition = typeof(_event_1) == "RBXScriptSignal"
		if not _condition then
			_condition = event.Connect ~= nil
		end
		if _condition then
			return event:Connect(callback)
		elseif event.connect ~= nil then
			return event:connect(callback)
		elseif event.on ~= nil then
			return event:on(callback)
		end
	end
	error("Event-like object does not have a supported connect method.")
end
local function disconnect(connection)
	local _connection = connection
	if type(_connection) == "function" then
		connection()
	else
		local _connection_1 = connection
		local _condition = typeof(_connection_1) == "RBXScriptConnection"
		if not _condition then
			_condition = connection.Disconnect ~= nil
		end
		if _condition then
			connection:Disconnect()
		elseif connection.disconnect ~= nil then
			connection:disconnect()
		else
			error("Connection-like object does not have a supported disconnect method.")
		end
	end
end
local function cleanup(storage)
	if storage.connection then
		disconnect(storage.connection)
	end
	return true
end
--[[
	*
	 * Utility for handling event-like objects.
	 *
	 * Connects to the provided event-like object and stores incoming events.
	 * Returns an iterable function that yields the stored events in the order they
	 * were received.
	 *
	 * @template T - The tuple type of event arguments.
	 * @param event - The event-like object to connect to.
	 * @param discriminator - An optional value to additionally key by.
	 * @param key - An automatically generated key to store the event state.
	 * @returns An iterable function that yields stored events.
	 * @metadata macro
	 
]]
local function useEvent(event, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local storage = useHookState(discriminator, cleanup)
	if not storage.connection then
		storage.events = {}
		storage.connection = connect(event, function(...)
			local args = { ... }
			local _events = storage.events
			local _args = args
			table.insert(_events, _args)
			return #_events
		end)
	end
	return function()
		return table.remove(storage.events, 1)
	end
end
return {
	useEvent = useEvent,
}
