import { World } from "@rbxts/jecs";
import { Players, RunService, MarketplaceService } from "@rbxts/services";
import routes from "client/routes";
import gachaItems from "shared/data/gachaItems";

export default (world: World) => {
    // const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
    // const gui = new Instance("ScreenGui");
    // gui.IgnoreGuiInset = true;
    // gui.ResetOnSpawn = false;
    // gui.Enabled = false;
    // const label = new Instance("TextLabel");
    // label.Size = UDim2.fromScale(0.3, 0.1);
    // label.Position = UDim2.fromScale(0.35, 0.45);
    // label.BackgroundColor3 = Color3.fromRGB(0, 0, 0);
    // label.TextColor3 = Color3.fromRGB(255, 255, 255);
    // label.TextScaled = true;
    // label.Parent = gui;
    // gui.Parent = playerGui;
    // const skipButton = new Instance("TextButton");
    // skipButton.Size = UDim2.fromScale(0.1, 0.05);
    // skipButton.Position = UDim2.fromScale(0.45, 0.55);
    // skipButton.Text = "Auto Skip";
    // skipButton.BackgroundColor3 = Color3.fromRGB(50, 50, 50);
    // skipButton.TextColor3 = Color3.fromRGB(255, 255, 255);
    // skipButton.Visible = false;
    // skipButton.Parent = gui;
    // const GAMEPASS_ID = 1285438020;
    // skipButton.MouseButton1Click.Connect(() => {
    //     MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, GAMEPASS_ID);
    // });

    // routes.startSketchyRoll.listen(({ item }) => {
    //     // gui.Enabled = true;
    //     // label.Text = "";
    //     // let index = 0;
    //     // const owns = MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, GAMEPASS_ID);
    //     // skipButton.Visible = !owns;
    //     // const finish = () => {
    //     //     label.Text = item;
    //     //     routes.finishSketchyRoll.send(undefined);
    //     //     skipButton.Visible = false;
    //     //     task.delay(2, () => gui.Enabled = false);
    //     // };

    //     // if (owns) {
    //     //     finish();
    //     //     return;
    //     // }

    //     // const start = tick();
    //     // const conn = RunService.Heartbeat.Connect(() => {
    //     //     const elapsed = tick() - start;
    //     //     if (elapsed >= 5) {
    //     //         conn.Disconnect();
    //     //         finish();
    //     //     } else {
    //     //         const t = math.floor(elapsed / 5 * 100);
    //     //         if (t !== index) {
    //     //             index = t;
    //     //             label.Text = gachaItems[math.floor(math.random() * gachaItems.size())].Name;
    //     //         }
    //     //     }
    //     // });
    // });
};
