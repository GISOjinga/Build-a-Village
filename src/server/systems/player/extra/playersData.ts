import { PlayerData } from "../../../../shared/data/defaultData";

const playerData = new Map<Player, PlayerData>()
export const dataStore = game.GetService("DataStoreService").GetDataStore("Build A Village v.0.0.5")

// lets you get the players data
export function waitForPlayerData(player: Player) {
    if (!playerData.has(player)) {
        warn(`Waiting for ${player.Name} data to load.`)
        return waitForPlayerData(player)
    } else {
        return playerData.get(player) as PlayerData
    }
}

// gets the player data
export function getPlayerData(player: Player): PlayerData | undefined {
    return playerData.get(player)
}

// sets the player data
export function setPlayerData(player: Player, data: PlayerData) {
    playerData.set(player, data)
}