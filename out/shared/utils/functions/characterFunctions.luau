-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local isPointInView = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "vector3Functions").isPointInView
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local NoBodyCollisions = _jecsComponents.NoBodyCollisions
local world = _jecsComponents.world
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local addComponent = _jecsHelpFunctions.addComponent
local removeComponent = _jecsHelpFunctions.removeComponent
local function getCharacterFromPart(part)
	local _array = {}
	local _length = #_array
	local _array_1 = paths.Characters.Players:GetChildren()
	local _Length = #_array_1
	table.move(_array_1, 1, _Length, _length + 1, _array)
	_length += _Length
	local _array_2 = paths.Characters.Npcs:GetChildren()
	local _Length_1 = #_array_2
	table.move(_array_2, 1, _Length_1, _length + 1, _array)
	_length += _Length_1
	local _array_3 = paths.Characters.Mobs:GetChildren()
	table.move(_array_3, 1, #_array_3, _length + 1, _array)
	local characters = _array
	-- ▼ ReadonlyArray.find ▼
	local _callback = function(character)
		return part:IsDescendantOf(character)
	end
	local _result
	for _i, _v in characters do
		if _callback(_v, _i - 1, characters) == true then
			_result = _v
			break
		end
	end
	-- ▲ ReadonlyArray.find ▲
	return _result
end
-- switch body collisions
local switchBodyCollisions = function(bodyEntity, collideWithPlayers)
	if world:has(bodyEntity) then
		if collideWithPlayers then
			removeComponent(bodyEntity, NoBodyCollisions)
		else
			addComponent(bodyEntity, NoBodyCollisions)
		end
	end
end
-- is point in block vie
local function isInBlockView(blockerCFrame, target, maxDistance)
	local _exp = blockerCFrame.Position
	local _exp_1 = target
	local _exp_2 = blockerCFrame.LookVector
	local _condition = maxDistance
	if not (_condition ~= 0 and _condition == _condition and _condition) then
		_condition = 5
	end
	return isPointInView(_exp, _exp_1, _exp_2, _condition, 145)
end
-- returns the players humanoid, rootPart and animator
local function getCharacterParts(body)
	local _humanoid = body
	if _humanoid ~= nil then
		_humanoid = _humanoid:FindFirstChild("Humanoid")
	end
	local humanoid = _humanoid
	local _rootPart = body
	if _rootPart ~= nil then
		_rootPart = _rootPart:FindFirstChild("HumanoidRootPart")
	end
	local rootPart = _rootPart
	local _head = body
	if _head ~= nil then
		_head = _head:FindFirstChild("Head")
	end
	local head = _head
	local _animator = humanoid
	if _animator ~= nil then
		_animator = _animator:FindFirstChild("Animator")
	end
	local animator = _animator
	local _rootAttachment = rootPart
	if _rootAttachment ~= nil then
		_rootAttachment = _rootAttachment:FindFirstChild("RootAttachment")
	end
	local rootAttachment = _rootAttachment
	-- if all parts exist then return them all
	return humanoid, rootPart, head, animator, rootAttachment
end
-- clears out appearance
local function clearAppearanceForCharacter(character)
	-- destroys the facial aspects
	local _result = character.Head:FindFirstChild("Eyes")
	if _result ~= nil then
		_result:Destroy()
	end
	local _result_1 = character.Head:FindFirstChild("Nose")
	if _result_1 ~= nil then
		_result_1:Destroy()
	end
	local _result_2 = character.Head:FindFirstChild("Mouth")
	if _result_2 ~= nil then
		_result_2:Destroy()
	end
	local _result_3 = character.Head:FindFirstChild("Blink")
	if _result_3 ~= nil then
		_result_3:Destroy()
	end
	local _result_4 = character.Head:FindFirstChild("Eyebrows")
	if _result_4 ~= nil then
		_result_4:Destroy()
	end
	-- destroys the wearable/welded aspects
	local _result_5 = character:FindFirstChild("Shirt")
	if _result_5 ~= nil then
		_result_5:Destroy()
	end
	local _result_6 = character:FindFirstChild("Pant")
	if _result_6 ~= nil then
		_result_6:Destroy()
	end
	local _result_7 = character:FindFirstChild("Shoes")
	if _result_7 ~= nil then
		_result_7:Destroy()
	end
	local _result_8 = character:FindFirstChild("Hair")
	if _result_8 ~= nil then
		_result_8:Destroy()
	end
	local _result_9 = character:FindFirstChild("HeadBand")
	if _result_9 ~= nil then
		_result_9:Destroy()
	end
end
-- loads in skin
local function loadInSkinForCharacter(character, newSkin)
	local skinsFolder = character.Skin
	local characterCFrame = character:GetPivot()
	-- clears out skins folder
	skinsFolder:ClearAllChildren()
	-- hides characters base parts
	local _exp = character:GetDescendants()
	-- ▼ ReadonlyArray.forEach ▼
	local _callback = function(instance)
		if (instance:IsA("BasePart") or instance:IsA("Decal")) and instance.Name ~= "HumanoidRootPart" then
			instance.Transparency = if newSkin then 1 else 0
		end
	end
	for _k, _v in _exp do
		_callback(_v, _k - 1, _exp)
	end
	-- ▲ ReadonlyArray.forEach ▲
	-- if skin then
	if newSkin then
		-- setup: clears all children & pivots the new skin & parents it to the skins folder & welds all the body parts to the character
		newSkin:PivotTo(character:GetPivot())
		newSkin.Parent = skinsFolder
		-- loops through the new skin
		local _exp_1 = newSkin:GetChildren()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback_1 = function(instance)
			if instance:IsA("BasePart") then
				local respectiveLimb = character:WaitForChild(instance.Name)
				-- if instances matches and instances is a base part then create a weld parented to instances welded to both parts
				if respectiveLimb and respectiveLimb:IsA("BasePart") then
					local weld = Instance.new("Weld")
					instance:PivotTo(respectiveLimb:GetPivot())
					weld.Part0 = respectiveLimb
					weld.Part1 = instance
					weld.Parent = instance
				end
			end
		end
		for _k, _v in _exp_1 do
			_callback_1(_v, _k - 1, _exp_1)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	-- pivots the character back
	character:PivotTo(characterCFrame)
	return character
end
-- helps you get all characters
local function getPlayingCharacters()
	local _array = {}
	local _length = #_array
	local _array_1 = paths.Characters.Players:GetChildren()
	local _Length = #_array_1
	table.move(_array_1, 1, _Length, _length + 1, _array)
	_length += _Length
	local _array_2 = paths.Characters.Mobs:GetChildren()
	table.move(_array_2, 1, #_array_2, _length + 1, _array)
	return _array
end
return {
	getCharacterFromPart = getCharacterFromPart,
	isInBlockView = isInBlockView,
	getCharacterParts = getCharacterParts,
	clearAppearanceForCharacter = clearAppearanceForCharacter,
	loadInSkinForCharacter = loadInSkinForCharacter,
	getPlayingCharacters = getPlayingCharacters,
	switchBodyCollisions = switchBodyCollisions,
}
