--!strict
--!native
--!optimize 2

export type ConfigurationProps = {
	clonedModuleTagName: string,
}

export type ConfigurationImpl = {
	__index: ConfigurationImpl,

	new: (props: ConfigurationProps) -> Configuration,
	is: (value: any) -> boolean,
}

export type ConfigurationProperties = {
	props: ConfigurationProps,
}

export type Configuration = typeof(setmetatable({} :: ConfigurationProperties, (nil :: any) :: ConfigurationImpl))

local Configuration = {} :: ConfigurationImpl
Configuration.__index = Configuration

function Configuration.new(props)
	local clonedProps = table.clone(props)

	local self: Configuration = setmetatable({
		props = clonedProps,
	}, Configuration)

	return self
end

function Configuration.is(value)
	return type(value) == "table" and getmetatable(value) == Configuration
end

return Configuration
