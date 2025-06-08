--!strict
--!native
--!optimize 2

local Configuration = require(script.Parent.Configuration)
local globalConfiguration = require(script.Parent.globalConfiguration)
local moduleCleanupCallbacks = require(script.Parent.moduleCleanupCallbacks)
local types = require(script.Parent.types)

export type HotReloaderImpl = {
	__index: HotReloaderImpl,

	new: (configuration: Configuration.Configuration?) -> HotReloader,
	is: (value: any) -> boolean,

	destroy: (self: HotReloader) -> (),

	listen: (
		self: HotReloader,
		module: ModuleScript,
		callback: (newModule: ModuleScript, context: types.Context) -> (),
		cleanup: (previousModule: ModuleScript, context: types.Context) -> ()
	) -> types.CleanupFunction,

	scan: (
		self: HotReloader,
		container: Instance,
		callback: (newModule: ModuleScript, context: types.Context) -> (),
		cleanup: (previousModule: ModuleScript, context: types.Context) -> ()
	) -> types.CleanupFunction,
}

export type HotReloaderProperties = {
	_configuration: Configuration.Configuration,

	_listeners: { [Instance]: RBXScriptConnection },

	-- [OriginalModule]: ClonedModule
	_clonedModules: { [ModuleScript]: ModuleScript },
}

export type HotReloader = typeof(setmetatable({} :: HotReloaderProperties, (nil :: any) :: HotReloaderImpl))

local CLONED_MODULE_TAG_NAME = "__HOT_RELOAD_MODULE"

local HotReloader = {} :: HotReloaderImpl
HotReloader.__index = HotReloader

function HotReloader.new(configuration)
	local self = setmetatable({
		_listeners = {},
		_clonedModules = {},
		_configuration = configuration or globalConfiguration.getGlobalConfiguration(),
	}, HotReloader)

	return self
end

function HotReloader.is(value)
	return type(value) == "table" and getmetatable(value) == HotReloader
end

function HotReloader:destroy()
	for _, listener in self._listeners do
		listener:Disconnect()
	end
	table.clear(self._listeners)

	for _, cloned in self._clonedModules do
		cloned:Destroy()
	end
	table.clear(self._clonedModules)
end

--[=[
	Listen to changes from a single module.

	Runs the given `callback` once to start, and then again whenever the module changes.

	Runs the given `cleanup` callback after a module is changed, but before `callback` is run.

	Both are passed a [Context] object, which contains information about the original module
	and whether or not the script is reloading.

	- For `callback`, `Context.isReloading` is true if running as a result of a hot-reload (false indicates first run).
	- For `cleanup`, `Context.isReloading` is true if the module is about to be hot-reloaded (false indicates this is the last cleanup).

	@param module -- The original module to attach listeners to
	@param callback -- A callback that runs when the ModuleScript is added or changed
	@param cleanup -- A callback that runs when the ModuleScript is changed or removed
]=]
function HotReloader:listen(module, callback, cleanup)
	local configuration = self._configuration
	local moduleFullName = module:GetFullName()

	self._listeners[module] = module.Changed:Connect(function()
		local originalStillExists = game:IsAncestorOf(module)

		local cleanupContext = {
			isReloading = originalStillExists,
			originalModule = module,
		}

		local callbacks = moduleCleanupCallbacks[moduleFullName]
		if callbacks then
			for _, cleanupCallback in callbacks do
				cleanupCallback(cleanupContext)
			end
		end
		moduleCleanupCallbacks[moduleFullName] = nil

		local previousModule = self._clonedModules[module]

		if previousModule then
			cleanup(previousModule, cleanupContext)
			previousModule:Destroy()
		else
			cleanup(module, cleanupContext)
		end

		if not originalStillExists then
			return
		end

		local cloned = module:Clone()
		cloned:AddTag(CLONED_MODULE_TAG_NAME)
		cloned:AddTag(configuration.props.clonedModuleTagName)
		cloned.Parent = module.Parent
		self._clonedModules[module] = cloned

		callback(cloned, {
			originalModule = module,
			isReloading = true,
		})
	end)

	callback(module, {
		originalModule = module,
		isReloading = false,
	})

	return function()
		self._listeners[module] = nil
	end
end

--[=[
	Scans current and new descendants of an object for ModuleScripts, and runs `callback` for each of them.

	This function has the same semantics as [HotReloader:listen].

	@param container -- The root instance
	@param callback -- A callback that runs when the ModuleScript is added or changed
	@param cleanup -- A callback that runs when the ModuleScript is changed or removed
]=]
function HotReloader:scan(container, callback, cleanup)
	local configuration = self._configuration
	local listenCleanupFunctions = {}

	local function add(module: ModuleScript)
		local cleanup = self:listen(module, callback, cleanup)

		table.insert(listenCleanupFunctions, cleanup)
	end

	for _, instance in container:GetDescendants() do
		if instance:IsA("ModuleScript") then
			add(instance)
		end
	end

	self._listeners[container] = container.DescendantAdded:Connect(function(instance)
		if
			instance:IsA("ModuleScript")
			and not instance:HasTag(CLONED_MODULE_TAG_NAME)
			and not instance:HasTag(configuration.props.clonedModuleTagName)
		then
			add(instance)
		end
	end)

	return function()
		self._listeners[container] = nil

		for _, cleanup in listenCleanupFunctions do
			cleanup()
		end
	end
end

return HotReloader
