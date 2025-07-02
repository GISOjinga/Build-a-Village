-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local _squash = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "squash", "src")
local Squash = _squash
local record = _squash.record
local array = _squash.array
-- Core remote setup
local jingaRemote = ReplicatedStorage:FindFirstChild("JingaRemotes") or (if (RunService:IsClient() and RunService:IsRunning()) then ReplicatedStorage:WaitForChild("JingaRemotes") else (function()
	local inst = Instance.new("RemoteEvent")
	inst.Name = "JingaRemotes"
	inst.Parent = ReplicatedStorage
	return inst
end)())
-- === Base JingaNet Type === //
-- === Primitive Types === //
local optional = Squash.opt
local int8 = Squash.int(1)
local int16 = Squash.int(2)
local int32 = Squash.int(4)
local uint8 = Squash.uint(1)
local uint16 = Squash.uint(2)
local uint32 = Squash.uint(4)
local float32 = Squash.number(4)
local float64 = Squash.number(8)
local str = Squash.string()
local bool = Squash.boolean()
local cframe = Squash.CFrame(Squash.number(4))
local vec3 = Squash.Vector3(Squash.number(4))
local vec2 = Squash.Vector2(Squash.number(4))
local nothing = {
	ser = function() end,
	des = function() end,
}
local unknown = {
	ser = function(idk)
		return idk
	end,
	des = function(idk)
		return idk
	end,
}
local entity = Squash.uint(8)
local inst = record({
	__ByteNetInstancePath = array(str),
})
-- === Remote Type Wrapper (fixed) === //
local Network
do
	Network = setmetatable({}, {
		__tostring = function()
			return "Network"
		end,
	})
	Network.__index = Network
	function Network.new(...)
		local self = setmetatable({}, Network)
		return self:constructor(...) or self
	end
	function Network:constructor(name, packet, reliabilityType)
		if reliabilityType == nil then
			reliabilityType = "reliable"
		end
		self.name = name
		self.packet = packet
		self.reliabilityType = reliabilityType
	end
	function Network:listen(callback)
		if RunService:IsClient() then
			-- Client side, listen to the server event
			return jingaRemote.OnClientEvent:Connect(function(name, returnedBuffer)
				if name ~= self.name then
					return nil
				end
				local realData = nil
				if returnedBuffer ~= 0 and returnedBuffer == returnedBuffer and returnedBuffer ~= "" and returnedBuffer then
					local newCursor = Squash.frombuffer(returnedBuffer)
					realData = self.packet.des(newCursor)
					print(name, "GOT THE DATA", realData, returnedBuffer, newCursor)
				end
				-- calls the call back
				callback(realData, Players.LocalPlayer)
			end)
		else
			return jingaRemote.OnServerEvent:Connect(function(player, name, returnedBuffer)
				print(name)
				if name ~= self.name then
					return nil
				end
				local realData = nil
				if returnedBuffer ~= 0 and returnedBuffer == returnedBuffer and returnedBuffer ~= "" and returnedBuffer then
					local newCursor = Squash.frombuffer(returnedBuffer)
					realData = self.packet.des(newCursor)
					print(name, "GOT THE DATA", realData, returnedBuffer, newCursor)
				end
				-- calls the call back
				print(realData, player)
				callback(realData, player)
			end)
		end
	end
	function Network:searlizeToBuffer(data)
		local cursor = Squash.cursor()
		self.packet.ser(cursor, data)
		return Squash.tobuffer(cursor)
	end
	function Network:sendToAll(data)
		jingaRemote:FireAllClients(self.name, self:searlizeToBuffer(data))
	end
	function Network:sendToAllExcept(data, exception)
		local _exp = Players:GetPlayers()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(player)
			if player ~= exception then
				jingaRemote:FireClient(player, self.name, self:searlizeToBuffer(data))
			end
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	function Network:sendTo(data, player)
		jingaRemote:FireClient(player, self.name, self:searlizeToBuffer(data))
	end
	function Network:sendToList(data, players)
		-- print(this.name, "GOT THE DATA", data, Squash.tobuffer(this.cursor), Squash.frombuffer(Squash.tobuffer(this.cursor)), this.packet.des)
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(player)
			return jingaRemote:FireClient(player, self.name, self:searlizeToBuffer(data))
		end
		for _k, _v in players do
			_callback(_v, _k - 1, players)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	function Network:wait()
		repeat
			do
				local _binding = jingaRemote.OnClientEvent:Wait()
				local name = _binding[1]
				local returnedBuffer = _binding[2]
				-- If the name matches, we can safely deserialize
				if name == self.name then
					local newCursor = Squash.frombuffer(returnedBuffer)
					return self.packet.des(newCursor)
				end
			end
		until not true
	end
	function Network:send(data)
		if data == nil then
			data = nil
		end
		print("Sending", self.name, "with data", data)
		jingaRemote:FireServer(self.name, self:searlizeToBuffer(data))
	end
