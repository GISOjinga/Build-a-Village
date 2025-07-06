import { Janitor } from "@rbxts/janitor";
import { Players, UserInputService, StarterGui, Workspace } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";

export default (pagePaths: PagePaths) => {
    // hotbar UI references and drag state
    const trash = new Janitor();
    const gameUI = pagePaths.Page;
    const player = Players.LocalPlayer;
    const backpack = player.WaitForChild("Backpack") as Backpack;
    const hotbar = pagePaths.InventoryPage.Hotbar;
    const slotTemplate = hotbar.SlotExample;
    slotTemplate.Visible = false;
    hotbar.Visible = true;

    const dragged = { slot: undefined as ImageButton | undefined, offset: new Vector2() };
    let renderQueued = false;

    /** Size of hotbar based on current viewport */
    function setHotbarSize(size: number) {
        pageStates.hotBarTools(old => old.slice(0, size));
    }

    /** Swap two tools inside the hotbar */
    function swapHotbar(fromIndex: number, toIndex: number) {
        if (fromIndex === toIndex) return;
        pageStates.hotBarTools(old => {
            const arr = [...old];
            const [item] = arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, item);
            return arr;
        });
    }

    /** Move a tool from the hotbar to the inventory */
    function moveHotbarToInv(hotIndex: number, invIndex: number) {
        const hot = [...pageStates.hotBarTools()];
        const [item] = hot.splice(hotIndex, 1);
        pageStates.hotBarTools(hot);
        pageStates.inventoryTools(old => {
            const arr = [...old];
            arr.splice(invIndex, 0, item);
            return arr;
        });
    }

    function getSlotCount() {
        const width = Workspace.CurrentCamera?.ViewportSize.X ?? 0;
        return width < 700 ? 3 : 5;
    }

    function queueRenderSlots() {
        if (renderQueued) return;
        renderQueued = true;
        task.defer(() => {
            renderQueued = false;
            renderSlots();
        });
    }

    function renderSlots() {
        const hotBarTools = pageStates.hotBarTools()
        const slotCount = getSlotCount();
        // ONLY read hotbarTools, never modify them here
        hotbar.GetChildren().forEach(c => {
            if (c !== slotTemplate && !c.IsA("UIListLayout")) c.Destroy();
        });

        for (let i = 0; i < hotBarTools.size(); i++) {
            const slot = slotTemplate.Clone();
            slot.Visible = true;
            slot.Position = UDim2.fromScale(i / slotCount, 0);
            slot.Size = UDim2.fromScale(1 / slotCount, 1);
            const tool = hotBarTools[i];
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
            const invFrame = inventoryContainer.Container;
            const invTarget = guiObjects.find((v: GuiObject) => invFrame && v.IsDescendantOf(invFrame) && v.IsA("Frame")) as Frame | undefined;
            if (invTarget && invFrame) {
                const toIndex = invTarget.GetAttribute("Index") as number;
                moveHotbarToInv(index, toIndex ?? pageStates.inventoryTools().size());
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
            dragged.slot.Position = UDim2.fromOffset(input.Position.X + dragged.offset.X, input.Position.Y + dragged.offset.Y);
        }));

        trash.Add(UserInputService.InputEnded.Connect((input) => {
            if (input.UserInputType === Enum.UserInputType.MouseButton1 || input.UserInputType === Enum.UserInputType.Touch) finishDrag(input);
        }));
    }

    trash.Add(backpack.ChildAdded.Connect(queueRenderSlots));
    trash.Add(backpack.ChildRemoved.Connect(queueRenderSlots));

    // re-render when tool arrays change
    trash.Add(useEffect(() => {
        pageStates.hotBarTools();
        pageStates.inventoryTools();
        queueRenderSlots();
    }));

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


    StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

    // initialize inventory tools from backpack and keep them in sync
    pageStates.inventoryTools(
        [...backpack.GetChildren(), ...(player.Character?.GetChildren() || [])]
            .filter((v) => v.IsA("Tool"))
            .filterUndefined(),
    );
    backpack.ChildAdded.Connect(() =>
        pageStates.inventoryTools(
            [...backpack.GetChildren(), ...(player.Character?.GetChildren() || [])]
                .filter((v) => v.IsA("Tool"))
                .filterUndefined(),
        ),
    );
    setHotbarSize(getSlotCount());
    renderSlots();
    queueRenderSlots();
    return trash;
};