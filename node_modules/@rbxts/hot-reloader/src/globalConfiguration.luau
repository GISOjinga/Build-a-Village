--!strict
--!native
--!optimize 2

local Configuration = require(script.Parent.Configuration)

local globalConfiguration = Configuration.new({
	clonedModuleTagName = "HotReloadModule",
})

local function getGlobalConfiguration(): Configuration.Configuration
	return globalConfiguration
end

local function setGlobalConfiguration(newGlobalConfiguration: Configuration.Configuration)
	globalConfiguration = newGlobalConfiguration
end

local exports = {
	getGlobalConfiguration = getGlobalConfiguration,
	setGlobalConfiguration = setGlobalConfiguration,
}

return exports
