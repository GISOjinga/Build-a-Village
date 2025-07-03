-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Janitor = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "janitor", "src").Janitor
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local useEffect = TS.import(script, script.Parent.Parent, "hooks", "useEffect").default
local default = function(hoverBoxUI)
	local trash = Janitor.new()
	local queueLabel = hoverBoxUI.Frame:FindFirstChild("QueueLabel")
	-- if queue label does not exist create a small one under the main text label
	if not queueLabel then
		local newLabel = Instance.new("TextLabel")
		newLabel.Name = "QueueLabel"
		newLabel.Size = UDim2.fromScale(1, 0.4)
		newLabel.Position = UDim2.fromScale(0, 1)
		newLabel.BackgroundTransparency = 1
		newLabel.TextScaled = true
		newLabel.Font = hoverBoxUI.Frame.TextLabel.Font
		newLabel.TextColor3 = hoverBoxUI.Frame.TextLabel.TextColor3
		newLabel.TextStrokeTransparency = hoverBoxUI.Frame.TextLabel.TextStrokeTransparency
		newLabel.Parent = hoverBoxUI.Frame
	end
	local queue = (queueLabel or hoverBoxUI.Frame:FindFirstChild("QueueLabel"))
	-- loops through all the options and when one is pressed then
	trash:Add(useEffect(function()
		hoverBoxUI.Enabled = pageStates.hoverInfo().visible
		hoverBoxUI.Frame.TextLabel.Text = pageStates.hoverInfo().info
		queue.Text = pageStates.queueInfo()
		queue.Visible = pageStates.queueInfo() ~= ""
	end))
	return trash
end
return {
	default = default,
}
