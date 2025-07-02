-- Compiled with roblox-ts v3.0.0
-- gets a path of unique id from instance
local function getUniqueIdPathFromInstance(instance, uniqueIdPath)
	if uniqueIdPath == nil then
		uniqueIdPath = {}
	end
	-- If the instance is the game, return the path
	if instance == game then
		return uniqueIdPath
	end
	-- Get the unique ID of the current instance
	local uniqueId = instance:GetAttribute("__UniqueInstanceId")
	-- If the unique ID is defined, add it to the path
	if uniqueId ~= nil then
		table.insert(uniqueIdPath, 1, uniqueId)
	end
	-- Recursively get the unique ID path for the parent instance
	return getUniqueIdPathFromInstance(instance.Parent, uniqueIdPath)
end
-- gets instance by unique id path
local function getInstanceByUniqueIdPath(uniqueIdPath)
	-- Start from the 'game' root
	local currentInstance = game
	-- Iterate over each unique ID in the path
	for _, uniqueId in uniqueIdPath do
		-- Check if the current instance is valid
		if currentInstance then
			-- Attempt to find the child with the given unique ID
			local _exp = currentInstance:GetChildren()
			-- ▼ ReadonlyArray.find ▼
			local _callback = function(child)
				return child:GetAttribute("__UniqueInstanceId") == uniqueId
			end
			local _result
			for _i, _v in _exp do
				if _callback(_v, _i - 1, _exp) == true then
					_result = _v
					break
				end
			end
			-- ▲ ReadonlyArray.find ▲
			currentInstance = _result
			-- If the child exists, update the current instance to this child
			if not currentInstance then
				return nil
			end
		end
	end
	-- Return the found instance
	return currentInstance
end
-- get instance by full name
local function getInstanceByName(fullName)
	-- Split the full name by '.' to get each part of the path
	local pathParts = string.split(fullName, ".")
	-- Start from the 'game' root
	local currentInstance = game
	-- Iterate over each part of the path
	for _, partName in pathParts do
		-- Check if the current instance is valid
		if currentInstance then
			-- Attempt to find the child with the given name
			local child = currentInstance:FindFirstChild(partName)
			-- If the child exists, update the current instance to this child
			if child then
				currentInstance = child
			else
				return nil
			end
		end
	end
	-- Return the found instance
	return currentInstance
end
local function serializeValue(value)
	local _value = value
	if typeof(_value) == "Vector3" then
		return {
			__type = "Vector3",
			x = value.X,
			y = value.Y,
			z = value.Z,
		}
	else
		local _value_1 = value
		if typeof(_value_1) == "CFrame" then
			return {
				__type = "CFrame",
				components = { value:GetComponents() },
			}
		else
			local _value_2 = value
			if typeof(_value_2) == "Color3" then
				return {
					__type = "Color3",
					r = value.R,
					g = value.G,
					b = value.B,
				}
			else
				local _value_3 = value
				if typeof(_value_3) == "EnumItem" then
					return {
						__type = "EnumItem",
						value = tostring(value),
					}
				else
					return value
				end
			end
		end
	end
end
local function deserializeValue(value)
	local _value = value
	local _condition = type(_value) == "table"
	if _condition then
		_condition = value ~= nil
	end
	if _condition then
		local t = value
		if t.__type == "Vector3" then
			return Vector3.new(t.x, t.y, t.z)
		elseif t.__type == "CFrame" then
			local components = t.components
			return CFrame.new(unpack(components))
		elseif t.__type == "Color3" then
			return Color3.new(t.r, t.g, t.b)
		elseif t.__type == "EnumItem" then
			local parts = string.split(t.value, ".")
			return Enum[parts[2] + 1][parts[3] + 1]
		end
	end
	return value
end
local function instanceToAttributeTree(instance)
	local result = {}
	local attributes = {}
	for key, value in pairs(instance:GetAttributes()) do
		attributes[key] = serializeValue(value)
	end
	for _, child in instance:GetChildren() do
		local childTree = instanceToAttributeTree(child)
		for childName, childData in pairs(childTree) do
			attributes[childName] = childData
		end
	end
	result[instance.Name] = attributes
	return result
end
return {
	getUniqueIdPathFromInstance = getUniqueIdPathFromInstance,
	getInstanceByUniqueIdPath = getInstanceByUniqueIdPath,
	getInstanceByName = getInstanceByName,
	instanceToAttributeTree = instanceToAttributeTree,
}
