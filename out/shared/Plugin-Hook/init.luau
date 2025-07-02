-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local exports = {}
local start = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo").start
local OrderedPhases = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents").OrderedPhases
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "topo") or {} do
	exports[_k] = _v
end
local PlanckHooksPlugin
do
	PlanckHooksPlugin = setmetatable({}, {
		__tostring = function()
			return "PlanckHooksPlugin"
		end,
	})
	PlanckHooksPlugin.__index = PlanckHooksPlugin
	function PlanckHooksPlugin.new(...)
		local self = setmetatable({}, PlanckHooksPlugin)
		return self:constructor(...) or self
	end
	function PlanckHooksPlugin:constructor()
		self.systemData = {}
		self.phaseData = {}
	end
	function PlanckHooksPlugin:setupPhase(phase)
		local _phaseData = self.phaseData
		local _phase = phase
		local _arg1 = {
			lastTime = os.clock(),
			deltaTime = 0,
			currentTime = os.clock(),
		}
		_phaseData[_phase] = _arg1
	end
	function PlanckHooksPlugin:updatePhase(phase)
		local _phaseData = self.phaseData
		local _phase = phase
		local data = _phaseData[_phase]
		if data == nil then
			self:setupPhase(phase)
			local _phaseData_1 = self.phaseData
			local _phase_1 = phase
			data = _phaseData_1[_phase_1]
		end
		data.deltaTime = data.currentTime - data.lastTime
		data.lastTime = data.currentTime
		data.currentTime = os.clock()
	end
	function PlanckHooksPlugin:build(schedular)
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(phase)
			self:setupPhase(phase)
		end
		for _k, _v in OrderedPhases do
			_callback(_v, _k - 1, OrderedPhases)
		end
		-- ▲ ReadonlyArray.forEach ▲
		schedular:_addHook(schedular.Hooks.PhaseBegan, function(phase)
			self:updatePhase(phase)
		end)
		schedular:_addHook(schedular.Hooks.SystemAdd, function(info)
			local SystemInfo = info.system
			local system = SystemInfo.system
			local _systemData = self.systemData
			local _arg1 = {
				system = system,
				deltaTime = 0,
				logs = {},
				data = {},
			}
			_systemData[system] = _arg1
		end)
		schedular:_addHook(schedular.Hooks.SystemRemove, function(info)
			local SystemInfo = info.system
			local system = SystemInfo.system
			self.systemData[system] = nil
		end)
		schedular:_addHook(schedular.Hooks.SystemReplace, function(info)
			local oldSystemInfo = info.old
			local newSystemInfo = info.new
			local oldSystem = oldSystemInfo.system
			local newSystem = newSystemInfo.system
			local data = self.systemData[oldSystem]
			local _arg0 = data ~= nil
			assert(_arg0, "System data not found")
			self.systemData[oldSystem] = nil
			self.systemData[newSystem] = data
		end)
		schedular:_addHook(schedular.Hooks.OuterSystemCall, function(info)
			local system = info.system.system
			local phase = info.system.phase
			local nextFn = info.nextFn
			local phaseData = self.phaseData[phase]
			local _arg0 = phaseData ~= nil
			assert(_arg0, "Phase data not found")
			local data = self.systemData[system]
			if not data then
				return function() end
			end
			local _arg0_1 = data ~= nil
			assert(_arg0_1, "System data not found")
			data.deltaTime = phaseData.deltaTime
			return function()
				start(data.data, data, function()
					nextFn()
				end)
			end
		end)
	end
end
exports.PlanckHooksPlugin = PlanckHooksPlugin
return exports
