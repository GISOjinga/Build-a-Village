-- Compiled with roblox-ts v3.0.0
local function addCommasEveryThreeDigits(number)
	if number == nil then
		number = 0
	end
	local numStr = tostring(number)
	local length = #numStr
	-- Insert commas at appropriate positions
	do
		local i = length - 3
		local _shouldIncrement = false
		while true do
			if _shouldIncrement then
				i -= 3
			else
				_shouldIncrement = true
			end
			if not (i > 0) then
				break
			end
			numStr = string.sub(numStr, 1, i) .. "," .. string.sub(numStr, i + 1)
		end
	end
	-- Return the formatted number
	return numStr
end
-- Converts a number of seconds into "HH:MM:SS" format
local function formatToMMSS(totalSeconds)
	-- Ensure it's a number and not negative
	local _condition = totalSeconds
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 0
	end
	totalSeconds = math.max(0, _condition)
	local hours = math.floor(totalSeconds / 3600)
	local minutes = math.floor((totalSeconds % 3600) / 60)
	local seconds = math.floor(totalSeconds % 60)
	-- Format with leading zeros
	return string.format("%02d:%02d", minutes, seconds)
end
-- Converts a number of seconds into "HH:MM:SS" format
local function formatToHHMMSS(totalSeconds)
	-- Ensure it's a number and not negative
	local _condition = totalSeconds
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 0
	end
	totalSeconds = math.max(0, _condition)
	local hours = math.floor(totalSeconds / 3600)
	local minutes = math.floor((totalSeconds % 3600) / 60)
	local seconds = math.floor(totalSeconds % 60)
	-- Format with leading zeros
	return string.format("%02d:%02d:%02d", hours, minutes, seconds)
end
-- Converts a number of seconds into "DD:HH:MM:SS" format
local function formatToDDHHMMSS(totalSeconds)
	local _condition = totalSeconds
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 0
	end
	totalSeconds = math.max(0, _condition)
	local days = math.floor(totalSeconds / 86400)
	local hours = math.floor((totalSeconds % 86400) / 3600)
	local minutes = math.floor((totalSeconds % 3600) / 60)
	local seconds = math.floor(totalSeconds % 60)
	return string.format("%02d:%02d:%02d:%02d", days, hours, minutes, seconds)
end
local function secondsToMinutesSecondsMilliseconds(seconds)
	local totalMilliseconds = seconds * 1000
	local minutes = math.floor(totalMilliseconds / (60 * 1000))
	local remainingSeconds = math.floor((totalMilliseconds % (60 * 1000)) / 1000)
	local milliseconds = math.floor(totalMilliseconds % 1000)
	-- Pad single-digit seconds and milliseconds with leading zeros
	local paddedSeconds = if remainingSeconds < 10 then "0" .. tostring(remainingSeconds) else remainingSeconds
	local paddedMilliseconds = if milliseconds < 10 then "00" .. tostring(milliseconds) elseif milliseconds < 100 then "0" .. tostring(milliseconds) else milliseconds
	return `{minutes}:{paddedSeconds}.{paddedMilliseconds}`
end
return {
	addCommasEveryThreeDigits = addCommasEveryThreeDigits,
	formatToMMSS = formatToMMSS,
	formatToHHMMSS = formatToHHMMSS,
	formatToDDHHMMSS = formatToDDHHMMSS,
	secondsToMinutesSecondsMilliseconds = secondsToMinutesSecondsMilliseconds,
}
