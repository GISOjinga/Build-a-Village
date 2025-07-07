
const pagePaths = (page: GameUI) => {
    return {
        HUD: page.HUD,
        VillagersPage: page.Village,
        RobuxStore: page.RobuxStore,
        GiftPage: page.GiftList,
        InventoryPage: page.Inventory,
        WallPage: page.Wall,
        PromoPage: page.PromoCode,
        IntroTextPage: page.Introtext,
        PlacementPage: page.PlaceFrame,
        ConfirmPage: page.ConfirmationPrompt,
        DailyQuestsTabsPage: page.DailyQuestsTab,
        DailyQuestsPage: page.DailyQuests,
        DailyRewardsPage: page.DailyRewards,
        RollsPage: page, // Using main page as placeholder since no dedicated roll UI exists
        Page: page,
    };
}

export type PagePaths = ReturnType<typeof pagePaths>;
export type VillagerUIBox = PagePaths["VillagersPage"]["ScrollingFrame"]["Sample"];
export default pagePaths
