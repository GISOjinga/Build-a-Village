-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _bytenet_fixed = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "bytenet-fixed", "out")
local ByteNet = _bytenet_fixed
local defineNamespace = _bytenet_fixed.defineNamespace
local struct = _bytenet_fixed.struct
local bool = _bytenet_fixed.bool
local optional = _bytenet_fixed.optional
local array = _bytenet_fixed.array
local RunService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").RunService
local components = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local byteNetEntityInstance = ByteNet.unknown
-- function to give a jecs component struct
local function componentStruct(data)
	return struct({
		serverEntity = ByteNet.unknown,
		data = optional(data),
	})
end
-- for ui
local definePacket = function(packetProps)
	return if RunService:IsRunning() then ByteNet.definePacket(packetProps) else (function()
		return {
			listen = function() end,
			sendTo = function() end,
			send = function() end,
			sendToAll = function() end,
			sendToAllExcept = function() end,
			sendToList = function() end,
			wait = function() end,
		}
	end)
end
-- export const messaging = MessageEmitter.create<MessageData>();
-- export enum Messages {
--     // components
--     Body,
--     Villager,
--     Data,
--     ModelDebugger,
--     ConfirmationPrompt,
--     // route to get replicated components
--     getReplicatedComponents,
--     deleteReplicatedEntity,
--     jecsSetup,
-- }
-- export interface MessageData {
--     // components
--     [Messages.Body]: Packed<typeof Body>,
--     [Messages.Villager]: Packed<typeof Villager>,
--     [Messages.Data]: Packed<typeof Data>,
--     [Messages.ModelDebugger]: Packed<typeof ModelDebugger>,
--     [Messages.ConfirmationPrompt]: Packed<typeof ConfirmationPrompt>,
--     // messages
--     [Messages.getReplicatedComponents]: undefined;
--     [Messages.deleteReplicatedEntity]: Packed<Entity>;
--     [Messages.jecsSetup]: undefined;
-- }
-- Define namespace and packets
local packets = defineNamespace("gameEvents", function()
	local villagerStruct = ByteNet.struct({
		Name = ByteNet.string,
		UniqueId = ByteNet.unknown,
		RelativeLocation = optional(ByteNet.cframe),
		Progress = struct({
			Produce = ByteNet.string,
			Required = optional(struct({
				Produce = ByteNet.string,
				Amount = ByteNet.unknown,
				Max = ByteNet.unknown,
			})),
			Progression = struct({
				Time = struct({
					RequiredTimePerResource = ByteNet.uint16,
					StartTime = ByteNet.unknown,
				}),
				Resources = array(ByteNet.string),
			}),
			Building = struct({
				StartTime = ByteNet.unknown,
				TotalTime = ByteNet.unknown,
			}),
		}),
	})
	local _object = {
		confirmPrompt = definePacket({
			value = bool,
		}),
		giftToPlayer = definePacket({
			value = struct({
				playerToGift = ByteNet.inst,
				produceTool = ByteNet.inst,
			}),
		}),
		playSound = definePacket({
			value = struct({
				sound = ByteNet.inst,
				position = optional(ByteNet.vec3),
			}),
		}),
		updateRobuxStore = definePacket({
			value = ByteNet.unknown,
		}),
		buyRobuxPack = definePacket({
			value = struct({
				purchase = ByteNet.string,
			}),
		}),
		buyWall = definePacket({
			value = struct({
				wallName = ByteNet.string,
				currency = ByteNet.string,
			}),
		}),
		equipWall = definePacket({
			value = struct({
				wallName = ByteNet.string,
				equip = bool,
			}),
		}),
		togglePage = definePacket({
			value = ByteNet.string,
		}),
		toggleSellMenuOpen = definePacket({
			value = ByteNet.bool,
		}),
		confirmSellOptions = definePacket({
			value = ByteNet.string,
		}),
		notify = definePacket({
			value = struct({
				text = ByteNet.string,
				duration = ByteNet.uint8,
			}),
		}),
		npcDialogue = definePacket({
			value = struct({
				target = ByteNet.string,
				text = ByteNet.string,
			}),
		}),
		updateFriendsBonus = definePacket({
			value = ByteNet.bool,
		}),
		sendFriendRequest = definePacket({
			value = ByteNet.inst,
		}),
		redeemPromo = definePacket({
			value = ByteNet.string,
		}),
		promoResult = definePacket({
			value = struct({
				success = bool,
				message = ByteNet.string,
			}),
		}),
		shopGiftTo = definePacket({
			value = ByteNet.inst,
		}),
		placeVillager = definePacket({
			value = ByteNet.cframe,
		}),
		digVillager = definePacket({
			value = ByteNet.unknown,
		}),
		collectVillagerProduce = definePacket({
			value = struct({
				villagerEntity = ByteNet.unknown,
				resourceModelName = ByteNet.string,
			}),
		}),
		supplyVillager = definePacket({
			value = ByteNet.unknown,
		}),
		buyVillager = definePacket({
			value = struct({
				villagerIndex = ByteNet.int16,
				currency = ByteNet.string,
			}),
		}),
		updateRestockTime = definePacket({
			value = ByteNet.uint32,
		}),
		updateVillagersShop = definePacket({
			value = ByteNet.unknown,
		}),
		teleportToVillage = definePacket({
			value = ByteNet.nothing,
		}),
		teleportToShop = definePacket({
			value = ByteNet.string,
		}),
		getReplicatedComponents = definePacket({
			value = ByteNet.nothing,
		}),
		deleteReplicatedEntity = definePacket({
			value = ByteNet.unknown,
		}),
		jecsSetup = definePacket({
			value = ByteNet.nothing,
		}),
	}
	for _k, _v in {
		Body = definePacket({
			value = componentStruct(struct({
				model = byteNetEntityInstance,
				head = byteNetEntityInstance,
				humanoid = byteNetEntityInstance,
				rootPart = byteNetEntityInstance,
				animator = byteNetEntityInstance,
				rootAttachment = byteNetEntityInstance,
				platform = optional(byteNetEntityInstance),
			})),
		}),
		Villager = definePacket({
			value = componentStruct(struct({
				villagerModel = byteNetEntityInstance,
				playerEntity = ByteNet.unknown,
				villagerData = villagerStruct,
			})),
		}),
		Data = definePacket({
			value = componentStruct(struct({
				Version = ByteNet.string,
				Coins = ByteNet.uint32,
				Villagers = array(villagerStruct),
				PromoCodesRedeemed = array(ByteNet.string),
				Tutorial = ByteNet.unknown,
				Produce = array(struct({
					Name = ByteNet.string,
					Amount = ByteNet.unknown,
					Variant = ByteNet.string,
				})),
				Walls = array(struct({
					Name = ByteNet.string,
					Description = ByteNet.string,
					Image = ByteNet.string,
					Price = ByteNet.unknown,
					GamePassId = ByteNet.unknown,
					CashMultiplier = ByteNet.unknown,
					Rarity = ByteNet.string,
					Owned = bool,
					Equipped = bool,
				})),
			})),
		}),
		ConfirmationPrompt = definePacket({
			value = componentStruct(struct({
				title = ByteNet.string,
				message = ByteNet.string,
				confirmation = optional(ByteNet.bool),
				onConfirm = ByteNet.unknown,
				onDecline = optional(ByteNet.unknown),
			})),
		}),
		ModelDebugger = definePacket({
			value = componentStruct(byteNetEntityInstance),
		}),
	} do
		_object[_k] = _v
	end
	_object.replicatePlayerState = definePacket({
		value = struct({
			serverEntity = ByteNet.unknown,
			data = ByteNet.unknown,
		}),
	})
	return _object
end)
local routes = {}
-- loops through routes and makes a signal
for key, packet in pairs(packets) do
	local toBeCalled = {}
	local routeFaked = routes
	-- adds the fake route
	routeFaked[key] = {
		wait = packet.wait,
		send = packet.send,
		sendToAll = packet.sendToAll,
		sendTo = packet.sendTo,
		sendToList = packet.sendToList,
		sendToAllExcept = packet.sendToAllExcept,
		listen = function(callback)
			local _callback = callback
			toBeCalled[_callback] = true
			return function()
				local _callback_1 = callback
				-- ▼ Set.delete ▼
				local _valueExisted = toBeCalled[_callback_1] ~= nil
				toBeCalled[_callback_1] = nil
				-- ▲ Set.delete ▲
				return _valueExisted
			end
		end,
	}
	-- the actual listner
	packet.listen(function(...)
		local T = { ... }
		-- if (RunService.IsClient()) print("Recieved", key, T, toBeCalled)
		-- ▼ ReadonlySet.forEach ▼
		local _callback = function(callback)
			return callback(unpack(T))
		end
		for _v in toBeCalled do
			_callback(_v, _v, toBeCalled)
		end
		-- ▲ ReadonlySet.forEach ▲
	end)
end
return {
	routes = routes,
}
