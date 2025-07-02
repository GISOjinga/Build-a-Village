import { Entity, pair, World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { PlayerData } from "shared/data/defaultData";
import routes from "server/routes";
import wallsData from "shared/data/wallsData";
import { useEvent } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import pageStates from "shared/utils/Animations/pageStates";
import { addComponent, createEntity, getEntity, printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Added, Changed, Data, GiftTo, Platform, PlatformOccupied, Player, Removed, TargetEntity } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";




// to toggle fence visibility
function toggleFenceVisibility(fence: Instance, visible: boolean) {
    fence.SetAttribute("Visible", visible);
    fence.GetDescendants().forEach((fence) => {
        if (fence.IsA("BasePart")) {
            fence.Transparency = visible ? 0 : 1
            fence.CanCollide = visible
            fence.CastShadow = visible
            fence.CanQuery = visible
            fence.CanTouch = false
            fence.Anchored = true
        }
    })
}



export default (world: World) => {
    // when ever buy wall is called it updates the wall in your data using create entity
    useRoute(routes.buyWall, (routeData, player) => {
        const playerEntity = getEntity.fromInstance(player);
        const data = playerEntity && world.get(playerEntity, Data);
        const wallWishingToBeBought = wallsData.find((w) => w.Name === routeData.wallName);

        if (playerEntity && wallWishingToBeBought && data) {
            // if you have enough money to buy the wall
            if (routeData.currency === "Coins") {
                createEntity.updateData(playerEntity, (oldData) => {
                    // updates your cash if you have it
                    if (oldData.Coins >= wallWishingToBeBought.Price) {
                        // plays the purchase sound to the player
                        routes.playSound.sendTo({
                            sound: paths.SFX.UI.purchasepass,
                            position: undefined
                        }, player);
                        printJecs($line, `Buying wall ${wallWishingToBeBought.Name} for ${wallWishingToBeBought.Price} coins`);
                        // removes the coins from your data
                        oldData.Coins -= wallWishingToBeBought.Price;

                        // gived you the wall in your walls
                        oldData.Walls.forEach((wall) => wall.Equipped = false); // unequips all walls
                        oldData.Walls.push({
                            ...wallWishingToBeBought,
                            Owned: true,
                            Equipped: true,
                        })
                    } else {
                        // plays the purchase sound to the player
                        routes.playSound.sendTo({
                            sound: paths.SFX.UI.purchasefail,
                            position: undefined
                        }, player);
                    }
                    return oldData
                })
            } else if (routeData.currency === "Robux" && wallWishingToBeBought.GamePassId > 0) {
                // prompts marpet place to buy the wall
                MarketplaceService.PromptGamePassPurchase(player, wallWishingToBeBought.GamePassId);
            }
        }
    })

    // use event to watch for purchase
    for (const [player, gamePassId, wasPurchased] of useEvent(MarketplaceService.PromptGamePassPurchaseFinished)) {
        const playerEntity = player && getEntity.fromInstance(player);
        const wallWishingToBeBought = wallsData.find((wall) => wall.GamePassId === gamePassId);

        task.spawn(() => {
            printJecs($line, `Player ${player.Name} purchased game pass ${gamePassId} with result ${wasPurchased || MarketplaceService.UserOwnsGamePassAsync(player.UserId, gamePassId)}, wallWishingToBeBought`, gamePassId);

            // if the purchase was successful and the player exists
            if ((wasPurchased || MarketplaceService.UserOwnsGamePassAsync(player.UserId, gamePassId)) && playerEntity && wallWishingToBeBought) {
                // plays the purchase sound to the player
                routes.playSound.sendTo({
                    sound: paths.SFX.UI.purchasepass,
                    position: undefined
                }, player);

                printJecs($line, `Player ${player.Name} purchased wall ${wallWishingToBeBought.Name} with robux`);
                // updates your data to give you the wall
                createEntity.updateData(playerEntity, (oldData) => {
                    // adds the wall to your walls
                    oldData.Walls.push({
                        ...wallWishingToBeBought,
                        Owned: true,
                        Equipped: true,
                    });
                    return oldData;
                });
            } else {
                // plays the purchase sound to the player
                routes.playSound.sendTo({
                    sound: paths.SFX.UI.purchasefail,
                    position: undefined
                }, player);
            }
        })
    }

    // when ever equip wall is called it edits your data then equips the wall using create entity
    useRoute(routes.equipWall, (routeData, player) => {
        const playerEntity = getEntity.fromInstance(player);
        const data = playerEntity && world.get(playerEntity, Data);

        if (playerEntity && data) {
            // finds the wall you wish to equip
            const wallToEquip = data.Walls.find((wall) => wall.Name === routeData.wallName);

            // if you have the wall
            if (wallToEquip) {
                printJecs($line, `Equipping wall ${wallToEquip.Name} to ${routeData.equip ? "equip" : "unequip"}`);
                // updates your walls data
                createEntity.updateData(playerEntity, (oldData) => {
                    oldData.Walls.forEach((wall) => {
                        if (wall.Name === wallToEquip.Name) {
                            printJecs($line, `Setting wall ${wall.Name} equipped to ${routeData.equip}`);
                            wall.Equipped = routeData.equip;
                        } else {
                            wall.Equipped = false;
                        }
                    })
                    return oldData
                })
            }
        }
    })

    // function to toggle wall
    function equipWall(playerEntity: Entity, data: PlayerData, platform: PlatformExample) {
        const currentlyEquippedWall = data.Walls.find((w) => w.Owned && w.Equipped);
        const wallModel = currentlyEquippedWall && platform.Fences.FindFirstChild(currentlyEquippedWall.Name);

        // checks to see if the wall is already visible if so ignores it
        printJecs($line, "Currently equipped wall:", currentlyEquippedWall ? currentlyEquippedWall.Name : "none", "Wall model:", wallModel ? wallModel.Name : "none");
        if (!wallModel || !wallModel.GetAttribute("Visible")) {
            printJecs($line, "Updating walls for player", playerEntity, "to", currentlyEquippedWall ? currentlyEquippedWall.Name : "none");

            // hides all walls
            platform.Fences.GetChildren().forEach((child) => {
                child.SetAttribute("Visible", false);
                toggleFenceVisibility(child, false);
            });

            // if the current wall exists then sets it visible
            if (wallModel) {
                wallModel.SetAttribute("Visible", true);
                toggleFenceVisibility(wallModel, true);
            }
        }
    }

    // when platform gets added hides all the walls except the equipped one
    for (const [_, platformEntity, platform] of world.query(TargetEntity, Added(Platform))) platform.Fences.GetChildren().forEach((fence) => toggleFenceVisibility(fence, false))

    // when platform occupiued gets added
    for (const [_, platformEntity, playerOccupyingEntity] of world.query(TargetEntity, Added(PlatformOccupied))) {
        const playerOccupying = world.get(playerOccupyingEntity, Player);
        const platform = world.get(platformEntity, Platform);

        // if platform exists then sets up the sign gui containers
        if (platform && playerOccupying) {
            const proximityPromptProduceAll = paths.Assets.ProximityPrompts.FindFirstChild("ProduceAll")?.Clone() as ProximityPrompt | undefined;

            // sets up produce all
            if (proximityPromptProduceAll) {
                proximityPromptProduceAll.Parent = platform.BuySign.Container

                // when triggered asks to buy a product called produce all
                proximityPromptProduceAll.Triggered.Connect((playerWhoTriggered) => {
                    const playerWhoTriggeredEntity = getEntity.fromInstance(playerWhoTriggered)

                    if (playerWhoTriggeredEntity && world.contains(playerOccupyingEntity)) {
                        addComponent(playerWhoTriggeredEntity, GiftTo, { target: playerOccupying, gifted: false })
                        MarketplaceService.PromptProductPurchase(playerWhoTriggered, 3309650571);
                    }
                })
            }
        }
    }

    // when ever platform occupied gets removed hides the fences
    for (const [_, platformEntity] of world.query(TargetEntity, Removed(PlatformOccupied))) {
        const platform = world.get(platformEntity, Platform);

        if (platform) {
            platform.BuySign.Container.FindFirstChildOfClass("ProximityPrompt")?.Destroy();
            platform.Fences.GetChildren().forEach((fence) => toggleFenceVisibility(fence, false));
        }
    }

    // when ever your data gets updated it makes sure to set the equipped wall on your platform visible
    for (const [_, playerEntity, changed] of world.query(TargetEntity, Changed(Data))) {
        const data = changed.new;
        const platformEntity = world.contains(playerEntity) && world.get(playerEntity, pair(TargetEntity, Platform))
        const platform = platformEntity && world.contains(platformEntity) && world.get(platformEntity, Platform);

        // if you have data and a platform then hides all your walls
        printJecs($line, "Updating walls for player", playerEntity, "with data", data, platformEntity, platform);
        if (platform && data) equipWall(playerEntity, data, platform);
    }
}