import { Janitor } from "@rbxts/janitor";
import { Players, UserInputService, StarterGui, Workspace, TweenService } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";
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
        const newInventoryTools = pageStates.inventoryTools()
        const hotBarTools = newInventoryTools.filter((_, i) => i < getSlotCount())
        const slots = new Array<typeof slotTemplate>()

        // render the slots
        hotBarTools.forEach((tool, i) => {
            const slot = newTrash.Add(slotTemplate.Clone());

            // set up the slot
            slots.push(slot);
            slot.Key.Text = tostring(i + 1)
            slot.Visible = true;
            slot.Name = `Slot${i + 1}`;
            slot.Image = tool.TextureId || ""; // Set the tool icon
            slot.ToolName.Text = tool.Name || "Tool"; // Set the tool name
            slot.Parent = hotbar;

            // handle drag and drop
            trash.Add(UIUtilities.ButtonAction({
                Button: slot,
                ExpandedSize: UIUtilities.MultiplyUdim2(slot.Size, UDim2.fromScale(1.1, 1.1)),
                DeExpandedSize: UIUtilities.DivideUdim2(slot.Size, UDim2.fromScale(1.1, 1.1)),
            }, () => {
                routes.equipTool.send(tool);
            }));

            // when ever the tools parent changes to be under a character
            tool.GetPropertyChangedSignal("Parent").Connect(() => {
                const tweenInfo = new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);
                if (tool.Parent && tool.Parent.IsA("Model") && tool.Parent.FindFirstChild("Humanoid")) {
                    // makes all the ui transparent 
                    slots.forEach((s) => trash.Add(TweenService.Create(s, tweenInfo, { BackgroundTransparency: s === slot ? 0 : .5 })).Play())
                } else if (!player.Character?.FindFirstChildOfClass("Tool")) {
                    slots.forEach((s) => trash.Add(TweenService.Create(s, tweenInfo, { BackgroundTransparency: 0 })).Play())
                }
            });
        })

        // saves the hotbar tools
        pageStates.hotBarTools(hotBarTools);

    }));

    // loop updating based on the size of the window if old size is not equal to new size then update the tools
    trash.Add(() => {
        let oldCount = getSlotCount()

        while (true) {
            const newCount = getSlotCount();
            if (newCount !== oldCount) {
                oldCount = newCount;
                pageStates.hotBarTools((oldTools) => {
                    // removes any tools that are beyond the new slot count
                    for (let i = newCount; i < oldTools.size(); i++) {
                        if (i > getSlotCount()) {
                            oldTools[i] = undefined; // remove tool from hotbar
                            return [...oldTools]; // return the updated array
                        }
                    }
                    return oldTools
                })
            }
            task.wait(1); // check every second
        }
    })

    // listens for changes done to inventoryTools and when something is added it inserts it into the hotbar 
    trash.Add(backpack.ChildAdded.Connect((tool) => {
        if (pageStates.inventoryTools().find(t => t === tool) || !tool.IsA("Tool")) return; // if the tool is already in the inventory, return

        // if the tool is not a Tool, return
        pageStates.hotBarTools((oldTools) => {
            // loops through all of old until it hits max slot count or until it finds and empty slot for the item to take
            for (let i = 0; i < getSlotCount(); i++) {
                if (oldTools[i] === undefined) {
                    oldTools[i] = tool;
                    break;
                }
            }

            return [...oldTools];
        });

        // ensure the tool is not destroyed when the player removes it
        tool.Destroying.Connect(() => {
            pageStates.hotBarTools((oldTools) => {
                // finds where the tool is and returns the table without that tool
                for (let i = 0; i < getSlotCount(); i++) {
                    if (oldTools[i] === tool) {
                        oldTools[i] = undefined;
                        return [...oldTools]
                    }
                }

                return oldTools;
            });
        })
    }))



    return trash;
};