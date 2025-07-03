-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local SoundService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").SoundService
local routes = TS.import(script, script.Parent.Parent.Parent, "routes").default
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local createMotion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "ripple", "src").createMotion
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local default = function(pagePaths)
	local trash = Janitor.new()
	local sizeOffset = UDim2.fromScale(1.2, 1.2)
	local introTextPage = pagePaths.IntroTextPage
	-- when ever notify is called
	introTextPage.Visible = true
	trash:Add(routes.notify:listen(pageStates.introText))
	-- loads in each box
	trash:Add(useEffect(function(newTrash)
		local introText = pageStates.introText()
		local textToArray = string.split(introText.text, "")
		local tween = newTrash:Add(createMotion(0, {
			start = true,
		}), "destroy")
		-- moves the intro text char by char
		introTextPage.text.Text = ""
		tween:tween(1, {
			time = #textToArray * 0.01,
			style = Enum.EasingStyle.Linear,
		})
		-- when the intro text page is visible
		newTrash:Add(tween:onStep(function(progress)
			local full = ""
			do
				local i = 0
				local _shouldIncrement = false
				while true do
					if _shouldIncrement then
						i += 1
					else
						_shouldIncrement = true
					end
					if not (i < math.floor(#textToArray * progress)) then
						break
					end
					if i < math.floor(#textToArray * progress) then
						full ..= textToArray[i + 1]
					else
						full ..= " "
					end
				end
			end
			if introTextPage.text.Text ~= full then
				local typingSound = newTrash:Add(paths.SFX.UI.singletype:Clone())
				typingSound.Parent = SoundService
				typingSound:Play()
			end
			local _condition = full
			if _condition == nil then
				_condition = ""
			end
			introTextPage.text.Text = _condition
		end))
		-- when the intro text page is visible
		newTrash:Add(tween:onComplete(function()
			-- tweens to the goal
			newTrash:Add(task.delay(introText.duration, function()
				tween:tween(0, {
					time = #textToArray * 0.02,
					style = Enum.EasingStyle.Linear,
				})
				newTrash:Add(tween:onComplete(function()
					return newTrash:Destroy()
				end))
			end))
		end))
	end))
	return trash
end
return {
	default = default,
}
