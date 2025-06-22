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
import { addCommasEveryThreeDigits } from "shared/utils/functions/stringHelp";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.2, 1.2);
    const wallPage = pagePaths.WallPage;
    const scrollingFrame = wallPage.ScrollingFrame;
    const sample = scrollingFrame.Sample;

    // when ever the walls update
    trash.Add(useEffect((newTrash) => {
        const wallsShop = pageStates.wallsShop();

        // starts off by clearing up the wall shop scrolling frame
        scrollingFrame.GetChildren().forEach((child) => {
            if (child !== sample && child.IsA("Frame")) child.Destroy();
        })

        // loads in each of the walls
        wallsShop.forEach((wallInfo, index) => {
            const wallBox = sample.Clone();
            const buyButton = wallBox.buy;
            const equipButton = wallBox.equip;
            const unequipButton = wallBox.unequip;
            const robuxButton = wallBox.robux;

            // set up
            sample.Visible = false
            wallBox.Visible = true;
            wallBox.Name = wallBox.Name;
            wallBox.LayoutOrder = index;
            wallBox.equip.Visible = wallInfo.Owned && !wallInfo.Equipped
            wallBox.unequip.Visible = wallInfo.Equipped;
            wallBox.buy.Visible = !wallInfo.Owned;
            wallBox.Price.Visible = wallInfo.Price > 0;
            wallBox.RobuxPrice.Visible = wallInfo.GamePassId > 0;
            wallBox.buy.Visible = wallInfo.Price > 0 && !wallInfo.Owned
            wallBox.robux.Visible = wallInfo.GamePassId > 0 && !wallInfo.Owned;
            wallBox.Price.Text = `$${addCommasEveryThreeDigits(wallInfo.Price)}`;
            wallBox.Multiplier.Text = `X${wallInfo.CashMultiplier} CASH GAIN`
            wallBox.SampleName.Text = wallInfo.Name;
            wallBox.Parent = scrollingFrame;

            // sets up the pricing for robux walls
            trash.Add(task.spawn(() => {
                pcall(() => {
                    const [passed, passInfo] = pcall(() => MarketplaceService.GetProductInfo(wallInfo.GamePassId, Enum.InfoType.GamePass));
                    wallBox.RobuxPrice.Visible = passed && (passInfo.PriceInRobux || 0) > 0;
                    wallBox.RobuxPrice.Text = `${passed ? passInfo.PriceInRobux : 0}`;
                })
            }))

            // binds the focus action
            if (wallInfo.Owned && !wallInfo.Equipped) { // if the wall is owned but not equipped

                // sets the buttons to be interactable
                robuxButton.Interactable = false
                buyButton.Interactable = false;
                equipButton.Interactable = true;
                unequipButton.Interactable = false;

                // binds equip
                newTrash.Add(UIUtilities.ButtonAction({
                    Button: equipButton,
                    ExpandedSize: UIUtilities.MultiplyUdim2(equipButton.Size, sizeOffset),
                    DeExpandedSize: UIUtilities.DivideUdim2(equipButton.Size, sizeOffset),
                }, () => {
                    printTS($line, "equipping wall", wallInfo.Name);
                    routes.equipWall.send({
                        wallName: wallInfo.Name,
                        equip: true,
                    });
                }))
            } else if (wallInfo.Equipped && wallInfo.Owned) { // if the wall is equipped so un equip

                // sets the buttons to be interactable
                robuxButton.Interactable = false
                buyButton.Interactable = false;
                equipButton.Interactable = false;
                unequipButton.Interactable = true;

                // binds un unequip
                newTrash.Add(UIUtilities.ButtonAction({
                    Button: unequipButton,
                    ExpandedSize: UIUtilities.MultiplyUdim2(unequipButton.Size, sizeOffset),
                    DeExpandedSize: UIUtilities.DivideUdim2(unequipButton.Size, sizeOffset),
                }, () => {
                    printTS($line, "unequipping wall", wallInfo.Name);
                    routes.equipWall.send({
                        wallName: wallInfo.Name,
                        equip: false,
                    });
                }))
            } else { // if the wall is not owned
                const realBuyButton = wallInfo.Price > 0 ? buyButton : robuxButton;

                // sets the buttons to be interactable
                robuxButton.Interactable = false;
                buyButton.Interactable = false;
                equipButton.Interactable = false;
                unequipButton.Interactable = false;
                realBuyButton.Interactable = true;

                // binds the robux button to prompt the purchase
                newTrash.Add(UIUtilities.ButtonAction({
                    Button: realBuyButton,
                    ExpandedSize: UIUtilities.MultiplyUdim2(realBuyButton.Size, sizeOffset),
                    DeExpandedSize: UIUtilities.DivideUdim2(realBuyButton.Size, sizeOffset),
                }, () => {
                    printTS($line, "buying wall", wallInfo.Name, wallInfo.Price);
                    routes.buyWall.send({
                        wallName: wallInfo.Name,
                        currency: realBuyButton === robuxButton ? "Robux" : "Coins",
                    })
                }))
            }
        })
    }))

    return trash
}