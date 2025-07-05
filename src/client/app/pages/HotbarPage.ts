import { Janitor } from "@rbxts/janitor";
import { Players, UserInputService, RunService, StarterGui, Workspace } from "@rbxts/services";
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

    const hotbar = pagePaths.InventoryPage.Hotbar;
    const slotTemplate = hotbar.SlotExample;
    slotTemplate.Visible = false;

    const dragged = { slot: undefined as ImageButton | undefined, offset: new Vector2() };

    function getSlotCount() {
        const width = Workspace.CurrentCamera?.ViewportSize.X ?? 0;
        return width < 700 ? 3 : 5;
    }

    function renderSlots() {
        hotbar.GetChildren().forEach(c => { if (c !== slotTemplate && !c.IsA("UIListLayout")) c.Destroy(); });
        const slotCount = getSlotCount();
        setHotbarSize(slotCount);
        for (let i = 0; i < slotCount; i++) {
            const slot = slotTemplate.Clone();
            slot.Visible = true;
            slot.Position = UDim2.fromScale(i / slotCount, 0);
            slot.Size = UDim2.fromScale(1 / slotCount, 1);
            const tool = hotbarTools[i];
            slot.ToolName.Text = tool ? tool.Name : "";
            slot.Key.Text = `${i + 1}`;
            slot.SetAttribute("Index", i);
            slot.Parent = hotbar;
            trash.Add(UIUtilities.ButtonAction({ Button: slot }, () => {
                if (tool) routes.equipTool.send({ toolName: tool.Name });
            }));
            setupDrag(slot, i);
        }
    }

    function setupDrag(slot: ImageButton, index: number) {
        trash.Add(slot.InputBegan.Connect((input) => {
            if (input.UserInputType !== Enum.UserInputType.MouseButton1 && input.UserInputType !== Enum.UserInputType.Touch) return;
            dragged.slot = slot;
            dragged.offset = new Vector2(slot.AbsolutePosition.X - input.Position.X, slot.AbsolutePosition.Y - input.Position.Y);
            slot.Parent = gameUI;
            slot.ZIndex = 100;
        }));

        const finishDrag = (input: InputObject) => {
            const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
            if (!dragged.slot) return;
            const guiObjects = playerGui.GetGuiObjectsAtPosition(input.Position.X, input.Position.Y);
            const inventoryContainer = pagePaths.InventoryPage;
            const invFrame = inventoryContainer.Container
            const invTarget = guiObjects.find((v: GuiObject) => invFrame && v.IsDescendantOf(invFrame) && v.IsA("Frame")) as Frame | undefined;
            if (invTarget && invFrame) {
                const toIndex = invTarget.GetAttribute("Index") as number;
                moveHotbarToInv(index, toIndex ?? inventoryTools.size());
            } else {
                const hotTarget = guiObjects.find((v: GuiObject) => v.IsDescendantOf(hotbar) && v.IsA("ImageButton")) as ImageButton | undefined;
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
