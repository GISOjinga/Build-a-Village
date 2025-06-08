import { ReplicatedStorage, Workspace } from "@rbxts/services";

export default {
    Characters: Workspace.WaitForChild("Characters") as Characters,
    Assets: ReplicatedStorage.WaitForChild("Assets") as Assets,
    Map: Workspace.WaitForChild("GameMap") as GameMap,
}