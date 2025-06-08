import { pair, World } from "@rbxts/jecs";
import { RunService } from "@rbxts/services";
import { ModelDebugger, Changed, TargetEntity } from "shared/utils/jecs/jecsComponents";


// import
const name = RunService.IsServer() && "serverEntityId" || "clientEntityId"


export default (world: World) => {
    for (const [_, entity, record] of world.query(TargetEntity, Changed(ModelDebugger))) {
        if (record.new) {
            record.new.SetAttribute(name, entity)
        }
    }
}