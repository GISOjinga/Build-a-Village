-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local IncreaseParticlesSize = _jecsComponents.IncreaseParticlesSize
local CountDown = _jecsComponents.CountDown
-- emits the particles
local default = function(world)
	for emitEntity, emitParticle in world:query(IncreaseParticlesSize):without(CountDown) do
		local _binding = emitParticle
		local particles = _binding.particles
		local multiplier = _binding.multiplier
		local size = _binding.size
		local delay = _binding.delay
		local max = _binding.max
		local newSize = size * multiplier
		-- emits the particles
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(particle)
			particle.Size = NumberSequence.new(size)
			return particle.Size
		end
		for _k, _v in particles do
			_callback(_v, _k - 1, particles)
		end
		-- ▲ ReadonlyArray.forEach ▲
		-- adds cooldown and updates the emit
		local _world = world
		local _object = table.clone(emitParticle)
		setmetatable(_object, nil)
		local _left = "size"
		local _condition = max
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = newSize
		end
		_object[_left] = math.min(newSize, _condition)
		_world:set(emitEntity, IncreaseParticlesSize, _object)
		world:set(emitEntity, CountDown, delay)
	end
end
return {
	default = default,
}
