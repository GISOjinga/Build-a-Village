-- Compiled with roblox-ts v3.0.0
local TS = _G[script]
TS.import(script, script, "jecs")
TS.import(script, script, "vide")
if game:GetService("RunService"):IsClient() then
	TS.Promise.new(function(resolve)
		resolve(TS.import(script, script, "pebble"))
	end):expect()
end
local jabby = TS.import(script, script, "jabby")
return jabby
