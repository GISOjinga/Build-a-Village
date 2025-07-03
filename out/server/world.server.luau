-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local setupMatter = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsSetup").setupMatter
local modelDebugger = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "modelDebugger").default
local loadAnimations = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "animator", "loadAnimations").default
local setAnimation = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "animator", "setAnimation").default
local disableAutoRotate = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "body", "disableAutoRotate").default
local commanderServer = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "commands", "commanderServer").default
local updateCooldown = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "cooldown", "updateCountDown").default
local loadCharacter = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "loadCharacter").default
local loadPlayerData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "loadPlayerData").default
local savePlayerData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "savePlayerData").default
local updateData = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "data", "updateData").default
local updateMovers = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "movers", "updateMovers").default
local updateBody = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "body", "updateBody").default
local change = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "change").default
local replicateToClient = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "componentReplication", "replicateToClient").default
local watchRoutes = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "watchRoutes").default
local append = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "append").default
local pending = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "canQuery").default
local platform = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "builds", "platform").default
local villagersShop = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "villagersShop").default
local progressVillagers = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "progressVillagers").default
local placeVillagers = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "placeVillagers").default
local debuggerHook = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "systems", "hooks", "debuggerHook").default
local updateTools = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "villagers", "updateTools").default
local updateWalls = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "walls", "updateWalls").default
local robuxStore = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "robuxStore", "robuxStore").default
local confirmationPrompt = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "confirmationPrompt").default
local promoCodes = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "promotions", "promoCodes").default
local friendRequest = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "player", "friendRequest").default
local friendsBonus = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "promotions", "friendsBonus").default
local updateLeaderboard = TS.import(script, game:GetService("ServerScriptService"), "TS", "systems", "leaderboard", "updateLeaderboard").default
-- sets up matter
setupMatter({ {
	system = loadAnimations,
}, {
	system = setAnimation,
}, {
	system = modelDebugger,
}, {
	system = updateCooldown,
}, {
	system = updateMovers,
}, debuggerHook, replicateToClient, change, watchRoutes, append, pending, {
	system = disableAutoRotate,
}, {
	system = updateBody,
}, {
	system = platform,
}, {
	system = commanderServer,
}, {
	system = updateData,
}, {
	system = updateLeaderboard,
}, {
	system = loadCharacter,
}, {
	system = loadPlayerData,
}, {
	system = savePlayerData,
}, {
	system = confirmationPrompt,
}, {
	system = friendRequest,
}, {
	system = friendsBonus,
}, {
	system = promoCodes,
}, {
	system = robuxStore,
}, {
	system = villagersShop,
}, {
	system = progressVillagers,
}, {
	system = placeVillagers,
}, {
	system = updateTools,
}, {
	system = updateWalls,
} }, {})
-- // * shared
-- { system: modelDebugger, priority: 1 },
-- // cooldown
-- { system: updateCooldown, priority: 1 },
-- // movers
-- { system: addDragEffect, priority: 1 },
-- { system: updateMovers, priority: 1 },
-- // * server
-- // animator
-- { system: loadAnimations, priority: 1 },
-- { system: setAnimation, priority: 1 },
-- // body
-- { system: appearance, priority: 1 },
-- { system: disableAutoRotate, priority: 1 },
-- { system: updateBody, priority: 1 },
-- { system: spawnAtLocation, priority: 1 },
-- { system: updateWalkSpeed, priority: 1 },
-- { system: updateTaijutsuClash, priority: 1 },
-- // combat
-- { system: updateCombat, priority: 3 },
-- { system: updateBlock, priority: 2 },
-- { system: updateGroundM3, priority: 1 },
-- { system: updateRush, priority: 1 },
-- // commands
-- { system: commanderServer, priority: 1 },
-- // data
-- { system: updateData, priority: 1 },
-- // enemies
-- { system: updateEnemies, priority: 1 },
-- // health
-- { system: isAlive, priority: 1 },
-- // justus
-- { system: activateJustus, priority: 1 },
-- { system: handSigns, priority: 1 },
-- { system: lightningJustus, priority: 1 },
-- { system: waterJustus, priority: 1 },
-- { system: earthJustus, priority: 1 },
-- { system: fireJustus, priority: 1 },
-- // mobs
-- { system: addMobSpawners, priority: 1 },
-- { system: updateMobs, priority: 1 },
-- { system: updateMobSpawners, priority: 1 },
-- // movement
-- { system: RecoveryDashingSubstitution, priority: 1 },
-- // player
-- { system: loadCharacter, priority: 1 },
-- { system: loadPlayerData, priority: 1 },
-- { system: savePlayerData, priority: 1 },
-- // projectile
-- { system: castCurvedProjectile, priority: 1 },
-- { system: castLinearProjectile, priority: 1 },
-- { system: projectileAttachments, priority: 1 },
-- // ranks
-- { system: updateRankQueuing, priority: 1 },
-- // servers
-- { system: updateServers, priority: 1 },
-- // status effects
-- { system: updateStamina, priority: 1 },
-- { system: updateStun, priority: -1 },
-- { system: updateDamage, priority: 0 },
-- { system: updateEvasive, priority: -1 },
-- { system: updateExp, priority: 1 },
