--!strict
--!native
--!optimize 2

local moduleCleanupCallbacks = require(script.Parent.moduleCleanupCallbacks)

local function defineCleanupCallback(cleanup: () -> ())
	local moduleFullName = debug.info(2, "s")
	local key = `{moduleFullName}`

	local callbacks = moduleCleanupCallbacks[key]
	if not callbacks then
		moduleCleanupCallbacks[key] = { cleanup }
	else
		table.insert(callbacks, cleanup)
	end
end

return defineCleanupCallback
