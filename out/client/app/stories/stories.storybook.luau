-- Compiled with roblox-ts v3.0.0
local _object = {
	name = "Stories",
}
local _left = "storyRoots"
local _result = script.Parent
if _result ~= nil then
	local _exp = _result:GetChildren()
	-- ▼ ReadonlyArray.filter ▼
	local _newValue = {}
	local _callback = function(story)
		return story:IsA("Folder")
	end
	local _length = 0
	for _k, _v in _exp do
		if _callback(_v, _k - 1, _exp) == true then
			_length += 1
			_newValue[_length] = _v
		end
	end
	-- ▲ ReadonlyArray.filter ▲
	_result = _newValue
end
local _condition = _result
if not _condition then
	_condition = {}
end
_object[_left] = _condition
_object.groupRoots = true
local storybook = _object
return storybook
