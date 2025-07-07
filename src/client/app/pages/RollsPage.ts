import { Janitor } from "@rbxts/janitor";
import { Players, RunService, MarketplaceService } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";
import gachaItems from "shared/data/gachaItems";
import paths from "shared/utils/paths";

const GAMEPASS_ID = 1285438020; // Skip roll gamepass

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    
    // Create the roll UI elements dynamically since no dedicated UI exists
    const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");
    const gui = new Instance("ScreenGui");
    gui.IgnoreGuiInset = true;
    gui.ResetOnSpawn = false;
    gui.Enabled = false;
    gui.Name = "RollsPage";
    
    // Main roll display label
    const label = new Instance("TextLabel");
    label.Size = UDim2.fromScale(0.3, 0.1);
    label.Position = UDim2.fromScale(0.35, 0.45);
    label.BackgroundColor3 = Color3.fromRGB(0, 0, 0);
    label.TextColor3 = Color3.fromRGB(255, 255, 255);
    label.TextScaled = true;
    label.BorderSizePixel = 0;
    label.Parent = gui;
    
    // Auto skip button for players without gamepass
    const skipButton = new Instance("TextButton");
    skipButton.Size = UDim2.fromScale(0.15, 0.08);
    skipButton.Position = UDim2.fromScale(0.425, 0.55);
    skipButton.Text = "Buy Auto Skip";
    skipButton.BackgroundColor3 = Color3.fromRGB(50, 50, 50);
    skipButton.TextColor3 = Color3.fromRGB(255, 255, 255);
    skipButton.TextScaled = true;
    skipButton.BorderSizePixel = 0;
    skipButton.Visible = false;
    skipButton.Parent = gui;
    
    // Close button
    const closeButton = new Instance("TextButton");
    closeButton.Size = UDim2.fromScale(0.05, 0.05);
    closeButton.Position = UDim2.fromScale(0.62, 0.35);
    closeButton.Text = "×";
    closeButton.BackgroundColor3 = Color3.fromRGB(200, 50, 50);
    closeButton.TextColor3 = Color3.fromRGB(255, 255, 255);
    closeButton.TextScaled = true;
    closeButton.BorderSizePixel = 0;
    closeButton.Parent = gui;
    
    gui.Parent = playerGui;
    
    // Close button functionality
    trash.Add(closeButton.MouseButton1Click.Connect(() => {
        gui.Enabled = false;
        pageStates.openPage("None");
    }));
    
    // Skip button functionality
    trash.Add(skipButton.MouseButton1Click.Connect(() => {
        MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, GAMEPASS_ID);
    }));
    
    // Handle page visibility
    trash.Add(useEffect(() => {
        gui.Enabled = pageStates.openPage() === "Rolls";
    }));
    
    // Handle roll start
    trash.Add(routes.startSketchyRoll.listen(({ item, type: itemType }) => {
        gui.Enabled = true;
        label.Text = "";
        let index = 0;
        
        // Check if player owns skip gamepass
        const owns = MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, GAMEPASS_ID);
        skipButton.Visible = !owns;
            
        const finish = () => {
            label.Text = `You got: ${item}!`;
            routes.finishSketchyRoll.send(undefined);
            skipButton.Visible = false;
            
            // Show notification
            routes.notify.send({ text: `You received ${item}!`, duration: 5 });
            
            // Close after 3 seconds
            task.delay(3, () => {
                gui.Enabled = false;
                pageStates.openPage("None");
            });
        };
        
        if (owns) {
            // Auto skip for gamepass owners
            finish();
            return;
        }
        
        // Animate the roll for 5 seconds
        const start = tick();
        const conn = RunService.Heartbeat.Connect(() => {
            const elapsed = tick() - start;
            if (elapsed >= 5) {
                conn.Disconnect();
                finish();
            } else {
                const t = math.floor(elapsed / 5 * 100);
                if (t !== index) {
                    index = t;
                    // Show random items during roll
                    const randomItem = gachaItems[math.floor(math.random() * gachaItems.size())];
                    label.Text = randomItem.Name;
                }
            }
        });
    }));
    
    // Clean up GUI when page is destroyed
    trash.Add(() => {
        gui.Destroy();
    });
    
    return trash;
};
