--!strict
--!native
--!optimize 2

local Configuration = require(script.Configuration)
local defineCleanupCallback = require(script.defineCleanupCallback)
local globalConfiguration = require(script.globalConfiguration)
local HotReloader = require(script.HotReloader)
local types = require(script.types)

export type ConfigurationImpl = Configuration.ConfigurationImpl
export type ConfigurationProperties = Configuration.ConfigurationProperties
export type Configuration = Configuration.Configuration

export type HotReloaderImpl = HotReloader.HotReloaderImpl
export type HotReloaderProperties = HotReloader.HotReloaderProperties
export type HotReloader = HotReloader.HotReloader

export type CleanupFunction = types.CleanupFunction
export type Context = types.Context

local exports = {
	Configuration = Configuration,
	HotReloader = HotReloader,

	getGlobalConfiguration = globalConfiguration.getGlobalConfiguration,
	setGlobalConfiguration = globalConfiguration.setGlobalConfiguration,
	defineCleanupCallback = defineCleanupCallback,
}

return exports
