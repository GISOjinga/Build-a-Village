import { InventoryUI } from "shared/utils/Animations/pagePaths";


export default function createInventoryPage(parent: ScreenGui): InventoryUI {
    const page = new Instance("Frame");
    page.Name = "Inventory";
    page.AnchorPoint = new Vector2(0.5, 0.5);
    page.Position = UDim2.fromScale(0.5, 0.5);
    page.Size = UDim2.fromScale(0.6, 0.6);
    page.BackgroundTransparency = 0.3;
    page.Visible = false;
    page.Parent = parent;

    const sortButtons = new Instance("Frame");
    sortButtons.Name = "SortButtons";
    sortButtons.BackgroundTransparency = 1;
    sortButtons.Size = UDim2.fromScale(0.2, 1);
    sortButtons.Parent = page;

    for (let i = 0; i < 5; i++) {
        const btn = new Instance("TextButton");
        btn.Name = `Sort${i + 1}`;
        btn.Text = `Sort ${i + 1}`;
        btn.Size = UDim2.fromScale(1, 0.18);
        btn.Position = UDim2.fromScale(0, i * 0.2);
        btn.BackgroundTransparency = 0.3;
        btn.TextScaled = true;
        btn.Parent = sortButtons;
    }

    const slotsContainer = new Instance("Frame");
    slotsContainer.Name = "SlotsContainer";
    slotsContainer.BackgroundTransparency = 1;
    slotsContainer.Position = UDim2.fromScale(0.2, 0);
    slotsContainer.Size = UDim2.fromScale(0.8, 1);
    slotsContainer.Parent = page;

    const sample = new Instance("Frame");
    sample.Name = "Sample";
    sample.BackgroundTransparency = 0.3;
    sample.Size = UDim2.fromScale(0.2, 0.2);
    sample.Visible = false;
    sample.Parent = slotsContainer;

    const label = new Instance("TextLabel");
    label.Name = "ToolName";
    label.Size = UDim2.fromScale(1, 1);
    label.BackgroundTransparency = 1;
    label.TextScaled = true;
    label.Parent = sample;

    return page as InventoryUI;
}
