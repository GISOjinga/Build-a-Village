import { Janitor } from "@rbxts/janitor";
import { UserInputService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";

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
    printTS($line, `Setting GUI ${gui} to be draggable`);

    janitor.Add(gui.InputBegan.Connect((input) => {
        if (UIUtilities.IsInputActivated(input)) {
            printTS($line, `Starting drag for GUI: ${gui} with input: ${input}`);
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
        printTS($line, `Dragging GUI: ${gui} at position: ${pos.X}, ${pos.Y}`);
        gui.Position = UDim2.fromOffset(pos.X - size.X, pos.Y - size.Y);
    }));

    janitor.Add(UserInputService.InputEnded.Connect((input) => {
        if (!dragging || input !== inputObj) return;
        dragging = false;
        gui.ZIndex -= 1000;
        gui.Position = originalPosition;
        onDrop({ position: new Vector2(input.Position.X, input.Position.Y), input });
    }));

    janitor.Add(() => {
        gui.ZIndex = gui.ZIndex - (dragging ? 1000 : 0);
        dragging = false;
    });

    return janitor;
}
