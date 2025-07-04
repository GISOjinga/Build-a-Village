import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import routes from "client/routes";

export default () => {
    const trash = new Janitor();
    const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
    const gui = new Instance("ScreenGui");
    gui.IgnoreGuiInset = true;
    gui.ResetOnSpawn = false;
    gui.Name = "DailyQuestGui";
    const labels = new Array<TextLabel>();
    for (let i = 0; i < 3; i++) {
        const l = new Instance("TextLabel");
        l.BackgroundTransparency = 0.5;
        l.BackgroundColor3 = new Color3(0, 0, 0);
        l.TextColor3 = new Color3(1, 1, 1);
        l.Font = Enum.Font.GothamBold;
        l.TextScaled = true;
        l.Size = UDim2.fromOffset(300, 30);
        l.Position = UDim2.fromScale(0.5, i * 0.035);
        l.AnchorPoint = new Vector2(0.5, 0);
        l.Parent = gui;
        labels.push(l);
    }
    gui.Parent = playerGui;

    trash.Add(routes.updateDailyQuest.listen((info) => {
        for (let i = 0; i < labels.size(); i++) {
            const q = info[i];
            labels[i].Text = q ? `${q.description} (${q.progress}/${q.target})` : "";
        }
    }));

    trash.Add(() => gui.Destroy());
    return trash;
};
