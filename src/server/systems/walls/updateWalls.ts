import { World } from "@rbxts/jecs";
import { MarketplaceService, Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import wallsData from "shared/data/wallsData";
import { useEvent } from "shared/Plugin-Hook";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import pageStates from "shared/utils/Animations/pageStates";
import { createEntity, getEntity, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Changed, Data, Platform, TargetEntity } from "shared/utils/jecs/jecsComponents";




// to toggle fence visibility
function toggleFenceVisibility(fence: Instance, visible: boolean) {
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
                        printTS($line, `Buying wall ${wallWishingToBeBought.Name} for ${wallWishingToBeBought.Price} coins`);
                        // removes the coins from your data
                        oldData.Coins -= wallWishingToBeBought.Price;

                        // gived you the wall in your walls
                        oldData.Walls.push({
                            ...wallWishingToBeBought,
                            Owned: true,
                            Equipped: true,
                        })
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

        // if the purchase was successful and the player exists
        if (wasPurchased && player && playerEntity && wallWishingToBeBought) {
            printTS($line, `Player ${player.Name} purchased wall ${wallWishingToBeBought.Name} with robux`);
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
        }
    }

    // when ever equip wall is called it edits your data then equips the wall using create entity
    useRoute(routes.equipWall, (routeData, player) => {
        const playerEntity = getEntity.fromInstance(player);
        const data = playerEntity && world.get(playerEntity, Data);

        if (playerEntity && data) {
            // finds the wall you wish to equip
            const wallToEquip = data.Walls.find((w) => w.Name === routeData.wallName);

            // if you have the wall
            if (wallToEquip) {
                printTS($line, `Equipping wall ${wallToEquip.Name} to ${routeData.equip ? "equip" : "unequip"}`);
                // updates your walls data
                createEntity.updateData(playerEntity, (oldData) => {
                    oldData.Walls.forEach((wall) => {
                        if (wall.Name === wallToEquip.Name) {
                            printTS($line, `Setting wall ${wall.Name} equipped to ${routeData.equip}`);
                            wall.Equipped = routeData.equip;
                        }
                    })
                    return oldData
                })
            }
        }
    })

    // when ever your data gets updated it makes sure to set the equipped wall on your platform visible
    for (const [_, playerEntity, changed] of world.query(TargetEntity, Changed(Data))) {
        const data = changed.new;
        const platform = world.contains(playerEntity) && world.get(playerEntity, Platform)

        // if you have data and a platform then hides all your walls
        if (platform && data) {
            const currentlyEquippedWall = data.Walls.find((w) => w.Owned && w.Equipped);
            const wallModel = currentlyEquippedWall && platform.Fences.FindFirstChild(currentlyEquippedWall.Name);

            // checks to see if the wall is already visible if so ignores it
            if (!wallModel || !wallModel.GetAttribute("Visible")) {
                printTS($line, "Updating walls for player", playerEntity, "to", currentlyEquippedWall ? currentlyEquippedWall.Name : "none");

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
    }
}