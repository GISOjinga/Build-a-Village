import { useMemo, useEvent } from "shared/Plugin-Hook"
import { Centurion } from "@rbxts/centurion";
import { CenturionUI } from "@rbxts/centurion-ui";
import characterType from "shared/utils/typeContainer/characterType";
import { ReplicatedStorage } from "@rbxts/services";



export default () => {
    useMemo(() => task.spawn(() => {
        const client = Centurion.client()

        client.registry.load(ReplicatedStorage.WaitForChild("TS").WaitForChild("utils").WaitForChild("typeContainer"))

        client.start()
            .then(() => CenturionUI.start(Centurion.client(), {}))
            .catch((err) => warn("Failed to start Centurion:", err));
    }), [])
}