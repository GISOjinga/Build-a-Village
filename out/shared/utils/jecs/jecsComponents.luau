-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local exports = {}
local _jecs = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jecs", "jecs")
local Name = _jecs.Name
local pair = _jecs.pair
local World = _jecs.World
local _planck = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "planck", "out")
local Phase = _planck.Phase
local Scheduler = _planck.Scheduler
local HotReloader = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "hot-reloader", "src").HotReloader
local _services = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services")
local RunService = _services.RunService
local Workspace = _services.Workspace
local pageStates = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pageStates").default
-- variables
local world = World.new()
local systemQueue = Scheduler.new(world)
local hotReloader = HotReloader.new()
world:set(Name, Name, "Name")
local component = function(name, defaultValue)
	local theComponent = world:component()
	-- Create a new component with the given name
	world:set(theComponent, Name, name)
	if defaultValue ~= 0 and defaultValue == defaultValue and defaultValue ~= "" and defaultValue then
		world:set(theComponent, theComponent, defaultValue)
	end
	-- returns it
	return theComponent
end
-- types
-- unorginized components
local Route = component("Route")
local ModelDebugger = component("ModelDebugger")
local Destroyed = component("Destroyed")
local MaxedOut = component("MaxedOut")
local Spawned = component("Spawned")
local Trash = component("Trash")
local Debug = component("Debug")
local TargetEntity = component("TargetEntity")
local ReplicatedComponent = component("ReplicatedComponent")
local TargetReplication = component("TargetReplication")
local Platform = component("Platform")
local PlatformOccupied = component("PlatformOccupied")
-- a hook to watch for a route to be called
local RouteEntities = {}
--************** game settinngs **************
-- setting name
local Settings = component("Settings")
exports.SettingsComponents = {}
local createSetting = function(name, defaultValue)
	local theComponent = component(name, defaultValue)
	-- Create a new component with the given name
	world:set(theComponent, Settings, nil)
	-- returns it
	exports.SettingsComponents[name] = theComponent
	return theComponent
end
-- example setting
local ExampleSetting = createSetting("ExampleSetting", 20)
-- hooks
local _changedComponent = component("Changed")
local _addedComponent = component("Added")
local _removedComponent = component("Removed")
local Pending = component("_CanQuery_")
-- for changes
local changedQuery, addedQuery, removedQuery = {}, {}, {}
local Added, Removed
local Changed = function(comp)
	local _comp = comp
	changedQuery[_comp] = true
	Added(comp)
	Removed(comp)
	return pair(_changedComponent, comp)
end
Added = function(comp)
	local _comp = comp
	addedQuery[_comp] = true
	return pair(_addedComponent, comp)
end
Removed = function(comp)
	local _comp = comp
	removedQuery[_comp] = true
	return pair(_removedComponent, comp)
end
local pendingQuery = {}
local CanQuery = function(comp)
	local _comp = comp
	pendingQuery[_comp] = true
	return pair(Pending, comp)
end
--*********************** Player ***********************
-- Player data
local Data = component("Data")
-- update data
local UpdateData = component("UpdateData")
-- Player states
local PlayerState = component("PlayerState")
-- player component
local Player = component("Player")
-- is alive
local Alive = component("Alive")
-- to gift to
local GiftTo = component("GiftTo")
-- take from
local TakeFromVillager = component("TakeFromVillager")
--************** Villagers **************
-- the hover box attachment
local HoverBoxAttachment = component("HoverBoxAttachment", Instance.new("Attachment", Workspace.Terrain))
-- npc dialogue attachment
local NpcDialogueAttachment = component("NpcDialogueAttachment", Instance.new("Attachment", Workspace.Terrain))
-- use to contain the active villagers entity
local ActiveVillagers = component("ActiveVillagers")
-- animator
local VillagerAnimator = component("VillagerAnimator")
-- villager
local Villager = component("Villager")
-- to produce all
local ProduceAll = component("ProduceAll")
--************** Physics **************
-- body turner rotating
local TurnTo = component("TurnTo")
-- Velocity
local Velocity = component("Velocity")
-- makes what ever it is floats
local Float = component("Float")
-- zero out parts velocity
local ZeroOutVelocity = component("ZeroOutVelocity")
-- body mover for velocity
local MoveTo = component("MoveTo")
-- align position to
local AlignPosition = component("AlignPosition")
-- disalbes humanoid auto rotate for a time
local DisableAutoRotate = component("DisableAutoRotate")
-- spawned at spawn
local SpawnedAtSpawn = component("SpawnedAtSpawn")
--************** body **************
-- confirmation prompt
local ConfirmationPrompt = component("ConfirmationPrompt")
-- friends bonus multiplier
local FriendsBonus = component("FriendsBonus")
-- Body components
local AppearanceLoaded = component("AppearanceLoaded")
local NoBodyCollisions = component("NoBodyCollisions")
local Body = component("Body")
-- body hidden
local BodyHidden = component("BodyHidden")
-- walkspeed
local WalkSpeed = component("WalkSpeed")
-- jump height
local JumpHeight = component("JumpHeight")
-- For spawns
local Entities = component("Entities")
-- setting animations
local SetAnimation = component("PlayAnimation")
-- stop all animations
local StopAnimationsExcept = component("StopAnimations")
-- loading animations
local LoadingAnimations = component("LoadingAnimations")
-- loaded animations
local LoadedAnimations = component("LoadedAnimations")
-- producer
local ClientUiStates = component("ClientUiProducer", pageStates)
--****************** counting ******************
-- counts down
local CountDown = component("CountDown")
local DestroyAfterCounting = component("DestroyAfterCounting")
--****************** Attachment ******************
-- an attachment
local Attachment = component("Attach")
-- follows a attachment
local FollowInstance = component("FollowInstance")
--****************** particles ******************
-- emitting particles
local EmitParticles = component("EmitParticles")
-- increases particles size
local IncreaseParticlesSize = component("IncreaseParticleSize")
local componentsToReplicate = {
	Body = Body,
	Villager = Villager,
	Data = Data,
	ModelDebugger = ModelDebugger,
	ConfirmationPrompt = ConfirmationPrompt,
}
-- list of phases in order
local phaseNamesWithOrder = { "PreStartup", "Startup", "PostStartup", "DebuggerHook", "ChangeHook", "AppendHook", "First", "PreUpdate", "Update", "PostUpdate", "Last", "Routes" }
-- creates a phase
-- ▼ ReadonlyArray.reduce ▼
local _result = {}
local _callback = function(acc, phaseName)
	local _condition = Phase[phaseName]
	if not (_condition ~= 0 and _condition == _condition and _condition ~= "" and _condition) then
		_condition = Phase.new(phaseName)
	end
	acc[phaseName] = _condition
	return acc
