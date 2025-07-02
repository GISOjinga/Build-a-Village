-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local CountDown = _jecsComponents.CountDown
local EmitParticles = _jecsComponents.EmitParticles
-- emits the particles
local default = function(world)
	for emitEntity, emitParticle in world:query(EmitParticles):without(CountDown) do
		local _binding = emitParticle
		local particles = _binding.particles
		local amount = _binding.amount
		local delay = _binding.delay
		-- emits the particles
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(particle)
			return particle:Emit(amount)
		end
		for _k, _v in particles do
			_callback(_v, _k - 1, particles)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- adds cooldown and updates the emit
		local _world = world
		local _object = table.clone(emitParticle)
		setmetatable(_object, nil)
		_world:set(emitEntity, EmitParticles, _object)
		world:set(emitEntity, CountDown, delay)
	end
end
return {
	default = default,
}
