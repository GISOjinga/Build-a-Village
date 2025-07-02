-- Compiled with roblox-ts v3.0.0
local function toHMS(s)
	local function pad(n)
		return if n < 10 then `0{n}` else `{n}`
	end
	local hours = math.floor(s / 3600)
	local minutes = math.floor((s % 3600) / 60)
	local seconds = s % 60
	return `{pad(hours)}:{pad(minutes)}:{pad(seconds)}`
end
local function secondsSince6pmCT()
	--Define the specific time: January 1st, 6 PM CT
	local year = os.date("*t").year
	local month = 1
	local day = 1
	--Determine if Daylight Saving Time(DST) is in effect on January 1st
	local isDST = os.date("*t", os.time({
		year = year,
		month = month,
		day = day,
		hour = 18,
		min = 0,
		sec = 0,
	})).isdst
	--Adjust for Central Time(CT)
	local offset = isDST and -5 or -6
	--Create the date table for January 1st, 6 PM CT
	local januaryFirst6PM = os.time({
		year = year,
		month = month,
		day = day,
		hour = 18 + offset,
		min = 0,
		sec = 0,
	})
	--Get the current time
	local currentTime = os.time()
	--Calculate the number of seconds since January 1st, 6 PM CT
	local offseting = -3600
	return (currentTime - januaryFirst6PM) + offseting
end
return {
	toHMS = toHMS,
	secondsSince6pmCT = secondsSince6pmCT,
}
