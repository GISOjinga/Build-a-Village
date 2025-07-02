-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local exports = {}
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-event") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-throttle") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-delta-time") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-effect") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-instance") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-memo") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-change") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-async") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-interval") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-state") or {} do
	exports[_k] = _v
end
for _k, _v in TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-destructor") or {} do
	exports[_k] = _v
end
return exports
