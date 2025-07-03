-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local setupMatter = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsSetup").setupMatter
local ContextActionService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").ContextActionService
local modelDebugger = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "modelDebugger").default
local commandarClient = TS.import(script, script.Parent, "systems", "commands", "commandarClient").default
local emitParticles = TS.import(script, script.Parent, "systems", "particles", "emitParticles").default
local updateCooldown = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "cooldown", "updateCountDown").default
local increaseParticlesSize = TS.import(script, script.Parent, "systems", "particles", "increaseParticlesSize").default
local followInstance = TS.import(script, script.Parent, "systems", "physics", "followInstance").default
local updateMovers = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "movers", "updateMovers").default
local jabby = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "jabby", "out")
local change = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "change").default
local recieveFromServer = TS.import(script, script.Parent, "systems", "componentReplication", "recieveFromServer").default
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local watchRoutes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "watchRoutes").default
local append = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "append").default
local pending = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "canQuery").default
local bodyUpdate = TS.import(script, script.Parent, "systems", "body", "bodyUpdate").default
local setAnimation = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "animator", "setAnimation").default
local loadAnimations = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "animator", "loadAnimations").default
local exampleTag = TS.import(script, script.Parent, "tags", "exampleTag").default
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local GameUI = TS.import(script, script.Parent, "app", "GameUI").default
local pagePaths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "Animations", "pagePaths").default
local updateTools = TS.import(script, script.Parent, "systems", "player", "updateTools").default
local DialogueSellUI = TS.import(script, script.Parent, "app", "DialogueSellUI").default
local HoverBoxUI = TS.import(script, script.Parent, "app", "HoverBoxUI").default
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local HoverBoxAttachment = _jecsComponents.HoverBoxAttachment
local world = _jecsComponents.world
local hoverBoxUpdate = TS.import(script, script.Parent, "systems", "ui", "hoverBoxUpdate").default
local playerDataUpdate = TS.import(script, script.Parent, "systems", "ui", "playerDataUpdate").default
local shopDataUpdate = TS.import(script, script.Parent, "systems", "ui", "shopDataUpdate").default
local debuggerHook = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "debuggerHook").default
local NpcDialogue = TS.import(script, script.Parent, "app", "NpcDialogue").default
local updateWallsForSale = TS.import(script, script.Parent, "systems", "ui", "updateWallsForSale").default
local gameMusic = TS.import(script, script.Parent, "systems", "sounds", "gameMusic").default
local generalSounds = TS.import(script, script.Parent, "systems", "sounds", "generalSounds").default
local resourcePromptTag = TS.import(script, script.Parent, "tags", "resourcePromptTag").default
local confirmationPrompt = TS.import(script, script.Parent, "systems", "ui", "confirmationPrompt").default
local promotions = TS.import(script, script.Parent, "systems", "ui", "promotions").default
local tutorial = TS.import(script, script.Parent, "systems", "tutorial", "tutorial").default
local promptHandlers = TS.import(script, script.Parent, "systems", "villagers", "promptHandlers").default
local visibility = TS.import(script, script.Parent, "systems", "villagers", "visibility").default
if not game:IsLoaded() then
	game.Loaded:Wait()
end
-- variables for the ui
local playerGui = Players.LocalPlayer:WaitForChild("PlayerGui")
local dialogueSellUI = paths.Assets.UI.DialogueSell:Clone()
local hoverBoxUI = paths.Assets.UI.HoverBox:Clone()
local gameUI = paths.Assets.UI.GameUI:Clone()
local npcDialogues = paths.Assets.UI.NpcDialogues:Clone()
-- set up the UI
gameUI.Parent = playerGui
GameUI(pagePaths(gameUI))
-- sets up dialogue sell
dialogueSellUI.Parent = playerGui
dialogueSellUI.Adornee = paths.Map.Shops:WaitForChild("Merchant"):WaitForChild("TalkBox")
DialogueSellUI(dialogueSellUI)
-- sets up hover box
hoverBoxUI.Parent = playerGui
hoverBoxUI.Adornee = world:get(HoverBoxAttachment, HoverBoxAttachment)
HoverBoxUI(hoverBoxUI)
-- sets up the npc dialogues
npcDialogues.Parent = playerGui
NpcDialogue(npcDialogues)
-- hotReloader.scan(script.Parent!, (context) => { }, (context) => { });
-- sets up matter
local debug = setupMatter({ {
	system = loadAnimations,
}, {
	system = setAnimation,
}, {
	system = modelDebugger,
}, {
	system = updateCooldown,
}, {
	system = updateMovers,
}, debuggerHook, recieveFromServer, change, watchRoutes, append, pending, {
	system = bodyUpdate,
}, {
	system = commandarClient,
}, {
	system = followInstance,
}, {
	system = emitParticles,
}, {
	system = increaseParticlesSize,
}, {
	system = updateTools,
}, {
	system = gameMusic,
}, {
	system = generalSounds,
}, {
	system = hoverBoxUpdate,
}, {
	system = playerDataUpdate,
}, {
	system = shopDataUpdate,
}, {
	system = updateWallsForSale,
}, {
	system = tutorial,
}, {
	system = confirmationPrompt,
}, {
	system = promotions,
}, {
	system = visibility,
}, {
	system = promptHandlers,
} }, {
	exampleTag = exampleTag,
	resourcePromptTag = resourcePromptTag,
})
local client = jabby.obtain_client()
ContextActionService:BindAction("Open Jabby Home", function(actionName, state)
	if state ~= Enum.UserInputState.Begin then
		return nil
	end
	if Players.LocalPlayer:GetRankInGroup(36086761) >= 254 or Players.LocalPlayer.UserId < 0 then
		client.spawn_app(client.apps.home)
	end
end, false, Enum.KeyCode.F4)
