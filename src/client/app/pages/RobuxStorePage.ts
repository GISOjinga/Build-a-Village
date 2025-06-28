import UIUtilities from "shared/utils/Animations/uiUtilities";
import { MarketplaceService } from "@rbxts/services";
import useEffect from "../hooks/useEffect";
import { addCommasEveryThreeDigits, formatToDDHHMMSS } from "shared/utils/functions/stringHelp";
import robuxStoreData from "shared/data/robuxStoreData";
import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import { routes } from "shared/data/network";
import paths from "shared/utils/paths";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.02, 1.02);
    const robuxStorePage = pagePaths.RobuxStore;
    const scrollingFrame = robuxStorePage.ScrollingFrame;
    const starterPackFrame = scrollingFrame.StarterPack;
    const launchPackFrame = scrollingFrame.LaunchPack;

    trash.Add(useEffect((effectTrash) => {
        const setupPurchase = (frame: typeof starterPackFrame | typeof launchPackFrame, purchaseKey: keyof typeof robuxStoreData) => {
            const purchaseData = pageStates.robuxStore()[purchaseKey] as StarterShopPack

            frame.packname.Text = purchaseData.Name;
            const buyButton = frame.purchaseoptions.buy;
            const giftButton = frame.purchaseoptions.gift;

            // show robux price
            task.spawn(() => {
                const [ok, info] = pcall(() => MarketplaceService.GetProductInfo(purchaseData.ProductId, Enum.InfoType.Product));
                const price = ok ? (info as ProductInfo).PriceInRobux : 0;
                if (frame === starterPackFrame) {
                    (buyButton as TextButton).Text = ` ${price}`;
                } else {
                    const launchBuy = buyButton as typeof launchPackFrame.purchaseoptions.buy;
                    launchBuy.price.Text = ` ${price}`;
                }
            });

            if (frame === starterPackFrame) {
                frame.items.cash.Text = `+$${addCommasEveryThreeDigits(purchaseData.Coins)}!`;
            }

            // load villager renders
            const slots = frame === starterPackFrame
                ? [frame.items.b1, frame.items.m1, frame.items.m2]
                : [
                    launchPackFrame.items.b1,
                    launchPackFrame.items.s1,
                    launchPackFrame.items.s2,
                    launchPackFrame.items.s3,
                    launchPackFrame.items.s4,
                ];
            slots.forEach((slot) => {
                slot.GetChildren().forEach((child) => {
                    if (!child.IsA("UIStroke")) child.Destroy();
                });
            });
            purchaseData.Villagers.forEach((villager, index) => {
                const slot = slots[index];
                const render = paths.Assets.UI.VillagerRenders.FindFirstChild(villager)?.Clone() as ViewportFrame | undefined;
                if (slot && render) {
                    render.Parent = slot;
                    render.Visible = true;
                }
            });

            effectTrash.Add(UIUtilities.ButtonAction({
                Button: buyButton,
                ExpandedSize: UIUtilities.MultiplyUdim2(buyButton.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(buyButton.Size, sizeOffset),
            }, () => {
                routes.buyRobuxPack.send({ purchase: purchaseKey });
            }));

            effectTrash.Add(UIUtilities.ButtonAction({
                Button: giftButton,
                ExpandedSize: UIUtilities.MultiplyUdim2(giftButton.Size, sizeOffset),
                DeExpandedSize: UIUtilities.DivideUdim2(giftButton.Size, sizeOffset),
            }, () => {
                pageStates.productToGift(purchaseData.ProductId);
                pageStates.openPage("Gift");
            }));

            effectTrash.Add(task.spawn(() => {
                while (true) {
                    const timeLeft = math.max(0, purchaseData.TimeEnds - os.time());
                    frame.CountDown.Text = formatToDDHHMMSS(timeLeft);
                    task.wait(1);
                }
            }));
        };

        setupPurchase(starterPackFrame, "StarterPack");
        setupPurchase(launchPackFrame, "LaunchPack");
    }));

    return trash
}