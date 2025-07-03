-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecs = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "jecs")
local Name = _jecs.Name
local OnAdd = _jecs.OnAdd
local OnRemove = _jecs.OnRemove
local OnChange = _jecs.OnChange
local pair = _jecs.pair
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local addedQuery = _jecsComponents.addedQuery
local Changed = _jecsComponents.Changed
local changedQuery = _jecsComponents.changedQuery
local Phases = _jecsComponents.Phases
local Removed = _jecsComponents.Removed
local removedQuery = _jecsComponents.removedQuery
local TargetEntity = _jecsComponents.TargetEntity
local world = _jecsComponents.world
local appendJecs = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "append").appendJecs
local deepCopy = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "object-utils").deepCopy
-- components
local previousValue = {}
-- one time
for comp, name in world:query(Name) do
	if #{ string.find(name, "jecs.") } > 0 or name == "Added" or name == "Removed" or name == "Changed" or name == "Append" then
		continue
	end
	removedQuery[comp] = true
	addedQuery[comp] = true
	changedQuery[comp] = true
end
-- function to create a change save
local function createChangeSave(world, target, comp, oldValue, newValue)
	-- appends the entity into the world
	appendJecs(function()
		local entityChanged = world:entity()
		-- applies the changed component to the entity
		world:set(entityChanged, TargetEntity, target)
		world:set(entityChanged, Changed(comp), {
			old = oldValue,
			new = newValue,
		})
		-- when it comes back full circle: Removed changed entity so it doesn't show twice
		appendJecs(function()
			return world:delete(entityChanged)
		end)
	end)
end
-- function hasChanged(changed: { old: unknown, new: unknown }): boolean {
--     // does a deep comparision telling whats different
--     const oldData = changed.old as Record<string, unknown>
--     const newData = changed.new as Record<string, unknown>
--     const differences = new Array<string>()
--     function recursiveCheck(tabl1: unknown, tabl2: unknown, path = "", differences: string[] = []) {
--         if (typeIs(tabl1, "table") && typeIs(tabl2, "table")) {
--             for (const [key, value1] of pairs(tabl1)) {
--                 const value2 = (tabl2 as Record<string, unknown>)[key as string];
--                 const fullPath = path === "" ? `${key}` : `${path}.${key}`;
--                 if (typeIs(value1, "table") && typeIs(value2, "table")) {
--                     recursiveCheck(value1, value2, fullPath, differences);
--                 } else if (value1 !== value2) {
--                     differences.push(`Changed: ${fullPath} from ${value1} to ${value2}`);
--                 }
--             }
--         } else {
--             // If they are not both tables, we compare directly
--             if (tabl1 !== tabl2) {
--                 differences.push(`Changed: ${path} from ${tabl1} to ${tabl2}`);
--             }
--         }
--         return differences;
--     }
--     recursiveCheck(oldData, newData, "", differences)
--     return differences.size() > 0
-- }
-- for change
local default = {
	phase = Phases.ChangeHook,
	system = function(world)
		-- disconnects all the components
		for comp in world:query(OnAdd) do
			world:remove(comp, OnAdd)
		end
		for comp in world:query(OnRemove) do
			world:remove(comp, OnRemove)
		end
		for comp in world:query(OnChange) do
			world:remove(comp, OnChange)
		end
		-- for all added query
		-- ▼ ReadonlySet.forEach ▼
		local _callback = function(comp)
			world:set(comp, OnAdd, function(entity)
				local pairing = pair(entity, comp)
				local value = world:get(entity, comp)
				local entityAdded = world:entity()
				-- sets the value
				local _arg1 = if type(value) == "table" then deepCopy(value) else value
				previousValue[pairing] = _arg1
				-- append
				appendJecs(function()
					-- applies the added component to the entity && updates the previous value
					world:set(entityAdded, TargetEntity, entity)
					world:set(entityAdded, Added(comp), value)
					createChangeSave(world, entity, comp, nil, value)
					-- when it comes back full circle: Removed added entity so it doesn't show twice
					appendJecs(function()
						return world:delete(entityAdded)
					end)
				end)
			end)
		end
		for _v in addedQuery do
			_callback(_v, _v, addedQuery)
		end
		-- ▲ ReadonlySet.forEach ▲
		-- for all changed query
		-- ▼ ReadonlySet.forEach ▼
		local _callback_1 = function(comp)
			world:set(comp, OnChange, function(entity, comp, newValue)
				local pairing = pair(entity, comp)
				local oldValue = previousValue[pairing]
				-- if (hasChanged({ old: oldValue, new: newValue })) {
				-- sets the new value
				local _newValue = newValue
				local _arg1 = if type(_newValue) == "table" then deepCopy(newValue) else newValue
				previousValue[pairing] = _arg1
				-- calls it
				createChangeSave(world, entity, comp, oldValue, newValue)
				-- }
			end)
		end
		for _v in changedQuery do
			_callback_1(_v, _v, changedQuery)
		end
		-- ▲ ReadonlySet.forEach ▲
		-- for all removed query
		-- ▼ ReadonlySet.forEach ▼
		local _callback_2 = function(comp)
			world:set(comp, OnRemove, function(entity)
				local pairing = pair(entity, comp)
				local oldValue = world:get(entity, comp)
				-- destroys the previous value
				previousValue[pairing] = nil
				-- appends the entity into the world
				appendJecs(function()
					local entityRemoved = world:entity()
					-- applies the removed component to the entity
					world:set(entityRemoved, Removed(comp), oldValue)
					world:set(entityRemoved, TargetEntity, entity)
					createChangeSave(world, entity, comp, oldValue)
					-- when it comes back full circle: Removed removed entity so it doesn't show twice
					appendJecs(function()
						return world:delete(entityRemoved)
					end)
				end)
			end)
		end
		for _v in removedQuery do
			_callback_2(_v, _v, removedQuery)
		end
		-- ▲ ReadonlySet.forEach ▲
		-- clears removed added and changed
		table.clear(removedQuery)
		table.clear(addedQuery)
		table.clear(changedQuery)
	end,
}
return {
	default = default,
}
