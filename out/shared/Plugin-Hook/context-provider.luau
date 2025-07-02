-- Compiled with roblox-ts v3.0.0
local data = {}
local function createContext(key, value, fn)
	local _key = key
	if not (data[_key] ~= nil) then
		local _key_1 = key
		data[_key_1] = {}
	end
	local _key_1 = key
	local _result = data[_key_1]
	if _result ~= nil then
		local _value = value
		table.insert(_result, _value)
	end
	fn()
	local _key_2 = key
	local _result_1 = data[_key_2]
	if _result_1 ~= nil then
		_result_1[#_result_1] = nil
	end
end
return {
	createContext = createContext,
}
