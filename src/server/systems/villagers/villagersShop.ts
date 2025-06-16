import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import { useEvent, useMemo } from "shared/Plugin-Hook";
import ShopData from "./ShopData";
import { Added, Data, GiftTo, Player } from "shared/utils/jecs/jecsComponents";
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