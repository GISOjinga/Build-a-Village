import { Janitor } from "@rbxts/janitor";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { effect } from "@rbxts/charm";
import { $line } from "rbxts-transformer-inline";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import { printTS, warnJecs, warnTS } from "shared/utils/functions/jecsHelpFunctions";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "./useEffect";

export interface DragResult {
    position: Vector2;
}

export default function useDrag(clickable: GuiButton, container: GuiObject, onDrop: (result: DragResult) => void): Janitor {
    const trash = new Janitor();
    const mouse = Players.LocalPlayer.GetMouse();
    let dragging = false;
    let dragClone: GuiObject | undefined;
    let dragConnection: RBXScriptConnection | undefined;

    // Begin drag logic
    const beginDrag = () => {
        if (pageStates.openPage() !== "Inventory") return;

        dragging = true;

        container.Visible = false;
        container.ZIndex += 1000;

        // Clone and setup dragClone
        const clone = container.Clone();
        const screen = container.FindFirstAncestorOfClass("ScreenGui");


        clone.Size = UDim2.fromOffset(container.AbsoluteSize.X, container.AbsoluteSize.Y);
        clone.ZIndex = container.ZIndex;
        clone.Position = UDim2.fromOffset(container.AbsolutePosition.X, container.AbsolutePosition.Y);
        clone.Visible = true;
        clone.Parent = screen;

        dragClone = clone;

        // Smooth drag movement
        pageStates.isDragging(true);
        dragConnection = trash.Add(RunService.RenderStepped.Connect(() => {
            if (!dragging || !dragClone) return;
            const size = dragClone.AbsoluteSize.div(2);
            dragClone.Position = UDim2.fromOffset(mouse.X - size.X, mouse.Y - size.Y);
            dragClone.Size = UDim2.fromOffset(container.AbsoluteSize.X, container.AbsoluteSize.Y);
        }))

        if (!screen) {
            warnTS($line, "Could not find ScreenGui for dragging");
            stopDrag();
            return;
        }
    };

    // Stop drag and clean up
    const stopDrag = () => {
        if (!dragging) return;

        dragging = false;

        if (dragClone) {
            dragClone.Destroy();
            dragClone = undefined;
        }

        if (dragConnection) {
            dragConnection.Disconnect();
            dragConnection = undefined;
        }

        container.Visible = true;
        container.ZIndex -= 1000;
        pageStates.isDragging(false);
    };

    // Listen for input start
    UIUtilities.ButtonAction({
        Button: clickable,
    }, () => { }, () => {
        if (dragging || pageStates.openPage() !== "Inventory") return;
        beginDrag();
    })

    trash.Add(UserInputService.InputEnded.Connect((input) => {
        if (!dragging || !UIUtilities.IsInputActivated(input)) return;

        const dropPos = new Vector2(input.Position.X, input.Position.Y);
        onDrop({ position: dropPos });
        stopDrag();
    }));

    // Cancel drag if page closes
    trash.Add(useEffect(() => {
        if (dragging && pageStates.openPage() !== "Inventory") {
            stopDrag();
        }
    }),
    );

    // Cleanup on Janitor destroy
    trash.Add(() => stopDrag());

    return trash;
}
