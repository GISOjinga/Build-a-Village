import React, { useEffect } from "@rbxts/react";
import { UiProducers } from "../../../shared/utils/producers";
import { Lighting, TweenService } from "@rbxts/services";




export default ({ openPage, requiredPage }: { openPage: UiProducers["openPage"], requiredPage: UiProducers["openPage"] }) => {

    // adds a background blur
    useEffect(() => {
        if (openPage === requiredPage) {
            const blur = Lighting.FindFirstChild<BlurEffect>("UIBlurEffect" + requiredPage) || new Instance("BlurEffect");

            // set the blur
            blur.Parent = Lighting
            blur.Name = "UIBlurEffect" + requiredPage


            // tweens the blur
            TweenService.Create(blur, new TweenInfo(3, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), { Size: 20 }).Play();
        } else {
            const blur = Lighting.FindFirstChild<BlurEffect>("UIBlurEffect" + requiredPage);
            const tween = blur && TweenService.Create(blur, new TweenInfo(3, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), { Size: 0 });

            if (blur && tween) {
                blur.Name = "RemovingUIBlurEffect" + requiredPage
                tween.Play();

                // when tween completed destroys blur
                tween.Completed.Connect(() => {
                    blur.Destroy();
                });
            }
        }
    }, [openPage]);
}