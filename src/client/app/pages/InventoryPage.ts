import { Janitor } from "@rbxts/janitor";
import { Players, TweenService, UserInputService } from "@rbxts/services";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";
import {
    inventoryTools,
    inventoryChanged,
    moveInvToHotbar,
    swapInventory,
    hotbarTools,
} from "../state/toolData";

// simple inventory page with drag and drop and sorting buttons
export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const inventoryPage = pagePaths.InventoryPage;
    const slotTemplate = inventoryPage.SlotsContainer.Sample as Frame;
    const slotsContainer = inventoryPage.SlotsContainer as Frame;
    const sortButtons = inventoryPage.SortButtons.GetChildren().filter((v: Instance): v is GuiButton => v.IsA("GuiButton")) as GuiButton[];

    const backpack = Players.LocalPlayer.FindFirstChild("Backpack") as Backpack | undefined;
    const dragged = { slot: undefined as Frame | undefined, offset: new Vector2() };
    let activeSort = -1;

    const reloadItems = () => {
        if (!backpack) return;
        inventoryTools.clear();
        backpack.GetChildren().forEach((child) => {
            if (child.IsA("Tool")) inventoryTools.push(child);
        });
        applySort();
        inventoryChanged.Fire();
    };


    // display items
    const refreshDisplay = () => {
        slotsContainer.GetChildren().forEach((c) => { if (c !== slotTemplate && c.IsA("Frame")) c.Destroy(); });
        inventoryTools.forEach((tool, index) => {
            const slot = slotTemplate.Clone();
            slot.Visible = true;
            slot.Name = `Slot${index}`;
            slot.SetAttribute("Index", index);
            const label = slot.FindFirstChild("ToolName") as TextLabel | undefined;
            if (label) label.Text = tool.Name;
            slot.Parent = slotsContainer;
            setupDrag(slot, tool);
        });
    };

    trash.Add(inventoryChanged.Connect(refreshDisplay));

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
            const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
            if (!dragged.slot) return;
            const guiObjects = playerGui.GetGuiObjectsAtPosition(input.Position.X, input.Position.Y);
            const hotbar = pagePaths.Page.FindFirstChild("Hotbar") as Frame | undefined;
            const target = guiObjects.find((v: GuiObject) => v.IsDescendantOf(slotsContainer) && v.IsA("Frame")) as Frame | undefined;
            if (target && target !== dragged.slot) {
                const fromIndex = slotsContainer.GetChildren().findIndex(c => c === dragged.slot);
                const toIndex = target.GetAttribute("Index") as number;
                if (fromIndex >= 0 && toIndex >= 0) swapInventory(fromIndex, toIndex);
            } else if (hotbar) {
                const hotTarget = guiObjects.find((v: GuiObject) => v.IsDescendantOf(hotbar) && v.IsA("TextButton")) as TextButton | undefined;
                if (hotTarget) {
                    const fromIndex = slotsContainer.GetChildren().findIndex(c => c === dragged.slot);
                    const toIndex = hotTarget.GetAttribute("Index") as number;
                    moveInvToHotbar(fromIndex, toIndex ?? hotbarTools.size());
                }
            }
            dragged.slot.Position = slotTemplate.Position;
            dragged.slot.Parent = slotsContainer;
            dragged.slot.ZIndex = slotTemplate.ZIndex;
            dragged.slot = undefined;
            inventoryChanged.Fire();
        };
        trash.Add(UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) endDrag(input);
        }));
    };

    // sort buttons
    function applySort() {
        switch (activeSort) {
            case 0:
                inventoryTools.sort((a, b) => a.Name < b.Name);
                break;
            case 1:
                inventoryTools.sort((a, b) => a.Name > b.Name);
                break;
            case 2:
                inventoryTools.sort((a, b) => a.Name.size() < b.Name.size());
                break;
            case 3:
                inventoryTools.sort((a, b) => a.Name.size() > b.Name.size());
                break;
            case 4:
                for (let i = 0; i < math.floor(inventoryTools.size() / 2); i++) {
                    const j = inventoryTools.size() - 1 - i;
                    const temp = inventoryTools[i];
                    inventoryTools[i] = inventoryTools[j];
                    inventoryTools[j] = temp;
                }
                break;
        }
    }

    sortButtons.forEach((button, index) => {
        trash.Add(UIUtilities.ButtonAction({ Button: button }, () => {
            if (activeSort === index) {
                activeSort = -1;
                reloadItems();
            } else {
                activeSort = index;
                applySort();
            }
            inventoryChanged.Fire();
        }));
    });

    // visibility
    trash.Add(useEffect(() => {
        const open = pageStates.openPage();
        inventoryPage.Visible = open === "Inventory";
        sortButtons.forEach(btn => btn.Visible = inventoryPage.Visible);
        if (open === "Inventory") reloadItems();
    }));

    // initial state
    slotTemplate.Visible = false;
    reloadItems();
    return trash;
};

