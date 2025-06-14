import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import HudPage from "./pages/HudButtonPage";
import { ReplicatedStorage } from "@rbxts/services";
import SellPage from "./pages/SellPage";



export default (sellPage: DialogueSellUI) => {
	const trash = new Janitor();
	const pages = [
		SellPage,
	]

	// renders the hud page
	pages.forEach((page) => trash.Add(page(sellPage)));

	// when trash gets cleaned up
	trash.Add(() => {
		ReplicatedStorage.FindFirstChild("BytenetStorage")?.Destroy();
		ReplicatedStorage.FindFirstChild("ByteNetReliable")?.Destroy();
		ReplicatedStorage.FindFirstChild("ByteNetUnreliable")?.Destroy();
	})

	return trash
}