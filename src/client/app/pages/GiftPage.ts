import { effect } from "@rbxts/charm";
import { Janitor } from "@rbxts/janitor";
import { MarketplaceService, Players, TweenService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.05, 1.05);
    const giftPage = pagePaths.GiftPage;
    const scrollingFrame = giftPage.ScrollingFrame
    const sample = scrollingFrame.Sample


    // loads in each box
    sample.Visible = false;
    trash.Add(useEffect((newTrash) => {
        giftPage.Visible = pageStates.openPage() === "Gift";
    }))

    // load players
    const loadPlayers = () => {
        const players = Players.GetPlayers().filter((player) => player !== Players.LocalPlayer);

        // clears all the samples that are already there and visible
        scrollingFrame.GetChildren().forEach((child) => {
            if (child.IsA("ImageButton") && child.Visible && child !== sample) child.Destroy()
        });

        // loops through players makes a sample for each one
        players.forEach((player) => {
            const playerSample = sample.Clone();

            // sets up sample
            playerSample.Visible = true;
            playerSample.Parent = scrollingFrame;

            // sets the name
            playerSample.SampleName.Text = player.Name;
            playerSample.SampleName.TextLabel.Text = player.Name;

            // when clicked
            trash.Add(UIUtilities.ButtonAction({
                Button: playerSample,
                ExpandedSize: UIUtilities.MultiplyUdim2(playerSample.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(playerSample.Size, sizeOffset),
            }, () => {
                const productToGift = pageStates.productToGift()

                // closes the gift page
                pageStates.openPage("None")

                // if produict to gift then
                if (productToGift) {
                    routes.giftTo.send(player)
                    MarketplaceService.PromptProductPurchase(player, productToGift);
                    return;
                }
            }))
        });
    }

    // calls load players when ever player leaves or joins
    loadPlayers()
    Players.PlayerRemoving.Connect(loadPlayers);
    Players.PlayerAdded.Connect(loadPlayers)

    return trash
}