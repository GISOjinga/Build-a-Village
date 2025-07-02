-- Compiled with roblox-ts v3.0.0
local function getRandomNumbers(min, max, amount)
	if amount == nil then
		amount = 1
	end
	math.randomseed(tick())
	local numbers = {}
	do
		local _i = 0
		local _shouldIncrement = false
		while true do
			local i = _i
			if _shouldIncrement then
				i += 1
			else
				_shouldIncrement = true
			end
			if not (i < amount) then
				break
			end
			local num = math.floor(math.random() * max) + min
			if table.find(numbers, num) ~= nil then
				i -= 1
				_i = i
				continue
			end
			table.insert(numbers, num)
			_i = i
		end
	end
	return numbers
end
return {
	getRandomNumbers = getRandomNumbers,
}
