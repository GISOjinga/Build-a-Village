-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local promoCodes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "promoCodes").default
local useRoute = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook", "hooks", "use-route").useRoute
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local createEntity = _jecsHelpFunctions.createEntity
local getEntity = _jecsHelpFunctions.getEntity
local default = function(world)
	useRoute(routes.redeemPromo, function(code, player)
		local reward = promoCodes[string.lower(code)]
		local playerEntity = getEntity.fromInstance(player)
		if not (playerEntity ~= 0 and playerEntity == playerEntity and playerEntity) or not reward then
			routes.promoResult.sendTo({
				success = false,
				message = "Invalid code",
			}, player)
			return nil
		end
		local _value = reward.coins
		if _value ~= 0 and _value == _value and _value then
			createEntity.updateData(playerEntity, function(oldData)
				local _exp = oldData.PromoCodesRedeemed
				-- ▼ ReadonlyArray.find ▼
				local _callback = function(c)
					return c == code
				end
				local _result
				for _i, _v in _exp do
					if _callback(_v, _i - 1, _exp) == true then
						_result = _v
						break
					end
				end
				-- ▲ ReadonlyArray.find ▲
				if _result ~= "" and _result then
					routes.promoResult.sendTo({
						success = false,
						message = "Code already redeemed",
					}, player)
					return oldData
				else
					routes.promoResult.sendTo({
						success = true,
						message = `${reward.coins} redeemed`,
					}, player)
					local _promoCodesRedeemed = oldData.PromoCodesRedeemed
					local _code = code
					table.insert(_promoCodesRedeemed, _code)
					oldData.Coins += math.floor(reward.coins + .5)
					return oldData
				end
			end)
		end
		-- else if (reward.item) {
		--     routes.promoResult.sendTo({ success: true, message: `${reward.item} redeemed` }, player);
		-- }
	end)
end
return {
	default = default,
}
