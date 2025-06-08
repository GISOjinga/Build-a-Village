import { Players } from "@rbxts/services";
import paths from "../paths";

export function GetMousePosition(): Vector3 {
    const player = Players.LocalPlayer
    const mouse = player.GetMouse();

    //mouse.TargetFilter = paths.IgnoreFolder;
    return mouse.Hit.Position;
}