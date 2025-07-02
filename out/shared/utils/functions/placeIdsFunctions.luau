-- Compiled with roblox-ts v3.0.0
local placeIds = {
	Lobby = {
		Test = 18834235601,
		Production = 14447079320,
	},
	MainGame = {
		Test = 18834275005,
		Production = 14592405345,
	},
	FinalRound = {
		Test = 17845722952,
		Production = 14447079320,
	},
}
local function placeIdIsInTest()
	return game.PlaceId == placeIds.Lobby.Test or game.PlaceId == placeIds.FinalRound.Test or game.PlaceId == placeIds.MainGame.Test
end
local verfiyPlaceId = {
	Lobby = function(id)
		return id == placeIds.Lobby[if placeIdIsInTest() then "Test" else "Production"]
	end,
	FinalRound = function(id)
		return id == placeIds.FinalRound[if placeIdIsInTest() then "Test" else "Production"]
	end,
	MainGame = function(id)
		return id == placeIds.MainGame[if placeIdIsInTest() then "Test" else "Production"]
	end,
}
local getPlaceIdByName = {
	Lobby = function()
		return placeIds.Lobby[if placeIdIsInTest() then "Test" else "Production"]
	end,
	FinalRound = function()
		return placeIds.FinalRound[if placeIdIsInTest() then "Test" else "Production"]
	end,
	MainGame = function()
		return placeIds.MainGame[if placeIdIsInTest() then "Test" else "Production"]
	end,
}
return {
	placeIdIsInTest = placeIdIsInTest,
	placeIds = placeIds,
	verfiyPlaceId = verfiyPlaceId,
	getPlaceIdByName = getPlaceIdByName,
}
