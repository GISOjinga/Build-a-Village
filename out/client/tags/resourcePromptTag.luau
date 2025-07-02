-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local Workspace = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Workspace
-- highlights for each platform
local highlight = Instance.new("Highlight", Workspace.Terrain)
-- sets up highlight
highlight.Name = "ResourcePromptHighlight"
highlight.FillTransparency = 1
highlight.OutlineTransparency = 0
highlight.OutlineColor = Color3.new(1, 1, 1)
-- varibles
local default = function(isTagged, resourcePrompt, world)
	local resourcePromptPart = resourcePrompt.Parent
	local _result = resourcePromptPart
	if _result ~= nil then
		_result = _result.Parent
	end
	local model = _result
	if isTagged and resourcePromptPart and model then
		local produceInfo = paths.Assets.UI.ProduceInfo:Clone()
		-- parents it to the resource prompt
		produceInfo.Enabled = false
		produceInfo.Adornee = resourcePromptPart
		produceInfo.Parent = resourcePromptPart
		-- when the prompt is activated
		resourcePrompt.PromptShown:Connect(function()
			task.wait()
			local produceName = model:GetAttribute("ProduceName")
			local produceVariant = model:GetAttribute("Variant")
			-- sets up the ui
			local _exp = produceInfo.Frame.ProduceName:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback = function(child)
				if child:IsA("UIGradient") then
					child.Enabled = child.Name == produceVariant
				end
			end
			for _k, _v in _exp do
				_callback(_v, _k - 1, _exp)
			end
			-- ▲ ReadonlyArray.forEach ▲
			local _exp_1 = produceInfo.Frame.Rarity:GetChildren()
			-- ▼ ReadonlyArray.forEach ▼
			local _callback_1 = function(child)
				if child:IsA("UIGradient") then
					child.Enabled = child.Name == produceVariant
				end
			end
			for _k, _v in _exp_1 do
				_callback_1(_v, _k - 1, _exp_1)
			end
			-- ▲ ReadonlyArray.forEach ▲
			produceInfo.Frame.ProduceName.Visible = true
			produceInfo.Frame.Rarity.Visible = produceVariant == "Gold" or produceVariant == "Rainbow"
			produceInfo.Frame.ProduceName.Text = produceName
			produceInfo.Frame.Rarity.Text = produceVariant
			produceInfo.Enabled = true
			highlight.Adornee = model
		end)
		-- when the prompt is hidden
		resourcePrompt.PromptHidden:Connect(function()
			produceInfo.Enabled = false
			highlight.Adornee = nil
		end)
	end
end
return {
	default = default,
}
