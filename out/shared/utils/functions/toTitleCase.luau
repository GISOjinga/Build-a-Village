-- Compiled with roblox-ts v3.0.0
-- Converts a string to title case "This Is A Title Case Example"
local function toTitleCase(str)
	local split = string.split(str, " ")
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(word, i)
		local firstLetter = string.sub(word, 1, 1)
		local theRest = string.sub(word, 2)
		split[i + 1] = string.upper(firstLetter) .. theRest
	end
	for _k, _v in split do
		_callback(_v, _k - 1, split)
	end
	-- ▲ ReadonlyArray.forEach ▲
	local result = table.concat(split, " ")
	return result
end
return {
	toTitleCase = toTitleCase,
}