end
-- === Example Remote Bindings === //
local routes = (function()
	local componentRecord = function(data)
		return record({
			serverEntity = entity,
			data = optional(data),
		})
	end
	local villagerStruct = record({
		Name = str,
		UniqueId = unknown,
		RelativeLocation = optional(cframe),
		Progress = record({
			Produce = str,
			Required = optional(record({
				Produce = str,
				Amount = unknown,
				Max = unknown,
			})),
			Progression = record({
				Time = record({
					RequiredTimePerResource = uint16,
					StartTime = unknown,
				}),
				Resources = array(str),
			}),
			Building = record({
				StartTime = unknown,
				TotalTime = unknown,
			}),
		}),
	})
	local _object = {
		jecsSetup = nothing,
		Jump = record({
			position = record({
				x = float32,
				y = float32,
				z = float32,
			}),
		}),
		buyVillager = record({
			villagerIndex = int16,
			currency = str,
		}),
		placeVillager = cframe,
		digVillager = entity,
		supplyVillager = entity,
		collectVillagerProduce = record({
			villagerEntity = entity,
			resourceModelName = str,
		}),
		teleportToVillage = nothing,
		teleportToShop = str,
		updateRestockTime = uint32,
		updateVillagersShop = unknown,
		redeemPromo = str,
		promoResult = record({
			success = bool,
			message = str,
		}),
		confirmSellOptions = str,
		toggleSellMenuOpen = bool,
		confirmPrompt = bool,
		updateFriendsBonus = bool,
		sendFriendRequest = inst,
		notify = record({
			text = str,
			duration = uint8,
		}),
		npcDialogue = record({
			target = str,
			text = str,
		}),
		buyWall = record({
			wallName = str,
			currency = str,
		}),
		equipWall = record({
			wallName = str,
			equip = bool,
		}),
		togglePage = str,
		giftToPlayer = record({
			playerToGift = inst,
			produceTool = inst,
		}),
		playSound = record({
			sound = inst,
			position = optional(vec3),
		}),
		shopGiftTo = inst,
		updateRobuxStore = unknown,
		buyRobuxPack = record({
			purchase = str,
		}),
		getReplicatedComponents = nothing,
		deleteReplicatedEntity = entity,
	}
	for _k, _v in {
		Body = componentRecord(record({
			model = inst,
			head = inst,
			humanoid = inst,
			rootPart = inst,
			animator = inst,
			rootAttachment = inst,
			platform = optional(inst),
		})),
		Villager = componentRecord(record({
			villagerModel = inst,
			playerEntity = entity,
			villagerData = villagerStruct,
		})),
		Data = componentRecord(record({
			Version = str,
			Coins = uint32,
			Villagers = array(villagerStruct),
			Produce = array(record({
				Name = str,
				Amount = unknown,
				Variant = str,
			})),
			Tutorial = unknown,
			Walls = array(record({
				Name = str,
				Description = str,
				Image = str,
				Price = unknown,
				GamePassId = unknown,
				CashMultiplier = unknown,
				Rarity = str,
				Owned = bool,
				Equipped = bool,
			})),
			PromoCodesRedeemed = array(str),
		})),
		ConfirmationPrompt = componentRecord(record({
			title = str,
			message = str,
			confirmation = optional(bool),
			onConfirm = unknown,
			onDecline = optional(unknown),
		})),
		ModelDebugger = componentRecord(inst),
	} do
		_object[_k] = _v
	end
	local events = _object
	local realRemotes = {}
	for name, packet in pairs(events) do
		realRemotes[name] = Network.new(name, packet, "reliable")
	end
	return realRemotes
end)()
return {
	int8 = int8,
	int16 = int16,
	int32 = int32,
	uint8 = uint8,
	uint16 = uint16,
	uint32 = uint32,
	float32 = float32,
	float64 = float64,
	str = str,
	bool = bool,
	cframe = cframe,
	vec3 = vec3,
	vec2 = vec2,
	nothing = nothing,
	unknown = unknown,
	entity = entity,
	inst = inst,
	Network = Network,
	routes = routes,
}
