import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import HudPage from "./pages/HudButtonPage";
import { ReplicatedStorage } from "@rbxts/services";
import HoverBoxPage from "./pages/HoverBoxPage";



export default (hoverBoxUI: HoverBoxUI) => {
	const trash = new Janitor();
	const pages = [
		HoverBoxPage,
	]

	// renders the hud page
	pages.forEach((page) => trash.Add(page(hoverBoxUI)));

	// when trash gets cleaned up
	trash.Add(() => {
		ReplicatedStorage.FindFirstChild("BytenetStorage")?.Destroy();
		ReplicatedStorage.FindFirstChild("ByteNetReliable")?.Destroy();
		ReplicatedStorage.FindFirstChild("ByteNetUnreliable")?.Destroy();
	})

	return trash
}