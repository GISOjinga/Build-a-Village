-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local TweenService = _services.TweenService
local UserInputService = _services.UserInputService
local Workspace = _services.Workspace
local Tracer = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "tracer", "out").Tracer
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local _Plugin_Hook = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook")
local useChange = _Plugin_Hook.useChange
local useEffect = _Plugin_Hook.useEffect
local useEvent = _Plugin_Hook.useEvent
local useThrottle = _Plugin_Hook.useThrottle
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local rayParamsInclude = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "rayFunctions").rayParamsInclude
local CreateVisualizer = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "vector3Functions").CreateVisualizer
local isVillagersOverlapping = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "villagerFunctions").isVillagersOverlapping
local ReplicatedComponent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents").ReplicatedComponent
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- variables
local player = Players.LocalPlayer
local camera = Workspace.Camera
local mouse = player:GetMouse()
local registeredTools = {}
local trash = Janitor.new()
local rayVisualizer = trash:Add(CreateVisualizer.new())
local villagerServerEntityToDig
local goalCFrame
local highlight
local fakeModel
-- sets up trash
trash:LinkToInstance(script, true)
-- function to tween highligh color
local highlightTween = function(passed)
	if highlight then
		trash:Add(TweenService:Create(highlight, TweenInfo.new(.3, Enum.EasingStyle.Cubic), {
			FillColor = if passed == true then Color3.new(0, 1, 0.22) else Color3.new(1, 0, 0),
			OutlineColor = if passed == true then Color3.new(0, 0.5, 0) else Color3.new(0.5, 0, 0),
			FillTransparency = if passed == nil then 1 else 0.5,
			OutlineTransparency = if passed == nil then 1 else 0.5,
		})):Play()
	end
end
--[[
	*
	 * Snaps a CFrame to the nearest grid unit relative to a given origin CFrame.
	 * The object's rotation is preserved, and the pivot point is snapped to the grid.
	 *
	 * @param originCFrame - The CFrame defining the grid's origin and orientation.
	 * @param objectCFrame - The object's CFrame to be snapped.
	 * @param gridSize - Size of one grid unit (default: 1)
	 * @returns A new CFrame snapped to the grid, preserving rotation.
	 
]]
local function getSnappedGridCFrame(originCFrame, objectCFrame, gridSize)
	if gridSize == nil then
		gridSize = 1
	end
	-- Convert object's world position into the local space of the grid
	local localPos = originCFrame:PointToObjectSpace(objectCFrame.Position)
	-- Snap the local coordinates to the nearest grid step
	local snappedLocalX = math.floor((localPos.X / gridSize) + 0.5) * gridSize
	local snappedLocalY = math.floor((localPos.Y / gridSize) + 0.5) * gridSize
	local snappedLocalZ = math.floor((localPos.Z / gridSize) + 0.5) * gridSize
	local snappedLocalPos = Vector3.new(snappedLocalX, snappedLocalY, snappedLocalZ)
	-- Convert the snapped position back into world space
	local snappedWorldPos = originCFrame:PointToWorldSpace(snappedLocalPos)
	-- Extract rotation from the original object's CFrame
	local _, __, ___, R00, R01, R02, R10, R11, R12, R20, R21, R22 = objectCFrame:GetComponents()
	-- Return a new CFrame with snapped position and original rotation
	return CFrame.new(snappedWorldPos.X, snappedWorldPos.Y, snappedWorldPos.Z, R00, R01, R02, R10, R11, R12, R20, R21, R22)
end
local function clampCFrameToBounds(objectCFrame, objectSize, boundsCFrame, boundsSize)
	-- Convert object's position into bounds' local space
	local localPos = boundsCFrame:PointToObjectSpace(objectCFrame.Position)
	-- Rotate the object's size into bounds-local space to get actual footprint
	local _exp = objectCFrame.RightVector:Abs()
	local _x = objectSize.X
	local objectRight = _exp * _x
	local _exp_1 = objectCFrame.UpVector:Abs()
	local _y = objectSize.Y
	local objectUp = _exp_1 * _y
	local _exp_2 = objectCFrame.LookVector:Abs()
	local _z = objectSize.Z
	local objectLook = _exp_2 * _z
	local rotatedSize = objectRight + objectUp + objectLook
	local objectHalf = rotatedSize / 2
	local boundsHalf = boundsSize / 2
	-- Clamp local position so the object stays fully within the bounds
	local clampedX = math.clamp(localPos.X, -boundsHalf.X + objectHalf.X, boundsHalf.X - objectHalf.X)
	local clampedY = localPos.Y
	local clampedZ = math.clamp(localPos.Z, -boundsHalf.Z + objectHalf.Z, boundsHalf.Z - objectHalf.Z)
	local clampedLocalPos = Vector3.new(clampedX, clampedY, clampedZ)
	local clampedWorldPos = boundsCFrame:PointToWorldSpace(clampedLocalPos)
	-- Reconstruct CFrame with original rotation but clamped position
	local _, __, ___, R00, R01, R02, R10, R11, R12, R20, R21, R22 = objectCFrame:GetComponents()
	return CFrame.new(clampedWorldPos.X, clampedWorldPos.Y, clampedWorldPos.Z, R00, R01, R02, R10, R11, R12, R20, R21, R22)