end
for _i = 1, #phaseNamesWithOrder do
	_result = _callback(_result, phaseNamesWithOrder[_i], _i - 1, phaseNamesWithOrder)
end
-- ▲ ReadonlyArray.reduce ▲
local Phases = _result
-- exports the phases but ordered
-- ▼ ReadonlyArray.reduce ▼
local _result_1 = {}
local _callback_1 = function(acc, phaseName)
	local _acc = acc
	local _arg0 = Phases[phaseName]
	table.insert(_acc, _arg0)
	return acc
end
for _i = 1, #phaseNamesWithOrder do
	_result_1 = _callback_1(_result_1, phaseNamesWithOrder[_i], _i - 1, phaseNamesWithOrder)
end
-- ▲ ReadonlyArray.reduce ▲
local OrderedPhases = _result_1
-- inserts the phases into the system queue
-- ▼ ReadonlyArray.forEach ▼
local _callback_2 = function(phaseName)
	local _value = Phase[phaseName]
	if _value ~= 0 and _value == _value and _value ~= "" and _value then
		systemQueue:insert(Phases[phaseName])
	else
		systemQueue:insert(Phases[phaseName], (if RunService:IsClient() then RunService.RenderStepped else RunService.Stepped))
	end
end
for _k, _v in phaseNamesWithOrder do
	_callback_2(_v, _k - 1, phaseNamesWithOrder)
end
-- ▲ ReadonlyArray.forEach ▲
exports.world = world
exports.systemQueue = systemQueue
exports.hotReloader = hotReloader
exports.Route = Route
exports.ModelDebugger = ModelDebugger
exports.Destroyed = Destroyed
exports.MaxedOut = MaxedOut
exports.Spawned = Spawned
exports.Trash = Trash
exports.Debug = Debug
exports.TargetEntity = TargetEntity
exports.ReplicatedComponent = ReplicatedComponent
exports.TargetReplication = TargetReplication
exports.Platform = Platform
exports.PlatformOccupied = PlatformOccupied
exports.RouteEntities = RouteEntities
exports.Settings = Settings
exports.ExampleSetting = ExampleSetting
exports.Pending = Pending
exports.changedQuery = changedQuery
exports.addedQuery = addedQuery
exports.removedQuery = removedQuery
exports.Changed = Changed
exports.Added = Added
exports.Removed = Removed
exports.pendingQuery = pendingQuery
exports.CanQuery = CanQuery
exports.Data = Data
exports.UpdateData = UpdateData
exports.PlayerState = PlayerState
exports.Player = Player
exports.Alive = Alive
exports.GiftTo = GiftTo
exports.TakeFromVillager = TakeFromVillager
exports.HoverBoxAttachment = HoverBoxAttachment
exports.NpcDialogueAttachment = NpcDialogueAttachment
exports.ActiveVillagers = ActiveVillagers
exports.VillagerAnimator = VillagerAnimator
exports.Villager = Villager
exports.ProduceAll = ProduceAll
exports.TurnTo = TurnTo
exports.Velocity = Velocity
exports.Float = Float
exports.ZeroOutVelocity = ZeroOutVelocity
exports.MoveTo = MoveTo
exports.AlignPosition = AlignPosition
exports.DisableAutoRotate = DisableAutoRotate
exports.SpawnedAtSpawn = SpawnedAtSpawn
exports.ConfirmationPrompt = ConfirmationPrompt
exports.FriendsBonus = FriendsBonus
exports.AppearanceLoaded = AppearanceLoaded
exports.NoBodyCollisions = NoBodyCollisions
exports.Body = Body
exports.BodyHidden = BodyHidden
exports.WalkSpeed = WalkSpeed
exports.JumpHeight = JumpHeight
exports.Entities = Entities
exports.SetAnimation = SetAnimation
exports.StopAnimationsExcept = StopAnimationsExcept
exports.LoadingAnimations = LoadingAnimations
exports.LoadedAnimations = LoadedAnimations
exports.ClientUiStates = ClientUiStates
exports.CountDown = CountDown
exports.DestroyAfterCounting = DestroyAfterCounting
exports.Attachment = Attachment
exports.FollowInstance = FollowInstance
exports.EmitParticles = EmitParticles
exports.IncreaseParticlesSize = IncreaseParticlesSize
exports.componentsToReplicate = componentsToReplicate
exports.Phases = Phases
exports.OrderedPhases = OrderedPhases
return exports
