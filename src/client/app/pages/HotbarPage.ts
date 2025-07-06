import { Janitor } from "@rbxts/janitor";
import { Players, UserInputService, StarterGui, Workspace, TweenService } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";
import useDrag from "../hooks/useDrag";
import { slotIndexAtPosition } from "../hooks/slotUtils";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import { $line } from "rbxts-transformer-inline";

export default (pagePaths: PagePaths) => {
    // hotbar UI references and drag state
    const trash = new Janitor();
    const player = Players.LocalPlayer;
    const backpack = player.WaitForChild("FakePack") as Backpack;
    const hotbar = pagePaths.InventoryPage.Hotbar;
    const slotTemplate = hotbar.SlotExample;

    // set up the hotbar
    StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
    slotTemplate.Visible = false;
    hotbar.Visible = true;

    function getSlotCount() {
        const width = Workspace.CurrentCamera?.ViewportSize.X ?? 0;
        return width < 700 ? 3 : 5;
    }

    // re-render when tool arrays change
    trash.Add(useEffect((newTrash) => {
        const hotBarTools = pageStates.hotBarTools();
        const maxSlots = getSlotCount();

        // ensure array length matches slot count
        for (const [index] of pairs(hotBarTools)) if (index >= maxSlots) hotBarTools[index] = undefined; // remove tools beyond max slots

        // clear old slots
        hotbar.GetChildren<typeof slotTemplate>().forEach((c) => {
            if (c.IsA("Frame") && c !== slotTemplate) c.Destroy();
        });

        const slots = new Array<typeof slotTemplate>();
        for (let i = 0; i < maxSlots; i++) {
            const tool = hotBarTools[i];
            const slot = newTrash.Add(slotTemplate.Clone());

            slots.push(slot);
            slot.SetAttribute("SlotIndex", i); // set slot index for later reference
            slot.Key.Text = tostring(i + 1);
            slot.LayoutOrder = i;
            slot.Visible = true;
            slot.Name = `Slot${i + 1}`;
            slot.Image = tool ? tool.TextureId || "" : "";
            slot.ToolName.Text = tool ? tool.Name : "";
            if (tool) trash.Add(tool.GetPropertyChangedSignal("Name").Connect(() => slot.ToolName.Text = tool.Name));
            slot.Parent = hotbar;

            // handle drag and drop
            if (tool) {
                trash.Add(
                    UIUtilities.ButtonAction({
                        Button: slot,
                        ExpandedSize: UIUtilities.MultiplyUdim2(slot.Size, UDim2.fromScale(1.1, 1.1)),
                        DeExpandedSize: UIUtilities.DivideUdim2(slot.Size, UDim2.fromScale(1.1, 1.1)),
                    }, () => {
                        if (pageStates.isDragging() || pageStates.openPage() === "Inventory") return
                        routes.equipTool.send(tool);
                    }),
                );

                // function to tell you if a position is within the absolute bounds of a GuiObject
                const isWithinBounds = (guiObject: GuiObject, position: Vector2) => {
                    const absolutePosition = guiObject.AbsolutePosition;
                    const absoluteSize = guiObject.AbsoluteSize; // half size for center point
                    return position.X >= absolutePosition.X && position.X <= absolutePosition.X + absoluteSize.X &&
                        position.Y >= absolutePosition.Y && position.Y <= absolutePosition.Y + absoluteSize.Y;
                };

                // drag event
                newTrash.Add(useDrag(slot, slot, ({ position }) => {
                    const hotbar = { ...pageStates.hotBarTools() };
                    const currentIndex = i;

                    const hotbarSlots = slots as GuiObject[];
                    const hotbarIndex = slotIndexAtPosition(hotbarSlots, position);
                    const withinInventoryGrid = pagePaths.InventoryPage.Container.Grid.Visible && isWithinBounds(pagePaths.InventoryPage.Container, position);
                    const inventorySlots = pagePaths.InventoryPage.Container.Grid.ContainerFrame.GetChildren().filter((c) => (c.IsA("GuiObject") && c.Visible)) as GuiObject[];
                    const inventoryIndex = slotIndexAtPosition(inventorySlots, position);

                    if (inventoryIndex !== undefined) {
                        const inventory = pageStates.inventoryTools()
                        const indexInInventory = inventory.findIndex((t) => t === tool);
                        const targetTool = inventory[inventoryIndex];
                        hotbar[currentIndex] = targetTool;
                        inventory[inventoryIndex] = tool;
                        inventory[indexInInventory] = targetTool; // swap tools in inventory
                        pageStates.inventoryTools(inventory);
                        pageStates.hotBarTools(hotbar);
                        return;
                    } else if (hotbarIndex !== undefined && hotbarIndex !== currentIndex) {
                        const temp = hotbar[hotbarIndex];
                        hotbar[hotbarIndex] = tool;
                        hotbar[currentIndex] = temp;
                        pageStates.hotBarTools(hotbar);
                    } else if (withinInventoryGrid) { // removes it from hot bar
                        hotbar[currentIndex] = undefined; // remove tool from hotbar
                        pageStates.hotBarTools(hotbar);
                        return;
                    }
                }));

                tool.GetPropertyChangedSignal("Parent").Connect(() => {
                    const tweenInfo = new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);
                    if (tool.Parent && tool.Parent.IsA("Model") && tool.Parent.FindFirstChild("Humanoid")) {
                        slots.forEach((s) => trash.Add(TweenService.Create(s, tweenInfo, { BackgroundTransparency: s === slot ? 0 : 0.5 })).Play());
                    } else if (!player.Character?.FindFirstChildOfClass("Tool")) {
                        slots.forEach((s) => trash.Add(TweenService.Create(s, tweenInfo, { BackgroundTransparency: 0 })).Play());
                    }
                });
            }
        }
    }));

    // loop updating based on the size of the window if old size is not equal to new size then update the tools
    trash.Add(() => {
        let oldCount = getSlotCount()

        // while (true) {
        //     const newCount = getSlotCount();
        //     if (newCount !== oldCount) {
        //         oldCount = newCount;
        //         pageStates.hotBarTools((oldTools) => {
        //             // removes any tools that are beyond the new slot count
        //             for (let i = newCount; i < oldTools.size(); i++) {
        //                 if (i > getSlotCount()) {
        //                     oldTools[i] = undefined; // remove tool from hotbar
        //                     return [...oldTools]; // return the updated array
        //                 }
        //             }
        //             return oldTools
        //         })
        //     }
        //     task.wait(1); // check every second
        // }
    })

    // listens for changes done to inventoryTools and when something is added it inserts it into the hotbar 
    trash.Add(backpack.ChildAdded.Connect((tool) => {
        if (!tool.IsA("Tool")) return; // if the tool is already in the inventory, return
        for (const [_, child] of pairs(pageStates.hotBarTools())) if (child.IsA("Tool") && child === tool) return

        // if the tool is not a Tool, return
        pageStates.hotBarTools((oldTools) => {
            // loops through all of old until it hits max slot count or until it finds and empty slot for the item to take
            for (let i = 0; i < getSlotCount(); i++) {
                if (oldTools[i] === undefined) {
                    oldTools[i] = tool;
                    break;
                }
            }

            return { ...oldTools };
        });

        // ensure the tool is not destroyed when the player removes it
        tool.Destroying.Connect(() => {
            pageStates.hotBarTools((oldTools) => {
                // finds where the tool is and returns the table without that tool
                for (let i = 0; i < getSlotCount(); i++) {
                    if (oldTools[i] === tool) {
                        oldTools[i] = undefined;
                        return { ...oldTools }
                    }
                }

                return oldTools;
            });
        })
    }))

    // handle pressing number keys to equip corresponding hotbar slot
    const keyCodes = [Enum.KeyCode.One, Enum.KeyCode.Two, Enum.KeyCode.Three, Enum.KeyCode.Four, Enum.KeyCode.Five];
    trash.Add(UserInputService.InputBegan.Connect((input, gameProcessed) => {
        if (gameProcessed || !input.KeyCode || pageStates.openPage() === "Inventory") return; // ignore if game already processed or key is not in hotbar keys
        const index = keyCodes.findIndex(k => k === input.KeyCode);
        if (index !== -1) {
            const tool = pageStates.hotBarTools()[index];
            if (tool) routes.equipTool.send(tool);
        }
    }));



    return trash;
};