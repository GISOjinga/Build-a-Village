-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local Players = _services.Players
local ReplicatedStorage = _services.ReplicatedStorage
local RunService = _services.RunService
local Squash = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "squash", "src")
-- Core remote setup
local jingaRemote = ReplicatedStorage:FindFirstChild("JingaRemotes") or (if (RunService:IsClient() and RunService:IsRunning()) then ReplicatedStorage:WaitForChild("JingaRemotes") else (function()
	local inst = Instance.new("RemoteEvent")
	inst.Name = "JingaRemotes"
	inst.Parent = ReplicatedStorage
	return inst
end)())
-- === Primitive Types === //
local optional = function(schema)
	return {
		___JingaNetOptional = true,
		value = schema,
	}
end
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
local compInst = {
	__ByteNetInstancePath = { str },
}
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
	function Network:constructor(name, schema, reliabilityType)
		if reliabilityType == nil then
			reliabilityType = "reliable"
		end
		self.name = name
		self.schema = schema
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
				if name ~= self.name then
					return nil
				end
				local realData = if returnedBuffer ~= 0 and returnedBuffer == returnedBuffer and returnedBuffer ~= "" and returnedBuffer then self:deepDeserialize(returnedBuffer) else returnedBuffer
				-- calls the call back
				callback(realData, player)
			end)
		end
	end
	function Network:deepSerialize(fullData)
		local grandSchema = self.schema
		local function isPlainArraySchema(schema)
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				_condition = #schema > 0
			end
			return _condition
		end
		local function isOptionalSchema(schema)
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				_condition = schema.___JingaNetOptional == true
			end
			return _condition
		end
		local function serialize(schema, data)
			if schema == nothing or schema == unknown or schema == nil then
				return data
			end
			if isOptionalSchema(schema) then
				if data == nil then
					return nil
				end
				return serialize(schema.value, data)
			end
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				_condition = schema.__ByteNetInstancePath ~= nil
			end
			if _condition then
				return data
			end
			if isPlainArraySchema(schema) then
				local elementSchema = schema[1]
				local _data = data
				if not (type(_data) == "table") then
					return {}
				end
				local result = {}
				for _, element in ipairs(data) do
					local _arg0 = serialize(elementSchema, element)
					table.insert(result, _arg0)
				end
				return result
			end
			local _schema_1 = schema
			local _condition_1 = type(_schema_1) == "table"
			if _condition_1 then
				local _data = data
				_condition_1 = type(_data) == "table"
			end
			if _condition_1 then
				local serialized = {}
				for key, value in pairs(data) do
					local childSchema = schema[key]
					serialized[key] = serialize(childSchema, value)
				end
				return serialized
			end
			local _condition_2 = data ~= nil
			if _condition_2 then
				local _schema_2 = schema
				_condition_2 = type(_schema_2) == "table"
			end
			if _condition_2 then
				local cursor = Squash.cursor()
				schema.ser(cursor, data)
				return Squash.tobuffer(cursor)
			end
		end
		return serialize(grandSchema, fullData)
	end
	function Network:deepDeserialize(buffer)
		local cursor = Squash.frombuffer(buffer)
		local schema = self.schema
		local function isPlainArraySchema(schema)
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				_condition = #schema > 0
			end
			return _condition
		end
		local function isOptionalSchema(schema)
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				_condition = schema.___JingaNetOptional == true
			end
			return _condition
		end
		local function deserialize(schema)
			if schema == nothing or schema == unknown or schema == nil then
				return nil
			end
			if isOptionalSchema(schema) then
				return deserialize(schema.value)
			end
			local _schema = schema
			local _condition = type(_schema) == "table"
			if _condition then
				_condition = schema.__ByteNetInstancePath ~= nil
			end
			if _condition then
				return nil
			end
			if isPlainArraySchema(schema) then
				local elementSchema = schema[1]
				local length = uint16.des(cursor)
				local result = {}
				do
					local i = 0
					local _shouldIncrement = false
					while true do
						if _shouldIncrement then
							i += 1
						else
							_shouldIncrement = true
						end
						if not (i < length) then
							break
						end
						result[i + 1] = deserialize(elementSchema)
					end
				end
				return result
			end
			local _schema_1 = schema
			local _condition_1 = type(_schema_1) == "table"
			if _condition_1 then
				local _des = schema.des
				_condition_1 = type(_des) == "function"
			end
			if _condition_1 then
				return schema.des(cursor)
			end
			local _schema_2 = schema
			if type(_schema_2) == "table" then
				local out = {}
				for key, value in pairs(schema) do
					out[key] = deserialize(value)
				end
				return out
			end
			return nil
		end
		return deserialize(schema)
	end
	function Network:sendToAll(data)
		print(data, (self:deepSerialize(data)))
		jingaRemote:FireAllClients(self.name, (self:deepSerialize(data)))
	end
	function Network:sendToAllExcept(data, exception)
		local _exp = Players:GetPlayers()
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(player)
			if player ~= exception then
				jingaRemote:FireClient(player, self.name, (self:deepSerialize(data)))
			end
		end
		for _k, _v in _exp do
			_callback(_v, _k - 1, _exp)
		end
		-- ▲ ReadonlyArray.forEach ▲
	end
	function Network:sendTo(data, player)
		jingaRemote:FireClient(player, self.name, (self:deepSerialize(data)))
	end
	function Network:sendToList(data, players)
		-- print(this.name, "GOT THE DATA", data, Squash.tobuffer(this.cursor), Squash.frombuffer(Squash.tobuffer(this.cursor)), this.packet.des)
		-- ▼ ReadonlyArray.forEach ▼
		local _callback = function(player)
			return jingaRemote:FireClient(player, self.name, (self:deepSerialize(data)))
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
		jingaRemote:FireServer(self.name, (self:deepSerialize(data)))
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
		UniqueId = uint16,
		RelativeLocation = optional(cframe),
		Progress = {
			Produce = str,
			Required = optional({
				Produce = str,
				Amount = uint8,
				Max = uint8,
			}),
			Progression = {
				Time = {
					RequiredTimePerResource = uint16,
					StartTime = uint32,
				},
				Resources = { str },
			},
			Building = {
				StartTime = uint32,
				TotalTime = uint16,
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
			Produce = { {
				Name = str,
				Amount = unknown,
				Variant = str,
			} },
			Tutorial = unknown,
			Walls = { {
				Name = str,
				Description = str,
				Image = str,
				Price = unknown,
				GamePassId = unknown,
				CashMultiplier = unknown,
				Rarity = str,
				Owned = bool,
				Equipped = bool,
			} },
			PromoCodesRedeemed = { str },
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
