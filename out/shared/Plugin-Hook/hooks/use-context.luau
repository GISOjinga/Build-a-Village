-- Compiled with roblox-ts v3.0.0
local function useContext(key)
	local data = {}
	local _key = key
	if not (data[_key] ~= nil) then
		return nil
	end
	local _key_1 = key
	local _result = data[_key_1]
	if _result ~= nil then
		local _exp = _result
		local _key_2 = key
		_result = _exp[#data[_key_2]]
	end
	return _result
end
return {
	useContext = useContext,
}
