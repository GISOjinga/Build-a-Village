-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- UIUtilities.ts
------------------------------------------------------------------------------------
-- Provides common UI utility functions and button effects with robust error handling.
------------------------------------------------------------------------------------
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local TweenService = _services.TweenService
local UserInputService = _services.UserInputService
local warnTS = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").warnTS
-- variables
local player = Players.LocalPlayer
local controlModule = require(player:WaitForChild("PlayerScripts"):WaitForChild("PlayerModule"):WaitForChild("ControlModule"))
local function IsUsingTouchPadToWalk()
	return controlModule:GetMoveVector().Magnitude > 0 and UserInputService.KeyboardEnabled == false
end
-- Namespace to hold all utilities
local UIUtilities = {}
do
	local _container = UIUtilities
	------------------------------------------------------------------------------------
	-- Determines whether a given InputObject should be treated as an activation (touch or click).
	------------------------------------------------------------------------------------
	local function IsInputActivated(input)
		return input.UserInputType == Enum.UserInputType.Touch or input.UserInputType == Enum.UserInputType.MouseButton1
	end
	_container.IsInputActivated = IsInputActivated
	------------------------------------------------------------------------------------
	-- Multiplies two UDim2 values element-wise, returning a new UDim2.
	------------------------------------------------------------------------------------
	local function MultiplyUdim2(udim2, m)
		return UDim2.new(udim2.X.Scale * m.X.Scale, udim2.X.Offset * m.X.Offset, udim2.Y.Scale * m.Y.Scale, udim2.Y.Offset * m.Y.Offset)
	end
	_container.MultiplyUdim2 = MultiplyUdim2
	------------------------------------------------------------------------------------
	-- Adds two UDim2 values element-wise, returning a new UDim2.
	------------------------------------------------------------------------------------
	local function AddUdim2(a, b)
		return UDim2.new(a.X.Scale + b.X.Scale, a.X.Offset + b.X.Offset, a.Y.Scale + b.Y.Scale, a.Y.Offset + b.Y.Offset)
	end
	_container.AddUdim2 = AddUdim2
	------------------------------------------------------------------------------------
	-- Subtracts the second UDim2 from the first element-wise, returning a new UDim2.
	------------------------------------------------------------------------------------
	local function SubtractUdim2(a, b)
		return UDim2.new(a.X.Scale - b.X.Scale, a.X.Offset - b.X.Offset, a.Y.Scale - b.Y.Scale, a.Y.Offset - b.Y.Offset)
	end
	_container.SubtractUdim2 = SubtractUdim2
	------------------------------------------------------------------------------------
	-- Divides the first UDim2 by the second element-wise, handling NaN or infinite results.
	------------------------------------------------------------------------------------
	local function DivideUdim2(a, b)
		local divide = function(num1, num2)
			local result = num1 / num2
			local _value = (result == result and result)
			return if _value ~= 0 and _value == _value and _value then result else 0
		end
		return UDim2.new(divide(a.X.Scale, b.X.Scale), divide(a.X.Offset, b.X.Offset), divide(a.Y.Scale, b.Y.Scale), divide(a.Y.Offset, b.Y.Offset))
	end
	_container.DivideUdim2 = DivideUdim2
	------------------------------------------------------------------------------------
	-- Connects button hover, press, and release effects with callbacks.
	--
	-- @param buttonEffects  Configuration for sizes, tweens, and container.
	-- @param onReleased     Optional callback when input is released.
	-- @param onHeld         Optional callback when input is held down.
	-- @returns              Controls for toggling hover, enabling/disabling, and destroying.
	------------------------------------------------------------------------------------
	local function ButtonAction(buttonEffects, onReleased, onHeld)
		local trash = Janitor.new()
		local trashTween = Janitor.new()
		local button = buttonEffects.Button
		local container = buttonEffects.Container or buttonEffects.Button
		local defaultSize = buttonEffects.DefaultSize or container.Size
		local expandedSize = buttonEffects.ExpandedSize or defaultSize
		local deExpandedSize = buttonEffects.DeExpandedSize or defaultSize
		local hoveringTweenInfo = buttonEffects.HoveringTweenInfo or TweenInfo.new(0.25, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out)
		local elasticTweenInfo = buttonEffects.ElasticTweenInfo or TweenInfo.new(1.25, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out)
		local extraControls = {
			_hoverEffect = true,
			_isHovering = false,
			_enabled = true,
			ToggleHover = function(self, toggle)
				self._hoverEffect = toggle
				return self
			end,
			ToggleEnabled = function(self, toggle)
				self._enabled = toggle
				return self
			end,
			Destroy = function(self)
				trash:Destroy()
			end,
		}
		-- Mouse enters -> expand
		trash:Add(button.MouseEnter:Connect(function()
			TS.Promise.try(function()
				if extraControls._hoverEffect and extraControls._enabled then
					extraControls._isHovering = true
					trashTween:Add(TweenService:Create(container, hoveringTweenInfo, {
						Size = expandedSize,
					})):Play()
				end
			end):catch(function(err)
				return warnTS(137, err)
			end)
		end))
		-- Mouse leaves -> revert
		trash:Add(button.MouseLeave:Connect(function()
			TS.Promise.try(function()
				if not extraControls._enabled then
					return nil
				end
				if extraControls._hoverEffect or extraControls._isHovering then
					extraControls._isHovering = false
					trashTween:Add(TweenService:Create(container, hoveringTweenInfo, {
						Size = defaultSize,
					})):Play()
				end
			end):catch(function(err)
				return warnTS(150, err)
			end)
		end))
		-- Input began -> de-expand & onHeld
		trash:Add(button.InputBegan:Connect(function(input)
			TS.Promise.try(function()
				if buttonEffects.AccountForTouch and IsUsingTouchPadToWalk() then
					return nil
				end
				if not extraControls._enabled then
					return nil
				end
				if IsInputActivated(input) then
					container.Size = defaultSize
					trashTween:Add(TweenService:Create(container, hoveringTweenInfo, {
						Size = deExpandedSize,
					})):Play()
					if onHeld then
						onHeld()
					end
				end
			end):catch(function(err)
				return warnTS(165, err)
			end)
		end))
		-- Input ended -> expand back & onReleased
		trash:Add(button.InputEnded:Connect(function(input)
			TS.Promise.try(function()
				if buttonEffects.AccountForTouch and IsUsingTouchPadToWalk() then
					return nil
				end
				if not extraControls._enabled then
					return nil
				end
				if IsInputActivated(input) then
					trashTween:Add(TweenService:Create(container, elasticTweenInfo, {
						Size = defaultSize,
					})):Play()
					if onReleased then
						onReleased()
					end
				end
			end):catch(function(err)
				return warnTS(179, err)
			end)
		end))
		-- when trash is getting destroyed it resets the size
		trash:Add(function()
			trashTween:Destroy()
			container.Size = defaultSize
		end)
		return extraControls
	end
	_container.ButtonAction = ButtonAction
	------------------------------------------------------------------------------------
	-- Opens or closes a GUI object by tweening its position or instantly moving it.
	--
	-- @param guiObject  The GuiObject to move.
	-- @param openClose  True to center, false to hide off-screen left.
	-- @param noTween    True to move instantly; false to animate.
	-- @returns          The Tween if animated, otherwise undefined.
	------------------------------------------------------------------------------------
	local function OpenClose(guiObject, openClose, noTween)
		if noTween then
			guiObject.Position = if openClose then UDim2.fromScale(0.5, 0.5) else UDim2.fromScale(-2, 0.5)
			return nil
		else
			local tweenInfo = TweenInfo.new(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out)
			local tween = TweenService:Create(guiObject, tweenInfo, {
				Position = if openClose then UDim2.fromScale(0.5, 0.5) else UDim2.fromScale(-2, 0.5),
			})
			tween:Play()
			return tween
		end
	end
	_container.OpenClose = OpenClose
	-- Types for button effects configuration
	-- Controls returned by ButtonAction, including internal flags
end
-- Export the namespace for use in other scripts
return UIUtilities
