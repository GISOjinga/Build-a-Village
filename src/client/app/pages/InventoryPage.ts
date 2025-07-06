import { Janitor } from "@rbxts/janitor";
import { Players, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import pageStates from "shared/utils/Animations/pageStates";
import routes from "client/routes";
import useEffect from "../hooks/useEffect";
import useDrag from "../hooks/useDrag";
import { slotIndexAtPosition } from "../hooks/slotUtils";
import { printTS } from "shared/utils/functions/jecsHelpFunctions";
import { $line } from "rbxts-transformer-inline";

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
        sortFrame.Mutations,
        sortFrame.Produce,
        sortFrame.Villagers,
    ] as typeof sortFrame.ByName[];

    // local state for filtering and sorting
    let searchQuery = "";
    let currentSort: "Name" | "Rarity" | "Mutations" | undefined;
    let filterCategory: "All" | "Produce" | "Villagers" = "All";
    let activeButton: (typeof sortFrame.ByName) | undefined;

    // quick helper to refresh UI when data/state changes
    let slotsJanitor = new Janitor();
    function renderSlots() {
        slotsJanitor.Destroy();
        slotsJanitor = new Janitor();

        let inventoryItems = [...pageStates.inventoryTools()];
        const hotBarTools = pageStates.hotBarTools();

        // apply filter for category
        if (filterCategory === "Produce") {
            inventoryItems = inventoryItems.filter(t => t.GetAttribute("ItemType") === "Commodity");
        } else if (filterCategory === "Villagers") {
            inventoryItems = inventoryItems.filter(t => t.GetAttribute("ItemType") === "Villager");
        }

        // apply sorting
        if (currentSort === "Name") {
            inventoryItems.sort((a, b) => a.Name < b.Name);
        } else if (currentSort === "Rarity") {
            const rarityOrder = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythic"]
            const getRarity = (tool: Tool) => tool.GetAttribute<string>("Rarity") || "Common";
            inventoryItems.sort((a, b) => {
                const rA = getRarity(a);
                const rB = getRarity(b);
                if (rA === rB) return a.Name > b.Name;
                return rarityOrder.findIndex((rarity) => rarity === rA) > rarityOrder.findIndex((rarity) => rarity === rB);
            });
        } else if (currentSort === "Mutations") {
            const mutationOrder = ["Normal", "Gold", "Rainbow"]
            const getMutation = (tool: Tool) => tool.GetAttribute<string>("ItemVariant") || "Normal";
            inventoryItems.sort((a, b) => {
                const rA = getMutation(a);
                const rB = getMutation(b);
                if (rA === rB) return a.Name > b.Name;
                return mutationOrder.findIndex((variant) => variant === rA) > mutationOrder.findIndex((variant) => variant === rB);
            });
        }

        // apply search
        if (searchQuery.size() > 0) {
            const query = searchQuery.lower();
            inventoryItems = inventoryItems.filter(t => t.Name.lower().find(query)[0] !== undefined);
        }

        // clear old slots
        slotsContainer.GetChildren().forEach(child => {
            if (child.IsA("Frame") && child !== slotTemplate) child.Destroy();
        });

        const slotFrames = new Array<typeof slotTemplate>();

        // render each slot
        inventoryItems.forEach((tool, inventoryIndex) => {
            // remove tools already in the hotbar
            for (const [_, tool2] of pairs(hotBarTools)) if (tool2 === tool) return

            const slot = slotsJanitor.Add(slotTemplate.Clone());
            slotFrames.push(slot);

            slot.SetAttribute("SlotIndex", inventoryIndex); // set slot index for later reference
            slot.Visible = true;
            slot.Name = `Slot${inventoryIndex + 1}`;
            slot.LayoutOrder = inventoryIndex;
            slot.Clickable.Text = tool.Name;
            slot.Parent = slotsContainer;

            // equip on click
            slotsJanitor.Add(UIUtilities.ButtonAction({
                Button: slot.Clickable,
                ExpandedSize: UIUtilities.MultiplyUdim2(slot.Clickable.Size, UDim2.fromScale(1.1, 1.1)),
                DeExpandedSize: UIUtilities.DivideUdim2(slot.Clickable.Size, UDim2.fromScale(1.1, 1.1)),
            }, () => {
                if (pageStates.isDragging()) return
                routes.equipTool.send(tool);
            }));

            // drag handling
            slotsJanitor.Add(useDrag(slot.Clickable, slot, ({ position }) => {
                const inventoryTools = [...pageStates.inventoryTools()];
                const currentIndex = inventoryTools.findIndex(t => t === tool);

                const invIndex = slotIndexAtPosition(slotFrames, position);
                const hotbarSlots = pagePaths.InventoryPage.Hotbar.GetChildren().filter((c) => (c.IsA("GuiObject") && c.Visible)) as GuiObject[];
                const hotbarIndex = slotIndexAtPosition(hotbarSlots, position);

                if (hotbarIndex !== undefined) {
                    const hotbar = [...pageStates.hotBarTools()]

                    // if the hotbar index is valid, swap the tool with the one in the hotbar
                    hotbar[hotbarIndex] = tool;
                    pageStates.hotBarTools(hotbar);
                } else if (invIndex !== undefined && invIndex !== currentIndex) {
                    inventoryTools.remove(currentIndex);
                    inventoryTools.insert(invIndex, tool);
                    pageStates.inventoryTools(inventoryTools);
                }
            }));
        });
    }



    // visibility
    trash.Add(useEffect((newTrash) => {
        const open = pageStates.openPage();

        // animate the container to the new position
        newTrash.Add(TweenService.Create(container, new TweenInfo(0.3, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
            Position: open === "Inventory" ? openPosition : closedPosition,
        })).Play();

        // if inventory open attribute is not the same to open then toggle it to open
        Workspace.SetAttribute("BackpackOpen", open === "Inventory");
    }));

    // render slots whenever inventory data changes
    trash.Add(useEffect(() => {
        renderSlots();
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
    trash.Add(Workspace.GetAttributeChangedSignal("BackpackOpen").Connect(() => {
        const currentPage = pageStates.openPage();
        const wantingToOpen = Workspace.GetAttribute("BackpackOpen")

        if (currentPage === "Inventory" !== wantingToOpen) pageStates.openPage(wantingToOpen ? "Inventory" : "None");
    }));

    // set up
    slotTemplate.Visible = false;
    container.Position = closedPosition;
    container.Visible = true;

    // placeholder icons for category buttons
    sortFrame.ByName.TextLabel.Text = "🔤 Name";
    sortFrame.ByRarity.TextLabel.Text = "⭐ Rarity";
    sortFrame.Mutations.TextLabel.Text = "📦 Mutations";
    sortFrame.Produce.TextLabel.Text = "🍎 Produce";
    sortFrame.Villagers.TextLabel.Text = "👥 Villagers";

    // respond to search box input
    trash.Add(searchBox.GetPropertyChangedSignal("Text").Connect(() => {
        searchQuery = searchBox.Text;
        renderSlots();
    }));

    // updates transparency based on which button is active
    function updateButtonTransparency() {
        sortButtons.forEach((btn) => {
            trash.Add(TweenService.Create(btn, new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), { BackgroundTransparency: activeButton && btn !== activeButton ? 0.4 : 0 })).Play();
            trash.Add(TweenService.Create(btn.UICorner, new TweenInfo(0.2, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), { CornerRadius: new UDim(activeButton && btn !== activeButton ? 1 : .25, 0) })).Play();
        });
    }

    // setup sort/filter button actions
    const buttonInfo = [
        {
            button: sortFrame.ByName,
            action: (wasActive: boolean) => {
                currentSort = wasActive ? undefined : "Name";
                filterCategory = "All";
            },
        },
        {
            button: sortFrame.ByRarity,
            action: (wasActive: boolean) => {
                currentSort = wasActive ? undefined : "Rarity";
                filterCategory = "All";
            },
        },
        {
            button: sortFrame.Mutations,
            action: (wasActive: boolean) => {
                currentSort = wasActive ? undefined : "Mutations";
                filterCategory = "All";
            },
        },
        {
            button: sortFrame.Produce,
            action: (wasActive: boolean) => {
                if (wasActive) {
                    filterCategory = "All";
                } else {
                    filterCategory = "Produce";
                    currentSort = undefined;
                }
            },
        },
        {
            button: sortFrame.Villagers,
            action: (wasActive: boolean) => {
                if (wasActive) {
                    filterCategory = "All";
                } else {
                    filterCategory = "Villagers";
                    currentSort = undefined;
                }
            },
        },
    ];

    buttonInfo.forEach(({ button, action }) => {
        trash.Add(
            UIUtilities.ButtonAction(
                {
                    Button: button,
                    ExpandedSize: UIUtilities.MultiplyUdim2(button.Size, UDim2.fromScale(1.05, 1.05)),
                    DeExpandedSize: UIUtilities.DivideUdim2(button.Size, UDim2.fromScale(1.05, 1.05)),
                },
                () => {
                    const wasActive = activeButton === button;
                    activeButton = wasActive ? undefined : button;
                    action(wasActive);
                    updateButtonTransparency();
                    renderSlots();
                },
            ),
        );
    });

    updateButtonTransparency();


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