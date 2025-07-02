-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local Tracer = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "tracer", "out").Tracer
local routes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "data", "network").routes
local _Plugin_Hook = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "Plugin-Hook")
local useEvent = _Plugin_Hook.useEvent
local useMemo = _Plugin_Hook.useMemo
local useThrottle = _Plugin_Hook.useThrottle
local _jecsHelpFunctions = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "jecsHelpFunctions")
local getEntity = _jecsHelpFunctions.getEntity
local printJecs = _jecsHelpFunctions.printJecs
local Raycast = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "functions", "rayFunctions").Raycast
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Added = _jecsComponents.Added
local Body = _jecsComponents.Body
local TargetEntity = _jecsComponents.TargetEntity
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
-- variables
local player = Players.LocalPlayer
local giftingPrompts = setmetatable({}, {
	__mode = "k",
})
local friendPrompts = setmetatable({}, {
	__mode = "k",
})
local default = function(world)
	local kingIdle = paths.Assets.Animations.Shop.King
	local merchantIdle = paths.Assets.Animations.Shop.Merchant
	local architectIdle = paths.Assets.Animations.Shop.Architect
	local king = paths.Map.Shops.King.Npc
	local merchant = paths.Map.Shops.Merchant.Npc
	local architect = paths.Map.Shops.Architect.Npc
	local kingIdleTrack = useMemo(function()
		return king.Humanoid.Animator:LoadAnimation(kingIdle)
	end, { king })
	local merchantIdleTrack = useMemo(function()
		return merchant.Humanoid.Animator:LoadAnimation(merchantIdle)
	end, { merchant })
	local architectIdleTrack = useMemo(function()
		return architect.Humanoid.Animator:LoadAnimation(architectIdle)
	end, { architect })
	local body = getEntity.bodyFromPlayer(player)
	local equippedTool = body and body.model:FindFirstChildOfClass("Tool")
	-- makes sure animation is playing
	if not kingIdleTrack.IsPlaying or not merchantIdleTrack.IsPlaying or not architectIdleTrack.IsPlaying then
		printJecs(34, "Setting up animations for player: ", player.Name)
		kingIdleTrack:Play()
		merchantIdleTrack:Play()
		architectIdleTrack:Play()
	end
	-- casts a ray down if body and if standing on a platform floor then increase walkspeed on humanoid to 20 else 16 with tracer
	if useThrottle(.1) and body then
		local rootCFrame = body.rootPart.CFrame
		local results = Tracer.ray(rootCFrame.Position, Vector3.yAxis, -6):useRaycastParams(Raycast.Include.Floors):run()
		-- sets the walkspeed
		body.humanoid.WalkSpeed = if results.hit then 16 else 25
	end
	-- loops through all the gifting prompts watching
	-- ▼ ReadonlyMap.forEach ▼
	local _callback = function(prompt, playerToGift)
		local _tooType = equippedTool
		if _tooType ~= nil then
			_tooType = _tooType:GetAttribute("ItemType")
		end
		local tooType = _tooType
		-- toggiles the prompts visibility
		prompt.Enabled = tooType == "Commodity"
		-- watches for the prompt to be activated
		for _binding in useEvent(prompt.Triggered, debug.traceback() .. tostring(playerToGift.UserId)) do
			-- if the player is not the local player, we send a gift request
			if playerToGift ~= Players.LocalPlayer and equippedTool then
				local _exp = playerToGift.Name
				local _result = equippedTool
				if _result ~= nil then
					_result = _result.Name
				end
				printJecs(60, "Gifting to player: ", _exp, " with tool: ", _result)
				routes.giftToPlayer:send({
					playerToGift = playerToGift,
					produceTool = equippedTool,
				})
			end
		end
	end
	for _k, _v in giftingPrompts do
		_callback(_v, _k, giftingPrompts)
	end
	-- ▲ ReadonlyMap.forEach ▲
	-- friendPrompts.forEach((prompt, otherPlayer) => {
	--     prompt.Enabled = true;
	--     for (const [] of useEvent(prompt.Triggered, debug.traceback() + otherPlayer.UserId)) {
	--         if (otherPlayer !== Players.LocalPlayer) {
	--             printJecs($line, "Adding friend: ", otherPlayer.Name);
	--             routes.requestAddFriend.send(otherPlayer);
	--         }
	--     }
	-- })
	-- when a body is added, we add a proximity prompt to it
	for _, clientEntity, body in world:query(TargetEntity, Added(Body)) do
		local giftingPrompt = paths.Assets.ProximityPrompts.GiftingProximityPrompt:Clone()
		-- const friendPrompt = paths.Assets.ProximityPrompts.AddFriend.Clone();
		local player = body and Players:GetPlayerFromCharacter(body.model)
		-- when added it sets the client id property
		local _result = body
		if _result ~= nil then
			_result = _result.model:SetAttribute("ClientId", clientEntity)
		end
		local _result_1 = player
		if _result_1 ~= nil then
			_result_1:SetAttribute("ClientId", clientEntity)
		end
		if player and player ~= Players.LocalPlayer then
			giftingPrompts[player] = giftingPrompt
			-- friendPrompts.set(player, friendPrompt)
			giftingPrompt.Parent = body.rootPart
			-- friendPrompt.Parent = body.rootPart
			-- friendPrompt.ActionText = `Add ${player.Name} as a Friend?`;
		end
	end
end
return {
	default = default,
}
