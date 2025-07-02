-- Compiled with roblox-ts v3.0.0
local pagePaths = function(page)
	return {
		HUD = page.HUD,
		VillagersPage = page.Village,
		RobuxStore = page.RobuxStore,
		GiftPage = page.GiftList,
		WallPage = page.Wall,
		PromoPage = page.PromoCode,
		IntroTextPage = page.Introtext,
		PlacementPage = page.PlaceFrame,
		ConfirmPage = page.ConfirmationPrompt,
		Page = page,
	}
end
local default = pagePaths
return {
	default = default,
}
