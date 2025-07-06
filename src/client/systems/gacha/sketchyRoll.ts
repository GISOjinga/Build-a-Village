import { World } from "@rbxts/jecs";
import { Players, RunService } from "@rbxts/services";
import routes from "client/routes";
import pageStates from "shared/utils/Animations/pageStates";
import gachaItems from "shared/data/gachaItems";

export default (world: World) => {
    const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
    const gui = new Instance("ScreenGui");
    gui.IgnoreGuiInset = true;
    gui.ResetOnSpawn = false;
    gui.Enabled = false;
    const label = new Instance("TextLabel");
    label.Size = UDim2.fromScale(0.3, 0.1);
    label.Position = UDim2.fromScale(0.35, 0.45);
    label.BackgroundColor3 = Color3.fromRGB(0, 0, 0);
    label.TextColor3 = Color3.fromRGB(255, 255, 255);
    label.TextScaled = true;
    label.Parent = gui;
    const autoButton = new Instance("TextButton");
    autoButton.Size = UDim2.fromScale(0.1, 0.05);
    autoButton.Position = UDim2.fromScale(0.65, 0.45);
    autoButton.Text = "Auto Roll";
    autoButton.Parent = gui;
    autoButton.MouseButton1Click.Connect(() => {
        if (!pageStates.autoSkipRoll()) routes.buyAutoSkipRoll.send();
    });
    gui.Parent = playerGui;

    routes.startSketchyRoll.listen(({ item }) => {
        gui.Enabled = true;
        label.Text = "";
        if (pageStates.autoSkipRoll()) {
            label.Text = item;
            task.delay(2, () => gui.Enabled = false);
            return;
        }
        let index = 0;
        const start = tick();
        const conn = RunService.Heartbeat.Connect(() => {
            const elapsed = tick() - start;
            if (elapsed >= 5) {
                label.Text = item;
                conn.Disconnect();
                task.delay(2, () => {
                    gui.Enabled = false;
                });
            } else {
                const t = math.floor(elapsed / 5 * 100);
                if (t !== index) {
                    index = t;
                    label.Text = gachaItems[math.floor(math.random() * gachaItems.size())].Name;
                }
            }
        });
    });
};
