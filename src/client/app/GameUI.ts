import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import HudPage from "./pages/HudButtonPage";
import { ReplicatedStorage } from "@rbxts/services";
import OpenPage from "./pages/OpenPage";
import VillagersPage from "./pages/VillagersPage";



export default (pagePaths: PagePaths) => {
	const trash = new Janitor();
	const pages = [
		HudPage,
		OpenPage,
		VillagersPage,
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