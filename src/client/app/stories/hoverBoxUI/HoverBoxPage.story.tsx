import paths from "shared/utils/paths";
import { Janitor } from "@rbxts/janitor";
import HoverBoxPage from "client/app/pages/HoverBoxPage";


// return the controller
export = (hoverBoxUI: HoverBoxUI) => {
    const trash = new Janitor();

    // Create a root for the frame
    paths.Assets.UI.HoverBox.GetChildren().forEach((child) => child.Clone().Parent = hoverBoxUI);
    trash.Add(HoverBoxPage(hoverBoxUI));

    //We need to return another function to unmount the handle
    return () => {
        trash.Destroy();
    };
}