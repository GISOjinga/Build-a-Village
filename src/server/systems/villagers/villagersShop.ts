import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import { useEvent, useMemo } from "shared/Plugin-Hook";
import ShopData from "./ShopData";
import { Added, Body, Data, GiftTo, Player } from "shared/utils/jecs/jecsComponents";
import { addComponent, createEntity, getEntity, printJecs, printTS, removeComponent } from "shared/utils/functions/jecsHelpFunctions";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { $line } from "rbxts-transformer-inline";
import { MarketplaceService, Players } from "@rbxts/services";
import { selectVillagerToRestock } from "./villagerAlgorithim";



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
    useRoute(routes.giftTo, (playerToGiftTo, player) => {
        const playerEntity = getEntity.fromInstance(player);

        // if data then
        if (playerEntity) {
            addComponent(playerEntity, GiftTo, playerToGiftTo)
            printJecs($line, player.Name + " is gifting to", playerToGiftTo.Name)
        };
    })

    // use event to watch for purchase
    for (const [_userId, productId, wasPurchased] of useEvent(MarketplaceService.PromptProductPurchaseFinished)) {
        let userId = _userId;
        let player = Players.GetPlayerByUserId(userId) as Player
        const playerEntity = player && getEntity.fromInstance(player);

        // if the purchase was successful and the player exists
        if (wasPurchased && player && playerEntity) {
            const playerToGiftTo = world.get(playerEntity, GiftTo) as Player
            const hasGitTo = world.has(playerEntity, GiftTo)

            printJecs($line, `Gift to`, playerToGiftTo, "for", productId, "was purchased:", wasPurchased);
            printJecs($line, player.Name + " purchased product", productId, "for", "Robux");
            if (hasGitTo && playerToGiftTo) {
                // removes gift to
                removeComponent(playerEntity, GiftTo)

                // if the player to gift to is not a valid player in the game then return
                if (!playerToGiftTo.Parent) return

                // notifies both players
                routes.notify.sendTo({
                    text: player.Name + " has gifted you!",
                    duration: 5,
                }, playerToGiftTo);
                routes.notify.sendTo({
                    text: "You have gifted " + playerToGiftTo.Name + "!",
                    duration: 5,
                }, player);

                // if the player has a gift to then sets the player to the player to gift to
                player = playerToGiftTo;
                userId = playerToGiftTo.UserId
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
            } else {
                const shopVillagerIndex = ShopData.Villagers.findIndex((v) => v.ProductId === productId);

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
        }
    }

    // when ever the option confirmation setting is called
    useRoute(routes.confirmSellOptions, (option, player) => {
        const playerEntity = getEntity.fromInstance(player);
        const body = playerEntity && world.get(playerEntity, Body);
        const data = playerEntity && world.get(playerEntity, Data);

        // if data then
        if (playerEntity && body && data) {
            if (option === "Option1") {
                // sells all your items in your inventory
                createEntity.updateData(playerEntity, (oldData) => {
                    const totalItemsWithNames = new Map<(VillagerNames | ProduceNames), number>();

                    // loops through your villagers tallys them up
                    oldData.Villagers.forEach((villagerData) => {
                        if (villagerData.RelativeLocation) return; // skip if the villager is placed
                        const villagerName = villagerData.Name;
                        const currentAmount = totalItemsWithNames.get(villagerName) || 0;
                        totalItemsWithNames.set(villagerName, currentAmount + 1);
                    });

                    // loops through your produce tallys them up
                    oldData.Produce.forEach((produceData) => {
                        const produceName = produceData.Name;
                        const currentAmount = totalItemsWithNames.get(produceName) || 0;
                        totalItemsWithNames.set(produceName, currentAmount + produceData.Amount);
                    });

                    // removes the villagers that arent spawned
                    oldData.Villagers = oldData.Villagers.filter((villagerData) => villagerData.RelativeLocation ? true : false);
                    oldData.Produce.clear();

                    // adds up your coins
                    totalItemsWithNames.forEach((amount, name) => {
                        oldData.Coins += amount * ShopData.SellPrice[name];
                    });

                    printTS($line, player.Name + " sold all items for", oldData.Coins, "Coins");

                    if (totalItemsWithNames.size() < 1) routes.notify.sendTo({
                        text: "You’re not holding anything to sell.",
                        duration: 5,
                    }, player);

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
                            oldData.Coins += ShopData.SellPrice[itemName] || 0; // adds the coins from the villager
                        } else if (produceInfo) { // if the produce info is found then remove it
                            printTS($line, player.Name + " sold produce", itemName, "for", ShopData.SellPrice[itemName] || 0, "Coins");
                            oldData.Produce = oldData.Produce.filter((p) => p.Name !== itemName);
                            oldData.Coins += ShopData.SellPrice[itemName] || 0; // adds the coins from the produce
                        }

                        return oldData
                    })
                } else {
                    routes.notify.sendTo({
                        text: "You’re not holding anything to sell.",
                        duration: 5,
                    }, player);
                }
            } else if (option === "Option3") { // tells you with routes.notify how much this tool your holding cost
                const tool = body.model.FindFirstChildOfClass("Tool") as Tool;
                const itemName = tool && tool.GetAttribute("ItemName") as VillagerNames | ProduceNames;
                const isVillager = tool && tool.GetAttribute("UniqueId") as boolean;

                // if the tool is a villager then tells you how much it costs
                if (tool && itemName) {
                    const totalItemCount = isVillager ? 1 : data.Produce.find((p) => p.Name === itemName)?.Amount || 1;
                    routes.notify.sendTo({
                        text: `That would sell for ${(ShopData.SellPrice[itemName] || 0) * totalItemCount} Coins`,
                        duration: 5,
                    }, player);
                } else {
                    routes.notify.sendTo({
                        text: "You’re not holding anything to sell.",
                        duration: 5,
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
                        // updates your data
                        oldData.Coins -= totalPrice
                        createEntity.inventoryVillager(entity, villagerData.Name)

                        // takes from stock and sets the new shop data
                        takeVillagerFromStock(villagerData.Name)
                    }

                    return oldData
                })
            } else if (currency === "Robux") {
                MarketplaceService.PromptProductPurchase(player, villagerData.ProductId);
            }
        }
    })
}