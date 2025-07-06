import { Janitor } from "@rbxts/janitor";
import { RunService, UserInputService } from "@rbxts/services";
import { effect } from "@rbxts/charm";
import { $line } from "rbxts-transformer-inline";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import pageStates from "shared/utils/Animations/pageStates";

export interface DragResult {
    position: Vector2;
    input: InputObject;
}

export default function useDrag(gui: GuiObject, onDrop: (result: DragResult) => void): Janitor {
    const janitor = new Janitor();
    let dragging = false;
    let inputObj: InputObject | undefined;
    let originalPosition = gui.Position;
    let clone: GuiObject | undefined;

    gui.Active = true;
    printTS($line, `Setting GUI ${gui} to be draggable`);

    function stopDrag() {
        if (!dragging) return;
        dragging = false;
        gui.Visible = true;
        gui.ZIndex -= 1000;
        clone?.Destroy();
        clone = undefined;
    }

    janitor.Add(stopDrag);

    janitor.Add(
        gui.InputBegan.Connect((input) => {
            if (UIUtilities.IsInputActivated(input) && pageStates.openPage() === "Inventory") {
                printTS($line, `Starting drag for GUI: ${gui} with input: ${input}`);
                dragging = true;
                inputObj = input;
                originalPosition = gui.Position;
                gui.ZIndex += 1000;
                gui.Visible = false;

                clone = gui.Clone();
                const screen = gui.FindFirstAncestorOfClass("ScreenGui");
                clone.Parent = screen ?? gui.Parent;
                clone.ZIndex = gui.ZIndex;
                clone.Position = UDim2.fromOffset(gui.AbsolutePosition.X, gui.AbsolutePosition.Y);
            }
        })
    );

    janitor.Add(
        RunService.RenderStepped.Connect(() => {
            if (!dragging || !inputObj || pageStates.openPage() !== "Inventory" || !clone) return;
            const pos = inputObj.Position;
            const size = gui.AbsoluteSize.div(2);
            clone.Position = UDim2.fromOffset(pos.X - size.X, pos.Y - size.Y);
        })
    );

    janitor.Add(
        UserInputService.InputEnded.Connect((input) => {
            if (!dragging || input !== inputObj) return;
            stopDrag();
            gui.Position = originalPosition;
            onDrop({ position: new Vector2(input.Position.X, input.Position.Y), input });
        })
    );

    janitor.Add(
        effect(() => {
            if (dragging && pageStates.openPage() !== "Inventory") {
                stopDrag();
            }
        })
    );

    return janitor;
}