end
local default = function(world)
	local body = getEntity.bodyFromPlayer(player)
	local platform = body and body.platform
	local _result = platform
	if _result ~= nil then
		_result = _result:FindFirstChild("Floor")
	end
	local platformFloor = _result
	local _result_1 = platform
	if _result_1 ~= nil then
		_result_1 = _result_1:FindFirstChild("Villagers")
	end
	local villagers = _result_1
	local backpack = player:FindFirstChild("Backpack")
	local equippedTool = body and body.model:FindFirstChildOfClass("Tool")
	-- for palcing villagers
	if pageStates.placeVillager() and fakeModel and goalCFrame and not UserInputService.KeyboardEnabled then
		printJecs(122, "Placing villager at", goalCFrame)
		pageStates.placeVillager(false)
		routes.placeVillager:send(goalCFrame)
	else
		local _value = pageStates.digVillager() and villagerServerEntityToDig
		if _value ~= 0 and _value == _value and _value then
			printJecs(126, "Digging villager at", goalCFrame)
			pageStates.digVillager(false)
			routes.digVillager:send(villagerServerEntityToDig)
		end
	end
	-- when a tool is added to backpack that isnt registered then backpack
	if backpack then
		local loadTool = function(tool)
			printJecs(134, "Loading tool", tool, registeredTools)
			local _condition = tool:IsA("Tool")
			if _condition then
				local _tool = tool
				_condition = not (registeredTools[_tool] ~= nil)
			end
			if _condition then
				local toolType = tool:GetAttribute("ItemType")
				local itemName = tool:GetAttribute("ItemName")
				-- when the tool is added to the world
				local _tool = tool
				local _arg1 = {
					ItemName = itemName,
					ToolType = toolType,
				}
				registeredTools[_tool] = _arg1
				printJecs(141, "Registered tool", tool, itemName, toolType, registeredTools)
				-- when destroying
				tool.Destroying:Connect(function()
					local _tool_1 = tool
					-- ▼ Map.delete ▼
					local _valueExisted = registeredTools[_tool_1] ~= nil
					registeredTools[_tool_1] = nil
					-- ▲ Map.delete ▲
					return _valueExisted
				end)
				-- when the tool is activated
				trash:Add(tool.Activated:Connect(function()
					if not UserInputService.KeyboardEnabled then
						return nil
					end
					printJecs(149, "Activated", registeredTools, toolType)
					if toolType == "Villager" and fakeModel and goalCFrame then
						printJecs(151, "Placing villager at", goalCFrame)
						routes.placeVillager:send(goalCFrame)
					else
						local _value = toolType == "DigTool" and villagerServerEntityToDig
						if _value ~= 0 and _value == _value and _value then
							printJecs(154, "Digging villager at", goalCFrame)
							routes.digVillager:send(villagerServerEntityToDig)
						end
					end
				end))
			end
		end
		-- initially registers all the tools
		useEffect(function()
			local trash = Janitor.new()
			-- when a tool is added to the backpack
			trash:Add(backpack.ChildAdded:Connect(function(tool)
				return loadTool(tool)
			end))
			-- gets the children in the body model
			local _result_2 = body
			if _result_2 ~= nil then
				local _exp = _result_2.model:GetChildren()
				-- ▼ ReadonlyArray.forEach ▼
				local _callback = function(tool)
					if tool:IsA("Tool") then
						loadTool(tool)
					end
				end
				for _k, _v in _exp do
					_callback(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
			-- when a tool is removed from the backpack
			local _exp = backpack:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(tool)
				if tool:IsA("Tool") then
					loadTool(tool)
				end
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			return function()
				return trash:Destroy()
			end
		end, { body and backpack }, 179)
	end
	-- if there is a equipped tool and its registered then
	if body and useChange({ equippedTool, equippedTool and registeredTools[equippedTool] ~= nil }) then
		-- destroys old model
		local _result_2 = fakeModel
		if _result_2 ~= nil then
			_result_2:Destroy()
		end
		local _result_3 = highlight
		if _result_3 ~= nil then
			_result_3:Destroy()
		end
		fakeModel = nil
		highlight = nil
		villagerServerEntityToDig = nil
		pageStates.placementRotationOffset(0)
		pageStates.placeVillager(false)
		pageStates.digVillager(false)
		pageStates.openPage("None")
		-- sets up new model
		printJecs(198, "Equipped tool", equippedTool, "with registered tools", registeredTools)
		if equippedTool and registeredTools[equippedTool] ~= nil then
			local _binding = registeredTools[equippedTool]
			local ToolType = _binding.ToolType
			local ItemName = _binding.ItemName
			printJecs(201, "Equipped tool", ItemName, "of type", ToolType)
			-- function to make a highlight
			local function makeHighlight(parent)
				-- sets up highlight
				highlight = trash:Add(Instance.new("Highlight"))
				highlight.DepthMode = Enum.HighlightDepthMode.Occluded
				highlight.Name = "Highlight"
				highlight.Adornee = parent
				highlight.FillColor = Color3.new(0, 1, 0.22)
				highlight.OutlineColor = Color3.new(0, 0.5, 0)
				highlight.FillTransparency = .5
				highlight.OutlineTransparency = 0
				highlight.Parent = parent
			end
			-- if the tool is a villager then
			if ToolType == "Villager" and platformFloor then
				local hitBox = Instance.new("Part")
				-- sets up fake model
				printJecs(222, "Creating fake model for Villager", ItemName)
				pageStates.placementRotationOffset(0)
				fakeModel = trash:Add(paths.Assets.Villagers[ItemName]:Clone())
				local _exp = fakeModel:GetDescendants()
				-- ▼ ReadonlyArray.forEach ▼
				local _callback = function(descendant)
					if descendant:IsA("BasePart") then
						descendant.CollisionGroup = "NoCollision"
					end
				end
				for _k, _v in _exp do
					_callback(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
				local _exp_1 = fakeModel.Station.Parts:GetDescendants()
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_1 = function(descendant)
					if descendant:IsA("BasePart") and not descendant:IsDescendantOf(fakeModel.Station.Parts.StationParts) and not descendant:IsDescendantOf(fakeModel.Station.Parts.ProgressFull) and not descendant:IsDescendantOf(fakeModel.Station.Parts.Resources) then
						descendant.Transparency = 1
					end
				end
				for _k, _v in _exp_1 do
					_callback_1(_v, _k - 1, _exp_1)
				end
				-- ▲ ReadonlyArray.forEach ▲
				fakeModel:PivotTo(platformFloor.CFrame)
				fakeModel.Parent = paths.TestPlacementFolder
				-- sets up highlight
				makeHighlight(fakeModel)
				-- set up part
				hitBox.Transparency = 1
				hitBox.Anchored = true
				hitBox.CanCollide = false
				hitBox.Size = fakeModel:GetExtentsSize()
				hitBox.CFrame = fakeModel:GetPivot()
				hitBox.Name = "HitBox"
				hitBox.Parent = fakeModel
			elseif ToolType == "DigTool" then
				printJecs(242, "Creating highlight for DigTool", ItemName)
				-- sets up highlight
				makeHighlight(Workspace.Camera)
			end
		end
	end
	-- if r is being held down then increase r by 1
	for _binding in useEvent(UserInputService.InputBegan) do
		local input = _binding[1]
		if input.KeyCode == Enum.KeyCode.R and fakeModel then
			pageStates.placementRotationOffset(function(rotatedY)
				return if ((rotatedY + 90) >= 360) then 0 else rotatedY + 90
			end)
		end
	end
	-- if fake model exists and a valid platform/tool are present
	if useThrottle(.01) and fakeModel and highlight and platform and platformFloor and equippedTool and registeredTools[equippedTool] ~= nil then
		local fullModelSize = fakeModel:GetExtentsSize()
		local modelHalfExtents = fullModelSize * 0.5
		local _condition = fakeModel:GetAttribute("Height")
		if not (_condition ~= 0 and _condition == _condition and _condition) then
			_condition = 3.3
		end
		local modelHeight = _condition
		local platformDirection = platformFloor.CFrame.LookVector
		local _binding = registeredTools[equippedTool]
		local ToolType = _binding.ToolType
		if ToolType == "Villager" then
			local hitResults = Tracer.ray(camera.CFrame.Position, if not UserInputService.KeyboardEnabled then camera.CFrame.LookVector else mouse.Hit.LookVector, 100):useRaycastParams(rayParamsInclude({ paths.Map })):run()
			-- open the placement page
			if not UserInputService.KeyboardEnabled and pageStates.openPage() ~= "Placement" then
				pageStates.openPage("Placement")
			end
			-- convert world hit pos into platform-local space
			local localHitPos = platformFloor.CFrame:PointToObjectSpace(hitResults.position)
			local worldPos = platformFloor.CFrame:PointToWorldSpace(localHitPos)
			local goalPos = Vector3.new(worldPos.X, platformFloor.Position.Y, worldPos.Z)
			local _exp = CFrame.lookAlong(goalPos, platformDirection, Vector3.yAxis)
			local _arg0 = CFrame.Angles(0, math.rad(pageStates.placementRotationOffset()), 0)
			local testCFrame = _exp * _arg0
			local _exp_1 = platformFloor.CFrame
			local _size = platformFloor.Size
			local _arg0_1 = Vector3.yAxis * 1000
			local finalCFrame = clampCFrameToBounds(testCFrame, fullModelSize, _exp_1, _size + _arg0_1)
			local realCFrame = getSnappedGridCFrame(platformFloor.CFrame, finalCFrame, 1 + math.max(modelHalfExtents.X - math.floor(fullModelSize.X), modelHalfExtents.Z - math.floor(fullModelSize.Z)))
			local modelPivot = fakeModel:GetPivot()
			local floorYPosition = platform and platform.Floor.Position.Y - (platform.Floor.Size.Y / 2)
			local _cFrame = CFrame.new(realCFrame.X, floorYPosition + modelHeight, realCFrame.Z)
			local _rotation = realCFrame.Rotation
			local chosenCFrame = _cFrame * _rotation
			-- move the model
			fakeModel:PivotTo(modelPivot:Lerp(chosenCFrame, .2))
			goalCFrame = chosenCFrame
			highlightTween(if isVillagersOverlapping(platform.Villagers:GetChildren(), fakeModel) then false else true)
		end
	else
		local _result_2 = equippedTool
		if _result_2 ~= nil then
			_result_2 = _result_2:GetAttribute("ItemType")
		end
		local _condition = _result_2 == "DigTool"
		if _condition then
			_condition = platform and villagers and highlight
		end
		if _condition then
			local villagerPartResults = Tracer.sphere(.5, camera.CFrame.Position, if not UserInputService.KeyboardEnabled then camera.CFrame.LookVector else mouse.Hit.LookVector, 100):useRaycastParams(rayParamsInclude({ platform.Villagers })):run()
			local villagerPartHovered = villagerPartResults.hit
			local _condition_1 = villagerPartHovered
			if _condition_1 then
				local _result_3 = villagers
				if _result_3 ~= nil then
					local _exp = _result_3:GetChildren()
					-- ▼ ReadonlyArray.find ▼
					local _callback = function(child)
						return villagerPartHovered:IsDescendantOf(child)
					end
					local _result_4
					for _i, _v in _exp do
						if _callback(_v, _i - 1, _exp) == true then
							_result_4 = _v
							break
						end
					end
					-- ▲ ReadonlyArray.find ▲
					_result_3 = _result_4
				end
				_condition_1 = _result_3
			end
			local villagerModel = _condition_1
			local villagerEntity = villagerModel and getEntity.fromInstance(villagerModel)
			local _condition_2 = villagerEntity
			if _condition_2 ~= 0 and _condition_2 == _condition_2 and _condition_2 then
				_condition_2 = world:get(villagerEntity, ReplicatedComponent)
			end
			local villagerServerEntity = _condition_2
			-- open the placement page
			if not UserInputService.KeyboardEnabled and pageStates.openPage() ~= "Dig" then
				pageStates.openPage("Dig")
			end
			-- if villager model then
			local _value = villagerModel and villagerServerEntity
			if _value ~= 0 and _value == _value and _value then
				villagerServerEntityToDig = villagerServerEntity
				highlight.Adornee = villagerModel
				highlightTween(false)
			else
				villagerServerEntityToDig = if UserInputService.KeyboardEnabled then nil else villagerServerEntityToDig
				highlightTween(nil)
			end
		end
	end
end
return {
	getSnappedGridCFrame = getSnappedGridCFrame,
	clampCFrameToBounds = clampCFrameToBounds,
	default = default,
}
