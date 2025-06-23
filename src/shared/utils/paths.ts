import { ReplicatedStorage, SoundService, Workspace } from "@rbxts/services";

export default {
    Characters: Workspace.WaitForChild("Characters") as Characters,
    Assets: ReplicatedStorage.WaitForChild("Assets") as Assets,
    Map: Workspace.WaitForChild("GameMap") as GameMap,
    TestPlacementFolder: Workspace.WaitForChild("TestPlacementFolder") as Folder,
    SFX: SoundService.WaitForChild("SFXFolder") as SFXFolder
}