-- Compiled with roblox-ts v3.0.0
local stack = {}
local frameStack = {}
local function cleanupUnused()
	-- ▼ Array.pop ▼
	local _length = #stack
	local _result = stack[_length]
	stack[_length] = nil
	-- ▲ Array.pop ▲
	local context = _result
	assert(context, "No context to cleanup.")
	for _, storage in pairs(context.node) do
		for key, state in storage.states do
			if not (context.activeKeys[key] ~= nil) and (not storage.cleanup or storage.cleanup(state)) then
				storage.states[key] = nil
			end
		end
	end
end
--[[
	*
	 * Starts a new stack frame for a function, ensuring cleanup after execution.
	 * Intended to be used in systems.
	 *
	 * @param node - The node to store the state for the current function.
	 * @param frame - The current frame state.
	 * @param callback - The function to execute within the new stack frame.
	 
]]
local function start(node, frame, callback)
	local _arg0 = {
		activeKeys = {},
		node = node,
	}
	table.insert(stack, _arg0)
	local _frame = frame
	table.insert(frameStack, _frame)
	callback()
	cleanupUnused()
	stack[#stack] = nil
	frameStack[#frameStack] = nil
end
local function useCurrentFrame()
	local _arg0 = #frameStack > 0
	assert(_arg0, "Attempted to use a hook outside of a system.")
	return frameStack[#frameStack]
end
--[[
	*
	 * Creates or retrieves a state object for a hook, keyed by a unique identifier.
	 *
	 * @template T The type of the hook state.
	 * @param key - A unique string identifier for the hook state.
	 * @param discriminator - An optional value to further distinguish different
	 *   states within the same key. Defaults to the key itself.
	 * @param cleanup - An optional function that determines whether the state
	 *   should be cleaned up. It should return true if the state should be removed.
	 *   If not provided, the state will be cleaned up when the hook was not
	 *   accessed in the current context.
	 * @returns The state object of type T.
	 
]]
local function useHookState(discriminator, cleanup)
	local file, line = debug.info(3, "sl")
	local fn = debug.info(2, "f")
	local key = `{tostring(fn)}:{file}:{line}`
	if discriminator == nil then
		discriminator = key
	end
	local context = stack[#stack]
	assert(context, "Hooks can only be used within a `start` function.")
	local storage = context.node[key]
	if not storage then
		storage = {
			cleanup = cleanup,
			states = {},
		}
		context.node[key] = storage
	end
	local stringDiscriminator = tostring(discriminator)
	local compositeKey = `{key}-{stringDiscriminator}`
	context.activeKeys[compositeKey] = true
	local state = storage.states[compositeKey]
	if state == nil then
		state = {}
		local _states = storage.states
		local _state = state
		_states[compositeKey] = _state
	end
	return state
end
return {
	start = start,
	useCurrentFrame = useCurrentFrame,
	useHookState = useHookState,
}
