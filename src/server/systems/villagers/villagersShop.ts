import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import { useEvent, useMemo } from "shared/Plugin-Hook";
import ShopData from "./ShopData";
import { Added, Body, Data, GiftTo, Player, ProduceAll } from "shared/utils/jecs/jecsComponents";
import { addComponent, createEntity, getEntity, printJecs, printTS, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { $line } from "rbxts-transformer-inline";
import { MarketplaceService, Players } from "@rbxts/services";
import { selectVillagerToRestock } from "./villagerAlgorithim";
import paths from "shared/utils/paths";



let timeTillRestock = os.time() + 60 * 5
const takeVillagerFromStock = (villagerName: VillagerNames) => {
    const villagersShopData = ShopData.Villagers;
    const villagerIndex = villagersShopData.findIndex((villager) => villager.Name === villagerName);
    const villagerData = villagersShopData[villagerIndex];

    // if the villager is in stock then take from stock
    if (villagerData.InStock > 0) {
        villagerData.InStock -= 1;
        ShopData.Villagers = [...villagersShopData]
        return true;
    }

    // if not in stock then return false
    return false;
}


export default (world: World) => {
    // if the restock total time is 0 or less than 0 then restock a random villager
    if ((timeTillRestock - os.time()) <= 0) {
        const villagersShopData = ShopData.Villagers;
        const villagerIndex = selectVillagerToRestock();

        if (villagerIndex !== undefined) {
            const villagerData = villagersShopData[villagerIndex];

            // if the villager is in stock then take from stock
            villagerData.InStock = 20
            ShopData.Villagers = [...villagersShopData];
            timeTillRestock = os.time() + 60 * 5; // sets the time till restock to the current time + the random time
            routes.updateVillagersShop.sendToAll({
                TimeTillRestock: timeTillRestock,
                Villagers: ShopData.Villagers
            })
        }
    }

    // when ever a player gets added sends out the villagers
    for (const [_, player] of world.query(Added(Player))) {
        routes.updateVillagersShop.sendTo({
            TimeTillRestock: timeTillRestock,
            Villagers: ShopData.Villagers
        }, player)
    }

    // any time villager shop data changes, update the villagers shop
    useMemo(() => routes.updateVillagersShop.sendToAll({
        TimeTillRestock: timeTillRestock,
        Villagers: ShopData.Villagers,
    }), [ShopData.Villagers])


    // game initially starts fully stocks everything
    useMemo(() => {
        const newData = new Array<VillagerInfo>();
        const fullStockCount = 20;

        // set the full stock count for each villager
        ShopData.Villagers.forEach((villager, index) => {
            newData[index] = {
                ...villager,
                InStock: fullStockCount,
            };
        })

        // update the shop data with the new data
        ShopData.Villagers = newData;
    }, [])


    // when ever gift to is called
    useRoute(routes.shopGiftTo, (playerToGiftTo, player) => {
        const playerEntity = getEntity.fromInstance(player);

        // if data then
        if (playerEntity) {
            addComponent(playerEntity, GiftTo, playerToGiftTo)
            printJecs($line, player.Name + " is gifting through shop to", playerToGiftTo.Name)
        };
    })

    // when handToolToPlayer is called
    useRoute(routes.handToolToPlayer, (playerToGiftTo, playerGifting) => {
        const playerEntity = getEntity.fromInstance(playerGifting);
        const playerToGiftToEntity = getEntity.fromInstance(playerToGiftTo);
        const body = playerEntity && world.get(playerEntity, Body);
        const equippedTool = body && body.model.FindFirstChildOfClass("Tool");
        const tooType = equippedTool?.GetAttribute<ToolType>("ItemType")
        const itemName = equippedTool?.GetAttribute<VillagerNames | ProduceNames>("ItemName");
        const itemVariant = equippedTool?.GetAttribute<ProduceVariant>("ItemVariant");

        // if data then
        if (playerEntity && itemVariant && playerToGiftToEntity && (tooType === "Villager" || tooType === "Commodity")) {
            // updates playerGifting data
            createEntity.updateData(playerEntity, (oldData) => {
                // removes the villager from the inventory
                if (tooType === "Villager") {
                    // removes it from their inventory
                    oldData.Villagers = oldData.Villagers.filter((v) => v.Name !== itemName);

                    // adds the villager to their inventory
                    createEntity.inventoryVillager(playerToGiftToEntity, itemName as VillagerNames);
                    printTS($line, playerGifting.Name + " gifted villager", itemName, "to", playerToGiftTo.Name);
                } else if (tooType === "Commodity") {
                    const produceIndex = oldData.Produce.findIndex((p) => p.Name === itemName);
                    const totalAmount = oldData.Produce[produceIndex]?.Amount || 1;

                    // updates the player to gift to data
                    oldData.Produce = oldData.Produce.filter((p) => p.Name !== itemName);

                    // gives the player the produce
                    createEntity.insertProduce(playerToGiftToEntity, itemName as ProduceNames, itemVariant, totalAmount);
                }

                return oldData;
            })

            // notifies both players
            routes.notify.sendTo({
                text: playerGifting.Name + " has gifted you!",
                duration: 5,
            }, playerToGiftTo);
            routes.notify.sendTo({
                text: "You have gifted " + playerToGiftTo.Name + "!",
                duration: 5,
            }, playerGifting);

            // print test statements
            printTS($line, playerGifting.Name + " is gifting to", playerToGiftTo.Name)
        }
    })

    // use event to watch for purchase
    for (const [_userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        let userId = _userId;
        let player = Players.GetPlayerByUserId(userId) as Player
        let playerEntity = player && getEntity.fromInstance(player);
        const shopVillagerIndex = ShopData.Villagers.findIndex((v) => v.ProductId === productId);

        // makes sure its from the villagers page
        if (shopVillagerIndex === -1 || productId === 3308848691 || productId === 3309650571) {
            // if the purchase was successful and the player exists
            if (wasPurchased && player && playerEntity) {
                const playerToGiftTo = world.get(playerEntity, GiftTo) as Player
                const hasGitTo = world.has(playerEntity, GiftTo)
                const isTheSamePlayer = playerToGiftTo && playerToGiftTo.UserId === userId;

                // plays the purchase sound to the player
                routes.playSound.sendTo({
                    sound: paths.SFX.UI.purchasepass,
                    position: undefined
                }, player);


                printJecs($line, `Gift to`, playerToGiftTo, "for", productId, "was purchased:", wasPurchased);
                printJecs($line, player.Name + " purchased product", productId, "for", "Robux");
                if (hasGitTo && playerToGiftTo) {
                    // removes gift to
                    removeComponent(playerEntity, GiftTo)

                    // if the player to gift to is not a valid player in the game then return
                    if (!playerToGiftTo.Parent) return

                    // notifies both players
                    if (!isTheSamePlayer) {
                        routes.notify.sendTo({
                            text: player.Name + " has gifted you!",
                            duration: 5,
                        }, playerToGiftTo);
                        routes.notify.sendTo({
                            text: "You have gifted " + playerToGiftTo.Name + "!",
                            duration: 5,
                        }, player);
                    }

                    // if the player has a gift to then sets the player to the player to gift to
                    player = playerToGiftTo;
                    userId = playerToGiftTo.UserId
                    playerEntity = getEntity.fromInstance(playerToGiftTo);
                }

                if (productId === 3308848691) { // purchaed a full restock on all villagers
                    const newData = new Array<VillagerInfo>();

                    // loops through all villagers and restocks them
                    ShopData.Villagers.forEach((villager, index) => {
                        newData[index] = {
                            ...villager,
                            InStock: 20, // sets the stock to 20
                        };
                    });

                    // updates the shop data with the new data
                    ShopData.Villagers = newData;
                } else if (productId === 3309650571) { // produce all
                    // adds a produce all to the player
                    if (playerEntity) addComponent(playerEntity, ProduceAll)
                } else {

                    // bought a villager from the shop
                    printJecs($line, player.Name + " bought villager from shop", shopVillagerIndex, "for", "Robux");
                    if (shopVillagerIndex !== undefined) {
                        const villagerData = ShopData.Villagers[shopVillagerIndex];
                        const entity = getEntity.fromInstance(player);
                        const data = entity && world.get(entity, Data)

                        // if data then
                        printJecs($line, "Villager data", villagerData, data);
                        if (data) {
                            // updates your data
                            createEntity.updateData(entity, (oldData) => {
                                createEntity.inventoryVillager(entity, villagerData.Name);
                                printJecs($line, player.Name + "Bought villager from shop", villagerData.Name, "for", "Robux");
                                return oldData;
                            });
                        }
                    }
                }
            } else if (!wasPurchased && playerEntity) { // makes sure to still remove the gift to
                removeComponent(playerEntity, GiftTo);

                // plays the purchase sound to the player
                routes.playSound.sendTo({
                    sound: paths.SFX.UI.purchasefail,
                    position: undefined
                }, player);
            }
        }
    }

    // when ever the option confirmation setting is called
    useRoute(routes.confirmSellOptions, (option, player) => {
        const playerEntity = getEntity.fromInstance(player);
        const body = playerEntity && world.get(playerEntity, Body);
        const data = playerEntity && world.get(playerEntity, Data);

        // if data then
        if (playerEntity && body && data) {
            const wallMultiplier = data.Walls.find((wall) => wall.Equipped)?.CashMultiplier || 1;

            if (option === "Option1") {
                // sells all your items in your inventory
                createEntity.updateData(playerEntity, (oldData) => {
                    // if you have enough
                    if ((oldData.Villagers.size() + oldData.Produce.size()) < 1) routes.npcDialogue.sendTo({
                        text: "You’re not holding anything to sell.",
                        target: "Sell",
                    }, player);

                    // loops through your villagers tallys them up
                    oldData.Villagers.forEach((villagerData) => {
                        if (villagerData.RelativeLocation) return; // skip if the villager is placed
                        const villagerName = villagerData.Name;
                        oldData.Coins += (ShopData.SellPrice[villagerName] || 0) * wallMultiplier; // adds the coins from the villager
                    });

                    // loops through your produce tallys them up
                    oldData.Produce.forEach((produceData) => {
                        const produceName = produceData.Name;
                        const variantMultiplier = (produceData.Variant === "Rainbow" ? 50 : produceData.Variant === "Gold" ? 10 : 1);
                        oldData.Coins += (ShopData.SellPrice[produceName] || 0) * wallMultiplier * variantMultiplier; // adds the coins from the produce
                    });

                    // removes the villagers that arent spawned
                    oldData.Villagers = oldData.Villagers.filter((villagerData) => villagerData.RelativeLocation ? true : false);
                    oldData.Produce.clear();

                    // prints the sell message
                    printTS($line, player.Name + " sold all items for", oldData.Coins, "Coins");

                    return oldData;
                });
            } else if (option === "Option2") { // just sells the equipped tool
                const tool = body.model.FindFirstChildOfClass("Tool") as Tool;

                // if the tool is a villager then sells it
                if (tool) {
                    const itemName = tool.GetAttribute("ItemName") as VillagerNames | ProduceNames;
                    const uniqueId = tool.GetAttribute("UniqueId") as number;
                    const villagerInfo = uniqueId !== undefined ? data.Villagers.find((v) => v.UniqueId === uniqueId) : undefined;
                    const produceInfo = data.Produce.find((p) => p.Name === itemName);

                    // removes the item from the data
                    createEntity.updateData(playerEntity, (oldData) => {
                        // if the villager info is found then remove it
                        if (villagerInfo) {
                            printTS($line, player.Name + " sold villager", itemName, "for", ShopData.SellPrice[itemName] || 0, "Coins");
                            oldData.Villagers = oldData.Villagers.filter((v) => v.UniqueId !== uniqueId);
                            oldData.Coins += (ShopData.SellPrice[itemName] || 0) * wallMultiplier; // adds the coins from the villager
                        } else if (produceInfo) { // if the produce info is found then remove it
                            const sellPrice = (ShopData.SellPrice[itemName] || 0) * (produceInfo.Variant === "Rainbow" ? 50 : produceInfo.Variant === "Gold" ? 10 : 1);
                            printTS($line, player.Name + " sold produce", itemName, "for", sellPrice || 0, "Coins");
                            oldData.Produce = oldData.Produce.filter((p) => p.Name !== itemName);
                            oldData.Coins += (sellPrice || 0) * wallMultiplier; // adds the coins from the produce
                        }

                        return oldData
                    })
                } else {
                    routes.npcDialogue.sendTo({
                        text: "You’re not holding anything to sell.",
                        target: "Sell",
                    }, player);
                }
            } else if (option === "Option3") { // tells you with routes.notify how much this tool your holding cost
                const tool = body.model.FindFirstChildOfClass("Tool") as Tool;
                const itemName = tool && tool.GetAttribute("ItemName") as VillagerNames | ProduceNames;
                const isVillager = tool && tool.GetAttribute("UniqueId") as boolean;
                const variant = tool && tool.GetAttribute("ItemVariant") as ProduceVariant;

                // if the tool is a villager then tells you how much it costs
                if (tool && itemName) {
                    const variantMultiplier = (variant === "Rainbow" ? 50 : variant === "Gold" ? 10 : 1);
                    const produceInfo = variant && data.Produce.find((p) => p.Name === itemName && p.Variant === variant);
                    const totalItemCount = isVillager ? 1 : produceInfo?.Amount || 1;
                    routes.npcDialogue.sendTo({
                        text: `That would sell for ${(ShopData.SellPrice[itemName] || 0) * totalItemCount * wallMultiplier * variantMultiplier} Coins`,
                        target: "Sell",
                    }, player);
                } else {
                    routes.npcDialogue.sendTo({
                        text: "You’re not holding anything to sell.",
                        target: "Sell",
                    }, player);
                }
            } else if (option === "Option4") { // closes sell menu
                routes.toggleSellMenuOpen.sendTo(false, player);
            }
        }
    })

    // when ever a request is made to buy a villager
    useRoute(routes.buyVillager, ({ villagerIndex, currency }, player) => {
        const entity = getEntity.fromInstance(player);
        const data = entity && world.get(entity, Data)

        // if data then
        if (data) {
            const villagerData = ShopData.Villagers[villagerIndex]
            const totalPrice = villagerData.Price;

            if (currency === "Coins") {

                // if not in stock then return
                if (villagerData.InStock < 1) return

                // if the player has enough coins then takes coins
                createEntity.updateData(entity, (oldData) => {
                    const currency = oldData.Coins

                    if (currency >= totalPrice) {
                        // plays the purchase sound to the player
                        routes.playSound.sendTo({
                            sound: paths.SFX.UI.purchasepass,
                            position: undefined
                        }, player);

                        // updates your data
                        oldData.Coins -= totalPrice
                        createEntity.inventoryVillager(entity, villagerData.Name)

                        // takes from stock and sets the new shop data
                        takeVillagerFromStock(villagerData.Name)
                    } else {
                        // plays the purchase sound to the player
                        routes.playSound.sendTo({
                            sound: paths.SFX.UI.purchasefail,
                            position: undefined
                        }, player);
                    }

                    return oldData
                })
            } else if (currency === "Robux") {
                MarketplaceService.PromptProductPurchase(player, villagerData.ProductId);
            }
        }
    })
}