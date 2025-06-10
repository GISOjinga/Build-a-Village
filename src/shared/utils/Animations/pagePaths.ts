

const pagePaths = (page: GameUI) => {
    return {
        HUD: page.HUD,
        VillagersPage: page.Villagers,
        RobuxStore: page.RobuxStore,
    };
}

export type PagePaths = ReturnType<typeof pagePaths>;
export type VillagerUIBox = PagePaths["VillagersPage"]["Content"]["Example"];
export default pagePaths