import { Janitor } from "@rbxts/janitor";
import { Players, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import routes from "client/routes";
import useEffect from "../hooks/useEffect";

// simple inventory page with drag and drop and sorting buttons
export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const container = pagePaths.InventoryPage.Container;
    const slotsContainer = container.Grid.ContainerFrame as Frame;
    const slotTemplate = container.Grid.ContainerFrame.ContainerExample as Frame;
    const searchBox = container.TopBar.SearchBox;
    const closeButton = container.TopBar.Close;
    const sortFrame = container.SortCategory;
    const sortButtons = [
        sortFrame.ByName,
        sortFrame.ByRarity,
        sortFrame.Amount,
        sortFrame.Produce,
        sortFrame.Villagers,
    ] as typeof sortFrame.ByName[];

    const openPosition = container.Position;
    const closedPosition = UDim2.fromScale(openPosition.X.Scale, 3.5);
    container.Position = closedPosition;
    container.Visible = true;

    const backpack = Players.LocalPlayer.FindFirstChild("Backpack") as Backpack | undefined;
    const dragged = { slot: undefined as Frame | undefined, offset: new Vector2() };
    let activeSort = -1;
    let searchTerm = "";
    trash.Add(searchBox.GetPropertyChangedSignal("Text").Connect(() => {
        searchTerm = searchBox.Text;
        refreshDisplay();
    }));

    // close button hides the page
    trash.Add(UIUtilities.ButtonAction({ Button: closeButton }, () => {
        pageStates.openPage("None");
    }));

    // toggle inventory with backquote key
    trash.Add(UserInputService.InputBegan.Connect((input, gp) => {
        if (gp) return;
        if (input.KeyCode === Enum.KeyCode.Backquote) {
            const open = pageStates.openPage();
            pageStates.openPage(open === "Inventory" ? "None" : "Inventory");
        }
    }));

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
        applySort();
        let tools = [...inventoryTools];
        if (searchTerm.size() > 0) {
            const lower = searchTerm.lower();
            tools = tools.filter(t => t.Name.lower().find(lower) !== undefined);
        }
        tools.forEach((tool, index) => {
            const slot = slotTemplate.Clone();
            slot.Visible = true;
            slot.Name = `Slot${index}`;
            slot.SetAttribute("Index", index);
            const button = slot.FindFirstChild("Clickable") as TextButton | undefined;
            if (button) {
                button.Text = tool.Name;
                trash.Add(UIUtilities.ButtonAction({ Button: button }, () => {
                    routes.equipTool.send({ toolName: tool.Name });
                }));
            }
            slot.Parent = slotsContainer;
            setupDrag(slot, tool);
        });
    };

    trash.Add(inventoryChanged.Connect(refreshDisplay));

    // drag setup
    const setupDrag = (slot: Frame, tool: Tool) => {
        const button = slot.FindFirstChild("Clickable") as GuiButton | undefined || slot;
        trash.Add(button.InputBegan.Connect((input) => {
            if (input.UserInputType !== Enum.UserInputType.MouseButton1 && input.UserInputType !== Enum.UserInputType.Touch) return;
            dragged.slot = slot;
            const absPos = input.Position;
            dragged.offset = new Vector2(slot.AbsolutePosition.X - absPos.X, slot.AbsolutePosition.Y - absPos.Y);
            slot.Parent = container;
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

            sortButtons.forEach((b, i) => {
                trash.Add(TweenService.Create(b, new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out), {
                    BackgroundTransparency: (activeSort === i || activeSort === -1) ? 0 : 0.2
                })).Play();
                trash.Add(TweenService.Create(b.UICorner, new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
                    CornerRadius: new UDim((activeSort === i || activeSort === -1) ? .2 : 1, 0)
                })).Play();
            });
            inventoryChanged.Fire();
        }));
    });

    // visibility
    trash.Add(useEffect((newTrash) => {
        const open = pageStates.openPage();
        const goal = open === "Inventory" ? openPosition : closedPosition;
        newTrash.Add(TweenService.Create(container, new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
            Position: goal,
        })).Play();
        sortFrame.Visible = open === "Inventory";
        if (open === "Inventory") reloadItems();
    }));

    // toggles backback because of the workspace attrivute backpackopen
    Workspace.SetAttribute("BackpackOpen", false);
    trash.Add(Workspace.GetAttributeChangedSignal("BackpackOpen").Connect(() => pageStates.openPage(Workspace.GetAttribute("BackpackOpen") ? "Inventory" : "None")));

    // initial state
    slotTemplate.Visible = false;
    reloadItems();
    return trash;
};

