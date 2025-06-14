import paths from "shared/utils/paths";
import { Janitor } from "@rbxts/janitor";
import DialogueSell from "client/app/DialogueSellUI";


// return the controller
export = (sellPage: DialogueSellUI) => {
    const trash = new Janitor();

    // Create a root for the frame
    paths.Assets.UI.DialogueSell.GetChildren().forEach((child) => child.Clone().Parent = sellPage);
    trash.Add(DialogueSell(sellPage));

    //We need to return another function to unmount the handle
    return () => {
        trash.Destroy();
    };
}