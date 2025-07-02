-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _centurion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "centurion", "out")
local TransformResult = _centurion.TransformResult
local TypeBuilder = _centurion.TypeBuilder
local getPlayingCharacters = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "characterFunctions").getPlayingCharacters
local default = TypeBuilder:create("character"):transform(function(text, executor)
	local allCharacters = getPlayingCharacters()
	if text == "@me" and executor.Character then
		return TransformResult.ok(executor.Character)
	end
	-- ▼ ReadonlyArray.find ▼
	local _callback = function(character)
		return character.Name == text
	end
	local _result
	for _i, _v in allCharacters do
		if _callback(_v, _i - 1, allCharacters) == true then
			_result = _v
			break
		end
	end
	-- ▲ ReadonlyArray.find ▲
	local character = _result
	if not character then
		return TransformResult.err("Character not found")
	else
		return TransformResult.ok(character)
	end
end):suggestions(function()
	local _exp = getPlayingCharacters()
	-- ▼ ReadonlyArray.map ▼
	local _newValue = table.create(#_exp)
	local _callback = function(character)
		return character.Name
	end
	for _k, _v in _exp do
		_newValue[_k] = _callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.map ▲
	return _newValue
end):markForRegistration():build()
return {
	default = default,
}
