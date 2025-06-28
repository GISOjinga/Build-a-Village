import { Janitor } from "@rbxts/janitor";
import { StarterGui } from "@rbxts/services";
import { routes } from "shared/data/network";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const promoPage = pagePaths.PromoPage;
    const sizeOffset = UDim2.fromScale(1.05, 1.05);

    // Redeem button
    trash.Add(UIUtilities.ButtonAction({
        Button: promoPage.RedeemButton,
        ExpandedSize: UIUtilities.MultiplyUdim2(promoPage.RedeemButton.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(promoPage.RedeemButton.Size, sizeOffset),
    }, () => {
        const code = promoPage.TextBox.Text;
        routes.redeemPromo.send(code);
    }));

    // Close button hides the page
    trash.Add(UIUtilities.ButtonAction({
        Button: promoPage.Close,
        ExpandedSize: UIUtilities.MultiplyUdim2(promoPage.Close.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(promoPage.Close.Size, sizeOffset),
    }, () => {
        pageStates.openPage("None");
    }));

    trash.Add(routes.promoResult.listen(({ success, message }) => {
        promoPage.Title.Text = message;
    }));

    return trash;
};
