import { Janitor } from "@rbxts/janitor";
import { UserInputService } from "@rbxts/services";
import UIUtilities from "shared/utils/Animations/uiUtilities";

export interface DragResult {
    position: Vector2;
    input: InputObject;
}

export default function useDrag(gui: GuiObject, onDrop: (result: DragResult) => void): Janitor {
    const janitor = new Janitor();
    let dragging = false;
    let inputObj: InputObject | undefined;
    let originalPosition = gui.Position;

    gui.Active = true;

    janitor.Add(gui.InputBegan.Connect((input) => {
        if (UIUtilities.IsInputActivated(input)) {
            dragging = true;
            inputObj = input;
            originalPosition = gui.Position;
            gui.ZIndex += 1000;
        }
    }));

    janitor.Add(UserInputService.InputChanged.Connect((input) => {
        if (!dragging || input !== inputObj) return;
        const pos = input.Position;
        const size = gui.AbsoluteSize.div(2);
        gui.Position = UDim2.fromOffset(pos.X - size.X, pos.Y - size.Y);
    }));

    janitor.Add(UserInputService.InputEnded.Connect((input) => {
        if (!dragging || input !== inputObj) return;
        dragging = false;
        gui.ZIndex -= 1000;
        gui.Position = originalPosition;
        onDrop({ position: input.Position, input });
    }));

    janitor.Add(() => {
        gui.ZIndex = gui.ZIndex - (dragging ? 1000 : 0);
        dragging = false;
    });

    return janitor;
}
