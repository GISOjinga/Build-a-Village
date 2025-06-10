import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import { useMemo } from "shared/Plugin-Hook";
import villagersShopData from "./villagersShopData";
import { Added, Data, Player } from "shared/utils/jecs/jecsComponents";
import { createEntity, getEntity, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import { $line } from "rbxts-transformer-inline";







export default (world: World) => {
    // when ever a player gets added sends out the villagers
    for (const [_, player] of world.query(Added(Player))) {
        routes.updateVillagersShop.sendTo(villagersShopData, player)
    }

    // when ever a request is made to buy a villager
    useRoute(routes.buyVillager, ({ villagerIndex, currency }, player) => {
        const entity = getEntity.fromInstance(player);
        const data = entity && world.get(entity, Data)

        // if data then
        if (data) {
            if (currency === "Coins") {
                const villagerData = villagersShopData[villagerIndex]
                const totalPrice = villagerData.Price;

                // if the player has enough coins then takes coins
                createEntity.updateData(entity, (oldData) => {
                    const currency = oldData.Coins

                    if (currency >= totalPrice) {
                        oldData.Coins -= totalPrice
                        createEntity.inventoryVillager(entity, villagerData.Name)
                    }

                    return oldData
                })
            }
        }
    })
}