import { Centurion } from "@rbxts/centurion";
import { useMemo, useEvent } from "shared/Plugin-Hook"
import { ReplicatedStorage } from "@rbxts/services";




export default () => {
    useMemo(() => task.spawn(() => {
        const server = Centurion.server();

        // Load all child ModuleScripts under each container
        server.registry.load(ReplicatedStorage.WaitForChild("TS").WaitForChild("utils").WaitForChild("typeContainer"))
        server.registry.load(script.Parent!.WaitForChild("commandContainer"))

        // starts commander
        server.start();
    }), [])
}