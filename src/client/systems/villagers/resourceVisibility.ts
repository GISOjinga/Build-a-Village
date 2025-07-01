import { World } from "@rbxts/jecs";
import { useEvent } from "shared/Plugin-Hook";
import { ReplicatedComponent, Villager } from "shared/utils/jecs/jecsComponents";

function applyVisibility(model: Model) {
    const ready = model.GetAttribute<boolean>("Ready");
    const visible = ready ? true : false;
    model.GetDescendants().forEach((child) => {
        if (child.IsA("BasePart") || child.IsA("Decal")) {
            const trueTransparency = child.GetAttribute<number>("Transparency") ?? child.Transparency;
            if (child.IsA("BasePart")) child.CollisionGroup = visible ? "Default" : "NoCollision";
            child.Transparency = visible ? trueTransparency : 1;
        }
    });
}

export default (world: World) => {
    for (const [_, __, villager] of world.query(ReplicatedComponent, Villager)) {
        const resources = villager.villagerModel.Station.Parts.Resources.GetChildren();
        resources.forEach((model) => {
            if (model.IsA("Model")) {
                applyVisibility(model);
                for (const [] of useEvent(model.GetAttributeChangedSignal("Ready"), model)) {
                    applyVisibility(model);
                }
            }
        });
    }
};
