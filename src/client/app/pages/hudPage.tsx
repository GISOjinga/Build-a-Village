import React from "@rbxts/react"
import { useRootSelector } from "shared/utils/producers"
import { NewElasticButton } from "../css/coolEffects/expandingButton"
import { DefaultImageProperties } from "../css/defaults/ui"
import { routes } from "shared/data/network"





export default () => {
    const openPage = useRootSelector((state) => state.openPage)

    return <frame
        key="HUD"
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        Position={new UDim2(0.5, 0, 0.5, 0)}
        Size={new UDim2(1, 0, 1, 0)}
        Visible={true}
    >
        <frame
            key="Village"
            AnchorPoint={new Vector2(0.5, 0.5)}
            BackgroundTransparency={1}
            Position={new UDim2(0.5, 0, 0.069, 0)}
            Size={new UDim2(0.186, 0, 0.078, 0)}
        >
            <uiaspectratioconstraint AspectRatio={4.25} />
            <NewElasticButton
                tween={{
                    expanded: new UDim2(1.02, 0, 1.02, 0),
                    unexpanded: new UDim2(0.8, 0, 0.8, 0),
                }}
                events={{
                    activated: () => routes.teleportToVillage.send(),
                }}
            >
                <imagelabel
                    key="Village"
                    {...DefaultImageProperties}
                    Image="rbxassetid://102686158882974"
                />
            </NewElasticButton>
        </frame>
        <frame
            key="Shop"
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundTransparency={1}

            Position={new UDim2(0.025, 0, 0.537, 0)}
            Size={new UDim2(0.1, 0, 0.065, 0)}
        >
            <uiaspectratioconstraint AspectRatio={2.729} />
            <NewElasticButton
                tween={{
                    expanded: new UDim2(1.02, 0, 1.02, 0),
                    unexpanded: new UDim2(0.8, 0, 0.8, 0),
                }}
                events={{

                }}
            >
                <imagelabel
                    key="Shop"
                    {...DefaultImageProperties}
                    Image="rbxassetid://140312318557707"
                />
            </NewElasticButton>
        </frame>
        <frame
            key="Sell"
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundTransparency={1}

            Position={new UDim2(0.719, 0, 0.073, 0)}
            Size={new UDim2(0.10200000000000001, 0, 0.07, 0)}
        >
            <uiaspectratioconstraint AspectRatio={2.566} />
            <NewElasticButton
                tween={{
                    expanded: new UDim2(1.02, 0, 1.02, 0),
                    unexpanded: new UDim2(0.8, 0, 0.8, 0),
                }}
                events={{
                    activated: () => routes.teleportToShop.send("Sell"),
                }}
            >
                <imagelabel
                    key="Sell"
                    {...DefaultImageProperties}
                    Image="rbxassetid://110462893610827"
                />
            </NewElasticButton>
        </frame>
        <frame
            key="Buy"
            AnchorPoint={new Vector2(0, 0.5)}
            BackgroundTransparency={1}
            Position={new UDim2(0.179, 0, 0.073, 0)}
            Size={new UDim2(0.10200000000000001, 0, 0.07, 0)}
        >
            <uiaspectratioconstraint AspectRatio={2.566} />
            <NewElasticButton
                tween={{
                    expanded: new UDim2(1.02, 0, 1.02, 0),
                    unexpanded: new UDim2(0.8, 0, 0.8, 0),
                }}
                events={{
                    activated: () => routes.teleportToShop.send("Buy"),
                }}
            >
                <imagelabel
                    key="Buy"
                    {...DefaultImageProperties}
                    Image="rbxassetid://114594681045529"
                />
            </NewElasticButton>
        </frame>
    </frame>
}