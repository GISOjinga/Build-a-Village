import { Janitor } from "@rbxts/janitor";
import { Players, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import routes from "client/routes";
import useEffect from "../hooks/useEffect";

// simple inventory page with drag and drop and sorting buttons
export default (pagePaths: PagePaths) => {
    // container setup and shared references
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

    /** Swap two tools inside the inventory list */
    function swapInventory(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return;
        pageStates.inventoryTools(old => {
            const arr = [...old];
            const [item] = arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, item);
            return arr;
        });
    }

    /** Move a tool from the inventory list to the hotbar */
    function moveInvToHotbar(invIndex: number, hotIndex: number) {
        const inv = [...pageStates.inventoryTools()];
        const [item] = inv.splice(invIndex, 1);
        pageStates.inventoryTools(inv);
        pageStates.hotBarTools(old => {
            const arr = [...old];
            arr.splice(hotIndex, 0, item);
            return arr;
        });
    }
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

    // refreshes the arrays stored in page state from the player's backpack
    const reloadItems = () => {
        if (!backpack) return;
        const tools = backpack.GetChildren().filter((child) => child.IsA("Tool")) as Tool[];
        pageStates.inventoryTools(tools);
        applySort();
    };


    // display items
    const refreshDisplay = () => {
        slotsContainer.GetChildren().forEach((c) => { if (c !== slotTemplate && c.IsA("Frame")) c.Destroy(); });
        applySort();
        let tools = [...pageStates.inventoryTools()];
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


    // refresh whenever the inventory list updates
    trash.Add(useEffect(() => {
        pageStates.inventoryTools();
        refreshDisplay();
    }));

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
                    moveInvToHotbar(fromIndex, toIndex ?? pageStates.hotBarTools().size());
                }
            }
            dragged.slot.Position = slotTemplate.Position;
            dragged.slot.Parent = slotsContainer;
            dragged.slot.ZIndex = slotTemplate.ZIndex;
            dragged.slot = undefined;
        };
        trash.Add(UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) endDrag(input);
        }));
    };

    // sort buttons
    // sorts the inventory array in page state based on the active sort index
    function applySort() {
        pageStates.inventoryTools((old) => {
            const arr = [...old];
            switch (activeSort) {
                case 0:
                    arr.sort((a: Tool, b: Tool) => (a.Name < b.Name ? -1 : 1));
                    break;
                case 1:
                    arr.sort((a: Tool, b: Tool) => (a.Name > b.Name ? -1 : 1));
                    break;
                case 2:
                    arr.sort((a: Tool, b: Tool) => a.Name.size() - b.Name.size());
                    break;
                case 3:
                    arr.sort((a: Tool, b: Tool) => b.Name.size() - a.Name.size());
                    break;
                case 4:
                    for (let i = 0; i < math.floor(arr.size() / 2); i++) {
                        const j = arr.size() - 1 - i;
                        const temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                    }
                    break;
            }
            return arr;
        });
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

