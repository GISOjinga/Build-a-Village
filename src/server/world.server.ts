import { setupMatter } from "shared/utils/jecs/jecsSetup";
import modelDebugger from "shared/systems/modelDebugger";
import loadAnimations from "../shared/systems/animator/loadAnimations";
import setAnimation from "../shared/systems/animator/setAnimation";
import disableAutoRotate from "./systems/body/disableAutoRotate";
import commanderServer from "./systems/commands/commanderServer";
import updateCooldown from "shared/systems/cooldown/updateCountDown";
import loadCharacter from "./systems/player/loadCharacter";
import loadPlayerData from "./systems/player/loadPlayerData";
import savePlayerData from "./systems/player/savePlayerData";
import updateData from "./systems/data/updateData";
import updateMovers from "shared/systems/movers/updateMovers";
import updateBody from "./systems/body/updateBody";
import change from "shared/systems/hooks/change";
import { Phases, systemQueue } from "shared/utils/jecs/jecsComponents";
import replicateToClient from "./systems/componentReplication/replicateToClient";
import watchRoutes from "shared/systems/hooks/watchRoutes";
import append from "shared/systems/hooks/append";
import pending from "shared/systems/hooks/canQuery";
import platform from "./systems/builds/platform";
import villagersShop from "./systems/villagers/villagersShop";
import villagerProducts from "./systems/villagers/villagerProducts";
import progressVillagers from "./systems/villagers/progressVillagers";
import placeVillagers from "./systems/villagers/placeVillagers";
import debuggerHook from "shared/systems/hooks/debuggerHook";
import updateTools from "./systems/villagers/updateTools";
import equipTool from "./systems/player/equipTool";
import updateWalls from "./systems/walls/updateWalls";
import robuxStore from "./systems/robuxStore/robuxStore";
import sketchyGacha from "./systems/gacha/sketchyGacha";
import confirmationPrompt from "./systems/player/confirmationPrompt";
import promoCodes from "./systems/promotions/promoCodes";
import friendRequest from "./systems/player/friendRequest";
import friendsBonus from "./systems/promotions/friendsBonus";
import freeRewardChest from "./systems/promotions/freeRewardChest";
import updateLeaderboard from "./systems/leaderboard/updateLeaderboard";
import dailyQuests from "./systems/dailyEvents/dailyQuests";
import dailyRewards from "./systems/dailyEvents/dailyRewards";
import villageBadges from "./systems/badges/villageBadges";
import supportReminders from "./systems/notifications/supportReminders";



// sets up matter
setupMatter([
    // * shared

    // animator
    { system: loadAnimations },
    { system: setAnimation },

    // debugger
    { system: modelDebugger, },

    // cooldown
    { system: updateCooldown },

    // movers
    { system: updateMovers },

    // hooks
    debuggerHook,
    replicateToClient,
    change,
    watchRoutes,
    append,
    pending,

    // * server

    // body
    { system: disableAutoRotate },
    { system: updateBody },

    // builds
    { system: platform },

    // commands
    { system: commanderServer },

    // daily events
    { system: dailyQuests },
    { system: dailyRewards },

    // data
    { system: updateData },

    // leader board
    { system: updateLeaderboard },

    // player
    { system: loadCharacter },
    { system: loadPlayerData },
    { system: savePlayerData },
    { system: confirmationPrompt },
    { system: friendRequest },
    { system: friendsBonus },
    { system: promoCodes },
    { system: freeRewardChest },
    { system: villageBadges },
    { system: supportReminders },

    // robux store
    { system: robuxStore },
    { system: sketchyGacha },

    // villagers
    { system: villagersShop },
    { system: progressVillagers },
    { system: placeVillagers },
    { system: villagerProducts },
    { system: updateTools },
    { system: equipTool },

    // walls
    { system: updateWalls },
], { // tag added
    // "TouchToAddSkin": touchToAddSkinTag,
    // "TouchToAddPower": touchToAddPowerTag,
    // "TouchToAddRandomStats": touchToAddRandomStatsTag,
    // "MobSpawn": mobSpawnTag,
})


// // * shared
// { system: modelDebugger, priority: 1 },

// // cooldown
// { system: updateCooldown, priority: 1 },

// // movers
// { system: addDragEffect, priority: 1 },
// { system: updateMovers, priority: 1 },

// // * server

// // animator
// { system: loadAnimations, priority: 1 },
// { system: setAnimation, priority: 1 },

// // body
// { system: appearance, priority: 1 },
// { system: disableAutoRotate, priority: 1 },
// { system: updateBody, priority: 1 },
// { system: spawnAtLocation, priority: 1 },
// { system: updateWalkSpeed, priority: 1 },
// { system: updateTaijutsuClash, priority: 1 },

// // combat
// { system: updateCombat, priority: 3 },
// { system: updateBlock, priority: 2 },
// { system: updateGroundM3, priority: 1 },
// { system: updateRush, priority: 1 },

// // commands
// { system: commanderServer, priority: 1 },

// // data
// { system: updateData, priority: 1 },

// // enemies
// { system: updateEnemies, priority: 1 },

// // health
// { system: isAlive, priority: 1 },

// // justus
// { system: activateJustus, priority: 1 },
// { system: handSigns, priority: 1 },
// { system: lightningJustus, priority: 1 },
// { system: waterJustus, priority: 1 },
// { system: earthJustus, priority: 1 },
// { system: fireJustus, priority: 1 },

// // mobs
// { system: addMobSpawners, priority: 1 },
// { system: updateMobs, priority: 1 },
// { system: updateMobSpawners, priority: 1 },

// // movement
// { system: RecoveryDashingSubstitution, priority: 1 },

// // player
// { system: loadCharacter, priority: 1 },
// { system: loadPlayerData, priority: 1 },
// { system: savePlayerData, priority: 1 },

// // projectile
// { system: castCurvedProjectile, priority: 1 },
// { system: castLinearProjectile, priority: 1 },
// { system: projectileAttachments, priority: 1 },

// // ranks
// { system: updateRankQueuing, priority: 1 },

// // servers
// { system: updateServers, priority: 1 },

// // status effects
// { system: updateStamina, priority: 1 },
// { system: updateStun, priority: -1 },
// { system: updateDamage, priority: 0 },
// { system: updateEvasive, priority: -1 },
// { system: updateExp, priority: 1 },