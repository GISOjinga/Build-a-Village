--!strict
--!native
--!optimize 2

local types = require(script.Parent.types)

local moduleCleanupCallbacks: { [string]: { (context: types.Context) -> () } } = {}

return moduleCleanupCallbacks
