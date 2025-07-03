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
local entity = unknown
local instance = unknown
local compInst = record({
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
					realData = self:deepDeserialize(returnedBuffer)
					print(name, "GOT THE DATA", realData, returnedBuffer)
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
					realData = self:deepDeserialize(returnedBuffer)
					print(name, "GOT THE DATA", realData, returnedBuffer)
				end
				-- calls the call back
				print(realData, player)
				callback(realData, player)
			end)
		end
	end
	function Network:serializeToBuffer(data)
		return self:deepSerialize(data)
	end
	function Network:deepSerialize(data)
		local cursor = Squash.cursor()
		local serialize
		serialize = function(schema, value)
			-- If schema is a SerDes table, use it directly
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				local _arg0 = schema["ser" + 1]
				_condition = type(_arg0) == "function"
			end
			if _condition then
				schema.ser(cursor, value)
				return nil
			end
			-- For tables without a direct serializer, recurse into each key
			local _schema_1 = schema
			local _condition_1 = type(_schema_1) == "table"
			if _condition_1 then
				local _value = value
				_condition_1 = type(_value) == "table"
			end
			if _condition_1 then
				local serField = schema["ser" + 1]
				-- Dynamic array support when schema describes an array shape
				if not (type(serField) == "function") and schema[2] ~= nil then
					local arr = value
					uint16.ser(cursor, #arr)
					for _, v in arr do
						serialize(schema[2], v)
					end
				else
					for key, child in pairs(schema) do
						serialize(child, value[key + 1])
					end
				end
				return nil
			end
			-- Fallback for primitives/undefined
			local _schema_2 = schema
			local _condition_2 = type(_schema_2) == "table"
			if _condition_2 then
				local _arg0 = schema["des" + 1]
				_condition_2 = type(_arg0) == "function"
			end
			if _condition_2 then
				schema.ser(cursor, value)
			end
		end
		serialize(self.packet, data)
		return Squash.tobuffer(cursor)
	end
	function Network:deepDeserialize(buffer)
		local cursor = Squash.frombuffer(buffer)
		local deserialize
		deserialize = function(schema)
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				local _arg0 = schema["des" + 1]
				_condition = type(_arg0) == "function"
			end
			if _condition then
				return schema.des(cursor)
			end
			local _schema_1 = schema
			if type(_schema_1) == "table" then
				local desField = schema["des" + 1]
				if not (type(desField) == "function") and schema[2] ~= nil then
					local arrLength = uint16.des(cursor)
					local arr = {}
					do
						local i = 1
						local _shouldIncrement = false
						while true do
							if _shouldIncrement then
								i += 1
							else
								_shouldIncrement = true
							end
							if not (i <= arrLength) then
								break
							end
							arr[i] = deserialize(schema[2])
						end
					end
					return arr
				else
					local out = {}
					for key, child in pairs(schema) do
						out[key] = deserialize(child)
					end
					return out
				end
			end
			return nil
		end
		return deserialize(self.packet)
	end
	function Network:sendToAll(data)
		jingaRemote:FireAllClients(self.name, self:serializeToBuffer(data))
	end
	function Network:sendToAllExcept(data, exception)
		local _exp = Players:GetPlayers()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(player)
			if player ~= exception then
				jingaRemote:FireClient(player, self.name, self:serializeToBuffer(data))
			end
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	function Network:sendTo(data, player)
		jingaRemote:FireClient(player, self.name, self:serializeToBuffer(data))
	end
	function Network:sendToList(data, players)
		-- print(this.name, "GOT THE DATA", data, Squash.tobuffer(this.cursor), Squash.frombuffer(Squash.tobuffer(this.cursor)), this.packet.des)
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(player)
			return jingaRemote:FireClient(player, self.name, self:serializeToBuffer(data))
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
					return self:deepDeserialize(returnedBuffer)
				end
			end
		until not true
	end
	function Network:send(data)
		if data == nil then
			data = nil
		end
		print("Sending", self.name, "with data", data)
		jingaRemote:FireServer(self.name, self:serializeToBuffer(data))
	end
end
local sharedRoutes = (function()
	local componentRecord = function(data)
		return {
			serverEntity = entity,
			data = optional(data),
		}
	end
	local villagerStruct = {
		Name = str,
		UniqueId = unknown,
		RelativeLocation = optional(cframe),
		Progress = {
			Produce = str,
			Required = optional({
				Produce = str,
				Amount = unknown,
				Max = unknown,
			}),
			Progression = {
				Time = {
					RequiredTimePerResource = uint16,
					StartTime = unknown,
				},
				Resources = array(str),
			},
			Building = {
				StartTime = unknown,
				TotalTime = unknown,
			},
		},
	}
	local componentRoutes = {
		Body = componentRecord({
			model = compInst,
			head = compInst,
			humanoid = compInst,
			rootPart = compInst,
			animator = compInst,
			rootAttachment = compInst,
			platform = optional(compInst),
		}),
		Villager = componentRecord({
			villagerModel = compInst,
			playerEntity = entity,
			villagerData = villagerStruct,
		}),
		Data = componentRecord({
			Version = str,
			Coins = uint32,
			Villagers = { villagerStruct },
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
		}),
		ModelDebugger = componentRecord(compInst),
		ConfirmationPrompt = componentRecord({
			title = str,
			message = str,
			confirmation = optional(bool),
			onConfirm = unknown,
			onDecline = nil,
		}),
	}
	-- real routes
	local realRoutes = {
		jecsSetup = nothing,
		buyVillager = {
			villagerIndex = int16,
			currency = str,
		},
		placeVillager = cframe,
		digVillager = entity,
		supplyVillager = entity,
		collectVillagerProduce = {
			villagerEntity = entity,
			resourceModelName = str,
		},
		teleportToVillage = nothing,
		teleportToShop = str,
		updateRestockTime = uint32,
		updateVillagersShop = unknown,
		redeemPromo = str,
		promoResult = {
			success = bool,
			message = str,
		},
		confirmSellOptions = str,
		toggleSellMenuOpen = bool,
		confirmPrompt = bool,
		updateFriendsBonus = bool,
		sendFriendRequest = instance,
		notify = {
			text = str,
			duration = uint8,
		},
		npcDialogue = {
			target = str,
			text = str,
		},
		buyWall = {
			wallName = str,
			currency = str,
		},
		equipWall = {
			wallName = str,
			equip = bool,
		},
		togglePage = str,
		giftToPlayer = {
			playerToGift = instance,
			produceTool = instance,
		},
		playSound = {
			sound = instance,
			position = optional(vec3),
		},
		shopGiftTo = instance,
		updateRobuxStore = unknown,
		buyRobuxPack = {
			purchase = str,
		},
		getReplicatedComponents = nothing,
		deleteReplicatedEntity = entity,
	}
	-- transforms the routes into a network component
	local routes = {}
	for name, packet in pairs(realRoutes) do
		routes[name] = Network.new(name, packet, "reliable")
	end
	for name, packet in pairs(componentRoutes) do
		routes[name] = Network.new(name, packet, "reliable")
	end
	return routes
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
	instance = instance,
	compInst = compInst,
	Network = Network,
	sharedRoutes = sharedRoutes,
}
