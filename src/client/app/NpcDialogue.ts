import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import HudPage from "./pages/HudButtonPage";
import { ReplicatedStorage } from "@rbxts/services";
import SellPage from "./pages/SellPage";
import NpcDialoguePage from "./pages/NpcDialoguePage";



export default (dialoguePage: NpcDialogues) => {
	const trash = new Janitor();
	const pages = [
		NpcDialoguePage,
	]

	// renders the hud page
	pages.forEach((page) => trash.Add(page(dialoguePage)));

	// when trash gets cleaned up
	trash.Add(() => {
		ReplicatedStorage.FindFirstChild("BytenetStorage")?.Destroy();
		ReplicatedStorage.FindFirstChild("ByteNetReliable")?.Destroy();
		ReplicatedStorage.FindFirstChild("ByteNetUnreliable")?.Destroy();
	})

	return trash
}