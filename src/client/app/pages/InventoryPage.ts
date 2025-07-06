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
    const backpack = Players.LocalPlayer.WaitForChild("FakePack") as Backpack;
    const container = pagePaths.InventoryPage.Container;
    const slotsContainer = container.Grid.ContainerFrame
    const slotTemplate = container.Grid.ContainerFrame.ContainerExample
    const searchBox = container.TopBar.SearchBox;
    const closeButton = container.TopBar.Close;
    const sortFrame = container.SortCategory;
    const openPosition = container.Position;
    const closedPosition = UDim2.fromScale(openPosition.X.Scale, 3.5);
    const sortButtons = [
        sortFrame.ByName,
        sortFrame.ByRarity,
        sortFrame.Amount,
        sortFrame.Produce,
        sortFrame.Villagers,
    ] as typeof sortFrame.ByName[];



    // visibility
    trash.Add(useEffect((newTrash) => {
        const open = pageStates.openPage();

        // animate the container to the new position
        newTrash.Add(TweenService.Create(container, new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
            Position: open === "Inventory" ? openPosition : closedPosition,
        })).Play();
    }));

    // loads in the slots
    trash.Add(useEffect((newTrash) => {
        const realInventoryItems = [...pageStates.inventoryTools()];
        const hotBarTools = pageStates.hotBarTools();

        // loops through hotBarTools tools and removes it from realInventoryItems
        for (const [_, tool] of pairs(hotBarTools)) {
            const index = realInventoryItems.findIndex(t => t === tool);
            if (index !== -1) realInventoryItems.remove(index);
        }

        // for all the real inventory items it adds a slot template and sets the name
        realInventoryItems.forEach((tool, i) => {
            const slot = newTrash.Add(slotTemplate.Clone());

            // set up the slot
            slot.Visible = true;
            slot.Name = `Slot${i + 1}`;
            slot.Clickable.Text = tool.Name
            slot.Parent = slotsContainer;

            // binds the action to equip the tool
            trash.Add(UIUtilities.ButtonAction({
                Button: slot.Clickable,
                ExpandedSize: UIUtilities.MultiplyUdim2(slot.Clickable.Size, UDim2.fromScale(1.1, 1.1)),
                DeExpandedSize: UIUtilities.DivideUdim2(slot.Clickable.Size, UDim2.fromScale(1.1, 1.1)),
            }, () => {

            }));
        })
    }));

    // close button hides the page
    trash.Add(UIUtilities.ButtonAction({
        Button: closeButton,
        ExpandedSize: UIUtilities.MultiplyUdim2(closeButton.Size, UDim2.fromScale(1.1, 1.1)),
        DeExpandedSize: UIUtilities.DivideUdim2(closeButton.Size, UDim2.fromScale(1.1, 1.1)),
    }, () => {
        pageStates.openPage("None");
    }));

    // toggles backback because of the workspace attrivute backpackopen
    Workspace.SetAttribute("BackpackOpen", false);
    trash.Add(Workspace.GetAttributeChangedSignal("BackpackOpen").Connect(() => pageStates.openPage(Workspace.GetAttribute("BackpackOpen") ? "Inventory" : "None")));

    // set up
    slotTemplate.Visible = false;
    container.Position = closedPosition;
    container.Visible = true;


    // when a tool is added, update the inventory tools
    trash.Add(backpack.ChildAdded.Connect((tool) => {
        if (pageStates.inventoryTools().find(t => t === tool) || !tool.IsA("Tool")) return; // if the tool is already in the inventory, return

        // if the tool is not a Tool, return
        pageStates.inventoryTools((oldTools) => {
            oldTools.push(tool as Tool);
            return [...oldTools];
        });

        // ensure the tool is not destroyed when the player removes it
        tool.Destroying.Connect(() => {
            pageStates.inventoryTools((oldTools) => {
                const indexOfTool = oldTools.findIndex(t => t === tool);
                oldTools.remove(indexOfTool);
                return [...oldTools];
            });
        })
    }))
    return trash;
};