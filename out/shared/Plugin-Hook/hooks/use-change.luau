-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local deepEquals = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepEquals
local discriminators = {}
local function useChange(dependencies, discriminator)
	if discriminator == nil then
		discriminator = debug.traceback()
	end
	local _discriminator = discriminator
	local previous = discriminators[_discriminator]
	local _discriminator_1 = discriminator
	local _dependencies = dependencies
	discriminators[_discriminator_1] = _dependencies
	return not previous or not deepEquals(previous, dependencies)
end
return {
	useChange = useChange,
}
