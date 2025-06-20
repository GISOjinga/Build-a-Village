import { pair, World } from "@rbxts/jecs";
import { RunService } from "@rbxts/services";
import { ModelDebugger, Changed, TargetEntity } from "shared/utils/jecs/jecsComponents";


// import
const name = RunService.IsServer() && "ServerId" || "ClientId"


export default (world: World) => {
    for (const [_, entity, record] of world.query(TargetEntity, Changed(ModelDebugger))) {
        const model = record.new || record.old;
        if (model) model.SetAttribute(name, record.new ? entity : undefined);
    }
}