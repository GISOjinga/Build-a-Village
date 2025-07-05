import { Janitor } from "@rbxts/janitor";
import { Players, UserInputService, RunService, StarterGui } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import {
    hotbarTools,
    hotbarChanged,
    initialize,
    setHotbarSize,
    swapHotbar,
    moveHotbarToInv,
    inventoryTools,
} from "../state/toolData";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const gameUI = pagePaths.Page;
    const player = Players.LocalPlayer;
    const backpack = player.WaitForChild("Backpack") as Backpack;
    initialize(backpack);

    const hotbar = new Instance("Frame");
    hotbar.Name = "Hotbar";
    hotbar.AnchorPoint = new Vector2(0.5, 1);
    hotbar.Position = UDim2.fromScale(0.5, 1);
    hotbar.Size = UDim2.fromScale(0.5, 0.08);
    hotbar.BackgroundTransparency = 1;
    hotbar.Parent = gameUI;

    const slotTemplate = new Instance("TextButton");
    slotTemplate.BackgroundTransparency = 0.3;
    slotTemplate.TextScaled = true;
    slotTemplate.Size = UDim2.fromScale(0.2, 1);

    const dragged = { slot: undefined as TextButton | undefined, offset: new Vector2() };

    function getSlotCount() {
        const width = workspace.CurrentCamera?.ViewportSize.X ?? 0;
        return width < 700 ? 3 : 5;
    }

    function renderSlots() {
        hotbar.ClearAllChildren();
        const slotCount = getSlotCount();
        setHotbarSize(slotCount);
        for (let i = 0; i < slotCount; i++) {
            const slot = slotTemplate.Clone();
            slot.Position = UDim2.fromScale(i / slotCount, 0);
            slot.Size = UDim2.fromScale(1 / slotCount, 1);
            const tool = hotbarTools[i];
            slot.Text = tool ? tool.Name : "";
            slot.SetAttribute("Index", i);
            slot.Parent = hotbar;
            trash.Add(UIUtilities.ButtonAction({ Button: slot }, () => {
                if (tool) routes.equipTool.send({ toolName: tool.Name });
            }));
            setupDrag(slot, i);
        }
    }

    function setupDrag(slot: TextButton, index: number) {
        trash.Add(slot.InputBegan.Connect((input) => {
            if (input.UserInputType !== Enum.UserInputType.MouseButton1 && input.UserInputType !== Enum.UserInputType.Touch) return;
            dragged.slot = slot;
            dragged.offset = new Vector2(slot.AbsolutePosition.X - input.Position.X, slot.AbsolutePosition.Y - input.Position.Y);
            slot.Parent = gameUI;
            slot.ZIndex = 100;
        }));

        const finishDrag = (input: InputObject) => {
            if (!dragged.slot) return;
            const guiObjects = gameUI.GetGuiObjectsAtPosition(input.Position.X, input.Position.Y);
            const inventoryContainer = pagePaths.InventoryPage?.SlotsContainer as Frame | undefined;
            const invTarget = guiObjects.find(v => inventoryContainer && v.IsDescendantOf(inventoryContainer) && v.IsA("Frame")) as Frame | undefined;
            if (invTarget && inventoryContainer) {
                const toIndex = invTarget.GetAttribute("Index") as number;
                moveHotbarToInv(index, toIndex ?? inventoryTools.size());
            } else {
                const hotTarget = guiObjects.find(v => v.IsDescendantOf(hotbar) && v.IsA("TextButton")) as TextButton | undefined;
                if (hotTarget && hotTarget !== dragged.slot) {
                    const toIndex = hotTarget.GetAttribute("Index") as number;
                    swapHotbar(index, toIndex);
                }
            }
            dragged.slot.Parent = hotbar;
            dragged.slot.ZIndex = slotTemplate.ZIndex;
            dragged.slot = undefined;
        };
        trash.Add(UserInputService.InputChanged.Connect((input) => {
            if (!dragged.slot || (input.UserInputType !== Enum.UserInputType.MouseMovement && input.UserInputType !== Enum.UserInputType.Touch)) return;
            const newPos = UDim2.fromOffset(input.Position.X + dragged.offset.X, input.Position.Y + dragged.offset.Y);
            dragged.slot.Position = newPos;
        }));
        trash.Add(UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) finishDrag(input);
        }));
    }

    trash.Add(backpack.ChildAdded.Connect(renderSlots));
    trash.Add(backpack.ChildRemoved.Connect(renderSlots));
    trash.Add(hotbarChanged.Connect(renderSlots));
    trash.Add(RunService.Heartbeat.Connect(() => renderSlots()));

    trash.Add(UserInputService.InputBegan.Connect((input, gp) => {
        if (gp) return;
        const slotCount = getSlotCount();
        const index = input.KeyCode.Value - Enum.KeyCode.One.Value + 1;
        if (index >= 1 && index <= slotCount) {
            const tools = backpack.GetChildren().filter((c) => c.IsA("Tool")) as Tool[];
            const tool = tools[index - 1];
            if (tool) routes.equipTool.send({ toolName: tool.Name });
        }
    }));

    renderSlots();

    StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

    return trash;
};
