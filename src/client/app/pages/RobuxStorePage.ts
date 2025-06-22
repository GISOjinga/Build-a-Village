import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import useEffect from "../hooks/useEffect";
import { addCommasEveryThreeDigits, formatToDDHHMMSS } from "shared/utils/functions/stringHelp";
import robuxStoreData from "shared/data/robuxStoreData";
import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import { routes } from "shared/data/network";





export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const sizeOffset = UDim2.fromScale(1.2, 1.2);
    const robuxStorePage = pagePaths.RobuxStore;
    const scrollingFrame = robuxStorePage.ScrollingFrame;
    const purchase1 = scrollingFrame.Purchase1;
    const purchase2 = scrollingFrame.Purchase2;

    trash.Add(useEffect((effectTrash) => {
        const setupPurchase = (frame: typeof purchase1, purchaseKey: keyof typeof robuxStoreData) => {
            const purchaseData = pageStates.robuxStore()[purchaseKey];

            frame.packname.Text = purchaseData.Name;

            const buttons = {
                Pack1: { buy: frame.purchaseoptions.buyx1, gift: frame.purchaseoptions.giftx1 },
                Pack3: { buy: frame.purchaseoptions.buyx3, gift: frame.purchaseoptions.giftx3 },
                Pack10: { buy: frame.purchaseoptions.buyx10, gift: frame.purchaseoptions.giftx10 },
            } as const;

            for (const [packName, info] of pairs(buttons)) {
                const pack = purchaseData.Pack[packName as keyof typeof purchaseData.Pack];
                info.buy.packquantity.Text = `x${pack.PackMultiplier}`;

                effectTrash.Add(UIUtilities.ButtonAction({
                    Button: info.buy,
                    ExpandedSize: UIUtilities.MultiplyUdim2(info.buy.Size, sizeOffset),
                    DeExpandedSize: UIUtilities.DivideUdim2(info.buy.Size, sizeOffset),
                }, () => {
                    routes.buyRobuxPack.send({ purchase: purchaseKey, pack: packName as keyof typeof purchaseData.Pack });
                }));

                effectTrash.Add(UIUtilities.ButtonAction({
                    Button: info.gift,
                    ExpandedSize: UIUtilities.MultiplyUdim2(info.gift.Size, sizeOffset),
                    DeExpandedSize: UIUtilities.DivideUdim2(info.gift.Size, sizeOffset),
                }, () => {
                    pageStates.productToGift(pack.ProductId);
                    pageStates.openPage("Gift");
                }));
            }

            effectTrash.Add(task.spawn(() => {
                while (true) {
                    const timeLeft = math.max(0, purchaseData.TimeEnds - os.clock());
                    frame.CountDown.Text = formatToDDHHMMSS(timeLeft);
                    task.wait(1);
                }
            }));
        };

        setupPurchase(purchase1, "Purchase1");
        setupPurchase(purchase2, "Purchase2");
    }));

    return trash
}