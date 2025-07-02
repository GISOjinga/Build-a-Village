-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local deepEquals = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepEquals
local printJecs = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions").printJecs
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local Body = _jecsComponents.Body
local Changed = _jecsComponents.Changed
local Data = _jecsComponents.Data
local Player = _jecsComponents.Player
local TargetEntity = _jecsComponents.TargetEntity
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local default = function(world)
	-- call to fix tools
	local fixTools = function(bodyEntity, dataChange)
		local data = dataChange.new
		local player = data and world:get(bodyEntity, Player)
		local backpack = player and player:FindFirstChild("Backpack")
		-- if the player has a backpack and data is available then
		local _condition = backpack and data
		if _condition then
			local _condition_1 = not dataChange.old
			if not _condition_1 then
				local _exp = data.Villagers
				local _result = dataChange.old
				if _result ~= nil then
					_result = _result.Villagers
				end
				local _condition_2 = _result
				if not _condition_2 then
					_condition_2 = {}
				end
				local _condition_3 = not deepEquals(_exp, _condition_2)
				if not _condition_3 then
					local _exp_1 = data.Produce
					local _result_1 = dataChange.old
					if _result_1 ~= nil then
						_result_1 = _result_1.Produce
					end
					local _condition_4 = _result_1
					if not _condition_4 then
						_condition_4 = {}
					end
					_condition_3 = not deepEquals(_exp_1, _condition_4)
				end
				_condition_1 = _condition_3
			end
			_condition = _condition_1
		end
		if _condition then
			local body = data and world:get(bodyEntity, Body)
			local _condition_1 = backpack and body
			if _condition_1 then
				local _array = {}
				local _length = #_array
				local _array_1 = backpack:GetChildren()
				local _Length = #_array_1
				table.move(_array_1, 1, _Length, _length + 1, _array)
				_length += _Length
				local _array_2 = body.model:GetChildren()
				table.move(_array_2, 1, #_array_2, _length + 1, _array)
				-- ▼ ReadonlyArray.filter ▼
				local _newValue = {}
				local _callback = function(v)
					return v:IsA("Tool")
				end
				local _length_1 = 0
				for _k, _v in _array do
					if _callback(_v, _k - 1, _array) == true then
						_length_1 += 1
						_newValue[_length_1] = _v
					end
				end
				-- ▲ ReadonlyArray.filter ▲
				-- ▼ ReadonlyArray.filterUndefined ▼
				local _length_2 = 0
				for _i in _newValue do
					if _i > _length_2 then
						_length_2 = _i
					end
				end
				local _result = {}
				local _resultLength = 0
				for _i = 1, _length_2 do
					local _v = _newValue[_i]
					if _v ~= nil then
						_resultLength += 1
						_result[_resultLength] = _v
					end
				end
				-- ▲ ReadonlyArray.filterUndefined ▲
				_condition_1 = _result
			end
			local alltools = _condition_1
			if alltools then
				local digTool = Instance.new("Tool")
				-- deletes all tools
				-- ▼ ReadonlyArray.forEach ▼
				local _callback = function(tool)
					return tool:Destroy()
				end
				for _k, _v in alltools do
					_callback(_v, _k - 1, alltools)
				end
				-- ▲ ReadonlyArray.forEach ▲
				-- sets up the dig tool
				printJecs(34, "Adding Dig Tool to Backpack")
				digTool.Name = "Dig Tool"
				digTool:SetAttribute("ItemType", "DigTool")
				digTool:SetAttribute("ItemName", "DigTool")
				digTool.RequiresHandle = false
				digTool.Parent = backpack
				-- adds all the villager tools
				local _exp = data.Villagers
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_1 = function(villagerData)
					if villagerData.RelativeLocation then
						return nil
					end
					local villagerName = villagerData.Name
					local tool = Instance.new("Tool")
					-- set up and parenting
					tool.RequiresHandle = false
					tool.Name = villagerName
					tool:SetAttribute("ItemType", "Villager")
					tool:SetAttribute("ItemName", villagerName)
					tool:SetAttribute("UniqueId", villagerData.UniqueId)
					tool.Parent = backpack
					-- when the tool is activated
					tool.Activated:Connect(function()
						-- printTS($line, "Activated")
					end)
				end
				for _k, _v in _exp do
					_callback_1(_v, _k - 1, _exp)
				end
				-- ▲ ReadonlyArray.forEach ▲
				-- for all produce
				local _exp_1 = data.Produce
				-- ▼ ReadonlyArray.forEach ▼
				local _callback_2 = function(produceData)
					local produceName = produceData.Name
					local realTool = paths.Assets.Tools.Produce:FindFirstChild(produceName)
					local tool = if realTool then realTool:Clone() else Instance.new("Tool")
					local _variantParticles = paths.Assets.Particles:FindFirstChild(produceData.Variant)
					if _variantParticles ~= nil then
						_variantParticles = _variantParticles:Clone()
					end
					local variantParticles = _variantParticles
					local partToplaceIn = tool:FindFirstChildOfClass("Part")
					-- set up and parenting
					tool.RequiresHandle = if realTool then realTool.RequiresHandle else false
					tool.Name = `{if produceData.Variant == "Normal" then produceName else produceData.Variant .. " " .. produceName} ({produceData.Amount})`
					tool:SetAttribute("ItemType", "Commodity")
					tool:SetAttribute("ItemVariant", produceData.Variant)
					tool:SetAttribute("ItemName", produceName)
					if variantParticles and partToplaceIn then
						variantParticles.Parent = partToplaceIn
					end
					tool.Parent = backpack
					-- when the tool is activated
					tool.Activated:Connect(function()
						-- printTS($line, "Activated")
					end)
				end
				for _k, _v in _exp_1 do
					_callback_2(_v, _k - 1, _exp_1)
				end
				-- ▲ ReadonlyArray.forEach ▲
			end
		end
	end
	-- if body gets removed then removes data
	for _, bodyEntity in world:query(TargetEntity, Added(Body)) do
		fixTools(bodyEntity, {
			new = world:get(bodyEntity, Data),
		})
	end
	-- when ever data gets updated makes sure the player has all the nesscary tools
	for _, bodyEntity, dataChange in world:query(TargetEntity, Changed(Data)) do
		fixTools(bodyEntity, dataChange)
	end
end
return {
	default = default,
}
