-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local wallsData = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "wallsData").default
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Changed = _jecsComponents.Changed
local Data = _jecsComponents.Data
local TargetEntity = _jecsComponents.TargetEntity
-- variables
local player = Players.LocalPlayer
local default = function(world)
	-- if data changes then
	for _, clientEntity, changed in world:query(TargetEntity, Changed(Data)) do
		local data = changed.new
		-- makes a list of walls for sale
		if data then
			-- ▼ ReadonlyArray.map ▼
			local _newValue = table.create(#wallsData)
			local _callback = function(wall)
				local _exp = data.Walls
				-- ▼ ReadonlyArray.find ▼
				local _callback_1 = function(w)
					return w.Name == wall.Name
				end
				local _result
				for _i, _v in _exp do
					if _callback_1(_v, _i - 1, _exp) == true then
						_result = _v
						break
					end
				end
				-- ▲ ReadonlyArray.find ▲
				local _condition = _result
				if not _condition then
					_condition = wall
				end
				local _object = table.clone(_condition)
				setmetatable(_object, nil)
				return _object
			end
			for _k, _v in wallsData do
				_newValue[_k] = _callback(_v, _k - 1, wallsData)
			end
			-- ▲ ReadonlyArray.map ▲
			pageStates.wallsShop(_newValue)
		end
	end
end
return {
	default = default,
}
