-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- loads the character
local default = function(world)
	local _exp = Players:GetPlayers()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(player)
		local _value = player:GetAttribute("JecsLoaded")
		if not (_value ~= 0 and _value == _value and _value ~= "" and _value) then
			return nil
		end
		local _value_1 = player:GetAttribute("characterSpawnedTag")
		if not (_value_1 ~= 0 and _value_1 == _value_1 and _value_1 ~= "" and _value_1) then
			-- sets loaded to true
			player:SetAttribute("characterSpawnedTag", true)
			-- when tasked with loading the characer
			task.spawn(function()
				-- loads the character
				player:LoadCharacter()
				-- places the character inside the folder
				player.Character.Parent = paths.Characters.Players
				-- when destroying
				player.Character.Destroying:Connect(function()
					player:SetAttribute("characterSpawnedTag", false)
				end)
			end)
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
end
return {
	default = default,
}
