import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import HudPage from "./pages/HudButtonPage";
import { ReplicatedStorage } from "@rbxts/services";
import OpenPage from "./pages/OpenPage";
import VillagersPage from "./pages/VillagersPage";
import GiftPage from "./pages/GiftPage";
import WallPage from "./pages/WallPage";
import RobuxStorePage from "./pages/RobuxStorePage";
import IntroTextPage from "./pages/IntroTextPage";
import PlacementPage from "./pages/PlacementPage";
import PromoPage from "./pages/PromoPage";
import InviteIncentivePage from "./pages/InviteIncentivePage";
import InventoryPage from "./pages/InventoryPage";
import HotbarPage from "./pages/HotbarPage";
import routes from "client/routes";
import pageStates from "shared/utils/Animations/pageStates";
import ConfirmationPage from "./pages/ConfirmationPage";
import DailyQuestPage from "./pages/DailyQuestPage";



export default (pagePaths: PagePaths) => {
        const trash = new Janitor();
        const pages = [
                HudPage,
                OpenPage,
                VillagersPage,
                GiftPage,
                WallPage,
                RobuxStorePage,
                HotbarPage,
                InventoryPage,
                IntroTextPage,
                PlacementPage,
                ConfirmationPage,
                PromoPage,
                InviteIncentivePage,
                DailyQuestPage
        ]

        // listen to page changes
        trash.Add(routes.togglePage.listen(pageStates.openPage));

        // renders the hud page
        pages.forEach((page) => trash.Add(page(pagePaths)));

        // when trash gets cleaned up
        trash.Add(() => {
                ReplicatedStorage.FindFirstChild("BytenetStorage")?.Destroy();
                ReplicatedStorage.FindFirstChild("ByteNetReliable")?.Destroy();
                ReplicatedStorage.FindFirstChild("ByteNetUnreliable")?.Destroy();
        })

        return trash
}
