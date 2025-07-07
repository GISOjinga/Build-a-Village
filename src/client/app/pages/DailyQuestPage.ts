import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";
import paths from "shared/utils/paths";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const questPage = pagePaths.DailyQuestsPage;
    const dailyQuestsTab = pagePaths.DailyQuestsTabsPage;

    // Close button functionality
    trash.Add(questPage.Close.MouseButton1Click.Connect(() => {
        pageStates.openPage("None");
    }));

    trash.Add(routes.updateDailyQuest.listen((info) => {
        for (let i = 0; i < 3; i++) {
            const questInfo = info[i];
            const questFrame = questPage["Quest" + (i + 1) as "Quest1"];
            const questFrameTab = dailyQuestsTab["Quest" + (i + 1) as "Quest1"].text

            if (questInfo) {
                questInfo.target
                // Set content text (what the quest is about)
                questFrame.Content.Text = questInfo.description;
                questFrameTab.Text = questInfo.description + `(${questInfo.progress}/${questInfo.target})`

                // Set count (progress)
                questFrame.Count.Text = `${questInfo.progress}/${questInfo.target}`;

                // Set up reward frame - for now showing coins as reward
                // You can expand this based on actual reward data structure
                questFrame.ItemRecievedFrame.Visible = true;
                questFrame.ItemRecievedFrame.TotalOfItem.Text = questInfo.reward.type === "Coins" ? tostring(questInfo.reward.amount)! : "1"; // Example reward amount

                // Add reward image if available
                const rewardImage = questFrame.ItemRecievedFrame.FindFirstChild("ImageLabel") as ImageLabel;
                if (rewardImage) {
                    rewardImage.Image = paths.Assets.UI.GameUI.Coin.Image; // Example reward image
                }
            } else {
                // Hide quest if no data
                questFrame.Content.Text = "";
                questFrame.Count.Text = "";
                questFrame.ItemRecievedFrame.Visible = false;
                questFrameTab.Text = "No Quest Available";
            }
        }
    }));

    trash.Add(useEffect(() => {
        questPage.Visible = pageStates.openPage() === "Quests";
    }));

    return trash;
};
