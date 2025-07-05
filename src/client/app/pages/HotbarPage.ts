import { Janitor } from "@rbxts/janitor";
import { Players, UserInputService, RunService, StarterGui } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import UIUtilities from "shared/utils/Animations/uiUtilities";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const gameUI = pagePaths.Page;
    const player = Players.LocalPlayer;
    const backpack = player.WaitForChild("Backpack") as Backpack;

    const hotbar = new Instance("Frame");
    hotbar.Name = "Hotbar";
    hotbar.AnchorPoint = new Vector2(0.5, 1);
    hotbar.Position = UDim2.fromScale(0.5, 1);
    hotbar.Size = UDim2.fromScale(0.5, 0.08);
    hotbar.BackgroundTransparency = 1;
    hotbar.Parent = gameUI;

    const slotTemplate = new Instance("TextButton");
    slotTemplate.BackgroundTransparency = 0.3;
    slotTemplate.TextScaled = true;
    slotTemplate.Size = UDim2.fromScale(0.2, 1);

    function getSlotCount() {
        const width = workspace.CurrentCamera?.ViewportSize.X ?? 0;
        return width < 700 ? 3 : 5;
    }

    function updateSlots() {
        hotbar.ClearAllChildren();
        const slotCount = getSlotCount();
        const tools = backpack.GetChildren().filter((c) => c.IsA("Tool")) as Tool[];
        for (let i = 0; i < slotCount; i++) {
            const slot = slotTemplate.Clone();
            slot.Position = UDim2.fromScale(i / slotCount, 0);
            slot.Size = UDim2.fromScale(1 / slotCount, 1);
            const tool = tools[i];
            slot.Text = tool ? tool.Name : "";
            slot.Parent = hotbar;
            trash.Add(UIUtilities.ButtonAction({ Button: slot }, () => {
                if (tool) routes.equipTool.send({ toolName: tool.Name });
            }));
        }
    }

    trash.Add(backpack.ChildAdded.Connect(updateSlots));
    trash.Add(backpack.ChildRemoved.Connect(updateSlots));
    trash.Add(RunService.Heartbeat.Connect(updateSlots));

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

    updateSlots();

    StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

    return trash;
};
