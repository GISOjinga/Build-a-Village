import { Janitor } from "@rbxts/janitor";
import { Players, TweenService, UserInputService } from "@rbxts/services";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";

// simple inventory page with drag and drop and sorting buttons
export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const inventoryPage = pagePaths.InventoryPage;
    const slotTemplate = inventoryPage.SlotsContainer.Sample as Frame;
    const slotsContainer = inventoryPage.SlotsContainer as Frame;
    const sortButtons = inventoryPage.SortButtons.GetChildren().filter((v) => v.IsA("GuiButton")) as GuiButton[];

    const backpack = Players.LocalPlayer.FindFirstChild("Backpack") as Backpack | undefined;
    const dragged = { slot: undefined as Frame | undefined, offset: new Vector2() };
    const items = new Array<Tool>();

    // load current items
    const reloadItems = () => {
        items.clear();
        if (!backpack) return;
        backpack.GetChildren().forEach((child) => {
            if (child.IsA("Tool")) items.push(child);
        });
        items.sort((a, b) => a.Name < b.Name ? -1 : 1);
        refreshDisplay();
    };

    // display items
    const refreshDisplay = () => {
        slotsContainer.GetChildren().forEach((c) => { if (c !== slotTemplate && c.IsA("Frame")) c.Destroy(); });
        items.forEach((tool, index) => {
            const slot = slotTemplate.Clone();
            slot.Visible = true;
            slot.Name = `Slot${index}`;
            const label = slot.FindFirstChild("ToolName") as TextLabel | undefined;
            if (label) label.Text = tool.Name;
            slot.Parent = slotsContainer;
            setupDrag(slot, tool);
        });
    };

    // drag setup
    const setupDrag = (slot: Frame, tool: Tool) => {
        trash.Add(slot.InputBegan.Connect((input) => {
            if (input.UserInputType !== Enum.UserInputType.MouseButton1 && input.UserInputType !== Enum.UserInputType.Touch) return;
            dragged.slot = slot;
            const absPos = input.Position;
            dragged.offset = new Vector2(slot.AbsolutePosition.X - absPos.X, slot.AbsolutePosition.Y - absPos.Y);
            slot.Parent = inventoryPage;
            slot.ZIndex = 100;
        }));
        trash.Add(UserInputService.InputChanged.Connect((input) => {
            if (!dragged.slot || (input.UserInputType !== Enum.UserInputType.MouseMovement && input.UserInputType !== Enum.UserInputType.Touch)) return;
            const newPos = UDim2.fromOffset(input.Position.X + dragged.offset.X, input.Position.Y + dragged.offset.Y);
            TweenService.Create(dragged.slot, new TweenInfo(0.05), { Position: newPos }).Play();
        }));
        const endDrag = (input: InputObject) => {
            if (!dragged.slot) return;
            const guiObjects = inventoryPage.GetGuiObjectsAtPosition(input.Position.X, input.Position.Y);
            const target = guiObjects.find((v) => v.IsDescendantOf(slotsContainer) && v.IsA("Frame")) as Frame | undefined;
            if (target && target !== dragged.slot) {
                const fromIndex = items.findIndex((t) => t.Name === (dragged.slot!.FindFirstChild("ToolName") as TextLabel).Text);
                const toIndex = items.findIndex((_, i) => target.Name === `Slot${i}`);
                if (fromIndex >= 0 && toIndex >= 0) {
                    const [removed] = items.splice(fromIndex, 1);
                    items.splice(toIndex, 0, removed);
                }
            }
            dragged.slot.Position = slotTemplate.Position;
            dragged.slot.Parent = slotsContainer;
            dragged.slot.ZIndex = slotTemplate.ZIndex;
            dragged.slot = undefined;
            refreshDisplay();
        };
        trash.Add(UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) endDrag(input);
        }));
    };

    // sort buttons
    sortButtons.forEach((button, index) => {
        trash.Add(UIUtilities.ButtonAction({ Button: button }, () => {
            switch (index) {
                case 0:
                    items.sort((a, b) => a.Name < b.Name ? -1 : 1);
                    break;
                case 1:
                    items.sort((a, b) => a.Name > b.Name ? -1 : 1);
                    break;
                case 2:
                    items.sort((a, b) => a.CreationDate && b.CreationDate ? (a.CreationDate < b.CreationDate ? -1 : 1) : 0);
                    break;
                case 3:
                    items.sort((a, b) => a.ToolTip < b.ToolTip ? -1 : 1);
                    break;
                default:
                    items.reverse();
            }
            refreshDisplay();
        }));
    });

    // visibility
    trash.Add(useEffect(() => {
        const open = pageStates.openPage();
        inventoryPage.Visible = open === "Inventory";
        if (open === "Inventory") reloadItems();
    }));

    // initial state
    slotTemplate.Visible = false;
    reloadItems();
    return trash;
};
