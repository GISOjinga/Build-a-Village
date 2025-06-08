import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { Added, Body, TargetEntity } from "shared/utils/jecs/jecsComponents";




export default (world: World) => {

    for (const [_, clientEntity, body] of world.query(TargetEntity, Added(Body))) {
        const player = body && Players.GetPlayerFromCharacter(body.model)

        // when added it sets the client id property
        body?.model.SetAttribute("ClientId", clientEntity)
        player?.SetAttribute("ClientId", clientEntity)
    }
}