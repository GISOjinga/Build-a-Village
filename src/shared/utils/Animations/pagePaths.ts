const pagePaths = (page: GameUI) => {
    return {
        HUD: page.HUD,
        VillagersPage: page.Village,
        RobuxStore: page.RobuxStore,
        GiftPage: page.GiftList,
        WallPage: page.Wall,
        IntroTextPage: page.Introtext,
    };
}

export type PagePaths = ReturnType<typeof pagePaths>;
export type VillagerUIBox = PagePaths["VillagersPage"]["ScrollingFrame"]["Sample"];
export default pagePaths