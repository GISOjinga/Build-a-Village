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



export default (pagePaths: PagePaths) => {
	const trash = new Janitor();
	const pages = [
		HudPage,
		OpenPage,
		VillagersPage,
		GiftPage,
		WallPage,
		RobuxStorePage,
		IntroTextPage,
		PlacementPage,
	]

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