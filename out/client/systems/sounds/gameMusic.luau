-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local chosenTrack = nil
local playingTrack = 0
-- tells you if the track has been completed
local function trackCompleted()
	local trackFolder = chosenTrack and paths.SFX.GameMusic[chosenTrack]
	return not trackFolder or playingTrack > #trackFolder:GetChildren()
end
local default = function(world)
	local trackFolder = chosenTrack and paths.SFX.GameMusic[chosenTrack]
	local playingSound = trackFolder and trackFolder:FindFirstChild("Sound" .. tostring(playingTrack))
	if trackCompleted() then
		local _exp = paths.SFX.GameMusic:GetChildren()
		-- ▼ ReadonlyArray.filter ▼
		local _newValue = {}
		local _callback = function(child)
			return child.Name ~= chosenTrack
		end
		local _length = 0
		for _k, _v in _exp do
			if _callback(_v, _k - 1, _exp) == true then
				_length += 1
				_newValue[_length] = _v
			end
		end
		-- ▲ ReadonlyArray.filter ▲
		local trackFoldersToChoseFrom = _newValue
		local folderToPlayMusicFrom = trackFoldersToChoseFrom[math.floor(#trackFoldersToChoseFrom * math.random()) + 1]
		-- sets the new chosen track
		chosenTrack = folderToPlayMusicFrom.Name
		playingTrack = 0
	else
		local _result = playingSound
		if _result ~= nil then
			_result = _result.IsPlaying
		end
		local _condition = not _result
		if _condition then
			_condition = trackFolder
		end
		if _condition then
			playingTrack += 1
			local _result_1 = trackFolder:FindFirstChild("Sound" .. tostring(playingTrack))
			if _result_1 ~= nil then
				_result_1:Play()
			end
		end
	end
end
return {
	default = default,
}
