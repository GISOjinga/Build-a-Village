-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local effect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "charm", "src").effect
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local SoundService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").SoundService
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local createMotion = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "ripple", "src").createMotion
local default = function(dialoguePage)
	local trash = Janitor.new()
	local buyProximityPrompt = paths.Map.Shops:WaitForChild("King"):WaitForChild("Npc"):WaitForChild("HumanoidRootPart"):WaitForChild("ProximityPrompt")
	local sellProximityPrompt = paths.Map.Shops:WaitForChild("Merchant"):WaitForChild("Npc"):WaitForChild("HumanoidRootPart"):WaitForChild("ProximityPrompt")
	local wallProximityPrompt = paths.Map.Shops:WaitForChild("Architect"):WaitForChild("Npc"):WaitForChild("HumanoidRootPart"):WaitForChild("ProximityPrompt")
	-- uses use effect to set the dialogue
	trash:Add(useEffect(function(newTrash)
		local buyTextLabel = dialoguePage.Buy.TextLabel
		local sellTextLabel = dialoguePage.Sell.TextLabel
		local wallTextLabel = dialoguePage.Wall.TextLabel
		local npcDialogue = pageStates.npcDialogue()
		local tween = newTrash:Add(createMotion(if npcDialogue.target == "None" then 1 else 0, {
			start = true,
		}), "destroy")
		local textToArray = string.split((if npcDialogue.target == "None" then buyTextLabel.Text else npcDialogue.text), "")
		-- moves the intro text char by char
		dialoguePage.Enabled = true
		buyTextLabel.Text = ""
		sellTextLabel.Text = ""
		wallTextLabel.Text = ""
		tween:tween(if npcDialogue.target == "None" then 0 else 1, {
			time = #textToArray * (if npcDialogue.target == "None" then 0.01 else 0.02),
			style = Enum.EasingStyle.Linear,
		})
		-- when the intro text page is visible
		newTrash:Add(tween:onStep(function(progress)
			local transparency = NumberSequence.new({ NumberSequenceKeypoint.new(0, 1), NumberSequenceKeypoint.new(.5, 1 - (progress * .25)), NumberSequenceKeypoint.new(1, 1) })
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
			if buyTextLabel.Text ~= full then
				local typingSound = newTrash:Add(paths.SFX.UI.singletype:Clone())
				typingSound.Parent = SoundService
				typingSound:Play()
			end
			local _condition = full
			if _condition == nil then
				_condition = ""
			end
			buyTextLabel.Text = _condition
			local _condition_1 = full
			if _condition_1 == nil then
				_condition_1 = ""
			end
			sellTextLabel.Text = _condition_1
			local _condition_2 = full
			if _condition_2 == nil then
				_condition_2 = ""
			end
			wallTextLabel.Text = _condition_2
			dialoguePage.Buy.UIGradient.Transparency = transparency
			dialoguePage.Sell.UIGradient.Transparency = transparency
			dialoguePage.Wall.UIGradient.Transparency = transparency
		end))
		newTrash:Add(tween:onComplete(function()
			newTrash:Add(task.delay(1, function()
				newTrash:Destroy()
				pageStates.openPage(npcDialogue.target)
				-- if target is none then hide
				if npcDialogue.target == "None" then
					dialoguePage.Sell.Visible = false
					dialoguePage.Buy.Visible = false
					dialoguePage.Wall.Visible = false
				end
			end))
		end))
		-- // sets open pages to none
		-- if (pageStates.openPage() !== "None" && pageStates.openPage() !== "Sell") {
		--     printTS($line, " CLOSING PAGESSSSSSS");
		--     pageStates.openPage("None")
		-- }
		-- sets the adornee
		if npcDialogue.target == "Buy" then
			dialoguePage.Adornee = paths.Map.Shops.King.Npc.Head
			buyProximityPrompt.Enabled = false
			sellProximityPrompt.Enabled = false
			wallProximityPrompt.Enabled = false
			dialoguePage.Buy.Visible = true
			dialoguePage.Sell.Visible = false
			dialoguePage.Wall.Visible = false
		elseif npcDialogue.target == "Sell" then
			dialoguePage.Adornee = paths.Map.Shops.Merchant.Npc.Head
			buyProximityPrompt.Enabled = false
			sellProximityPrompt.Enabled = false
			wallProximityPrompt.Enabled = false
			dialoguePage.Sell.Visible = true
			dialoguePage.Buy.Visible = false
			dialoguePage.Wall.Visible = false
		elseif npcDialogue.target == "Wall" then
			dialoguePage.Adornee = paths.Map.Shops.Architect.Npc.Head
			buyProximityPrompt.Enabled = false
			sellProximityPrompt.Enabled = false
			wallProximityPrompt.Enabled = false
			dialoguePage.Wall.Visible = true
			dialoguePage.Buy.Visible = false
			dialoguePage.Sell.Visible = false
		elseif npcDialogue.target == "None" then
			buyProximityPrompt.Enabled = true
			sellProximityPrompt.Enabled = true
			wallProximityPrompt.Enabled = true
		end
	end))
	-- when open page changes then removed the npc dialogue
	local oldPage = "None"
	trash:Add(effect(function()
		if oldPage == "Sell" or oldPage == "Buy" or oldPage == "Wall" then
			pageStates.npcDialogue({
				target = "None",
				text = "",
			})
		end
		oldPage = pageStates.openPage()
	end))
	-- watches for route calls
	trash:Add(routes.npcDialogue.listen(function(newDialogue)
		return pageStates.npcDialogue(newDialogue)
	end))
	-- when the buy button is clicked
	trash:Add(paths.Map.Shops.King.Npc.HumanoidRootPart.ProximityPrompt.Triggered:Connect(function()
		pageStates.npcDialogue({
			target = "Buy",
			text = "Here are the items for sale!",
		})
	end))
	-- when the sell button is clicked
	trash:Add(paths.Map.Shops.Merchant.Npc.HumanoidRootPart.ProximityPrompt.Triggered:Connect(function()
		pageStates.npcDialogue({
			target = "Sell",
			text = "Hey! What can i do for ya?",
		})
	end))
	-- when the wall button is clicked
	trash:Add(paths.Map.Shops.Architect.Npc.HumanoidRootPart.ProximityPrompt.Triggered:Connect(function()
		pageStates.npcDialogue({
			target = "Wall",
			text = "Here are the walls for sale!",
		})
	end))
	return trash
end
return {
	default = default,
}
