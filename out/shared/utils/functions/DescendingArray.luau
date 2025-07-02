-- Compiled with roblox-ts v3.0.0
local function DescendingArray(str)
	-- Initialize an empty array to store subs
	local autoCompleteArray = {}
	-- Generate subs
	local word = ""
	for i = 0, #str - 1 do
		local _str = str
		local _i = i
		local _arg1 = i + 1
		local char = string.sub(_str, _i, _arg1)
		local _condition = char == string.upper(char) and i > 0
		if _condition then
			local _str_1 = str
			local _arg0 = i - 1
			local _i_1 = i
			local _exp = string.sub(_str_1, _arg0, _i_1)
			local _str_2 = str
			local _arg0_1 = i - 1
			local _i_2 = i
			_condition = _exp == string.lower(string.sub(_str_2, _arg0_1, _i_2))
		end
		if _condition then
			-- Add previous word before starting a new one
			local _arg0 = string.lower(word)
			table.insert(autoCompleteArray, _arg0)
			local _arg0_1 = string.upper(word)
			table.insert(autoCompleteArray, _arg0_1)
			word = ""
		end
		word ..= char
		-- Add each word to the array
		local _arg0 = string.lower(word)
		table.insert(autoCompleteArray, _arg0)
		local _arg0_1 = string.upper(word)
		table.insert(autoCompleteArray, _arg0_1)
	end
	-- Return the array of subs
	return autoCompleteArray
end
return {
	default = DescendingArray,
}
