export const placeIds = {
    Lobby: { Test: 18834235601, Production: 14447079320 },
    MainGame: { Test: 18834275005, Production: 14592405345 },
    FinalRound: { Test: 17845722952, Production: 14447079320 },
}

export function placeIdIsInTest(): boolean {
    return game.PlaceId === placeIds.Lobby.Test || game.PlaceId === placeIds.FinalRound.Test || game.PlaceId === placeIds.MainGame.Test
}

export const verfiyPlaceId = {
    Lobby: (id: number) => {
        return id === placeIds.Lobby[placeIdIsInTest() ? "Test" : "Production"]
    },
    FinalRound: (id: number) => {
        return id === placeIds.FinalRound[placeIdIsInTest() ? "Test" : "Production"]
    },
    MainGame: (id: number) => {
        return id === placeIds.MainGame[placeIdIsInTest() ? "Test" : "Production"]
    }
}

export const getPlaceIdByName = {
    Lobby: () => {
        return placeIds.Lobby[placeIdIsInTest() ? "Test" : "Production"]
    },
    FinalRound: () => {
        return placeIds.FinalRound[placeIdIsInTest() ? "Test" : "Production"]
    },
    MainGame: () => {
        return placeIds.MainGame[placeIdIsInTest() ? "Test" : "Production"]
    }
}
