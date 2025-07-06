import { Janitor } from "@rbxts/janitor";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import UIUtilities from "shared/utils/Animations/uiUtilities";
import dailyRewardsData, { DailyRewardItem } from "shared/data/dailyRewardsData";
import { formatToHHMMSS } from "shared/utils/functions/stringHelp";
import useEffect from "../hooks/useEffect";
import paths from "shared/utils/paths";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const rewardsPage = pagePaths.DailyRewardsPage;
    const dayInSeconds = 60 * 60 * 24;
    const sizeOffset = UDim2.fromScale(1.05, 1.05);

    const rewardSlots = [rewardsPage.Prize1, rewardsPage.Prize2, rewardsPage.Prize3, rewardsPage.Prize4, rewardsPage.Prize5];

    function fillSlot(slot: ImageLabel, reward?: DailyRewardItem) {
        slot.GetChildren().forEach(c => {
            if (c.IsA("ViewportFrame")) c.Destroy();
        });
        if (!reward) return;
        if (reward.type === "Villager" || reward.type === "Produce") {
            const rendersFolder = reward.type === "Produce"
                ? (paths.Assets.UI as unknown as { ProduceRenders: Folder }).ProduceRenders
                : paths.Assets.UI.VillagerRenders;
            const viewport = rendersFolder.FindFirstChild(reward.name)?.Clone() as ViewportFrame | undefined;
            if (viewport) {
                viewport.Parent = slot;
                viewport.Visible = true;
            }
        }
    }

    function refresh() {
        const streak = pageStates.dailyRewardStreak();
        const lastDay = pageStates.lastDailyRewardDay();
        const currentDay = math.floor(os.time() / dayInSeconds);
        const diff = currentDay - lastDay;
        const rewardReady = diff >= 1;
        rewardsPage.ClaimButton.Visible = rewardReady;
        rewardsPage.TimeTillNext.Visible = !rewardReady;
        if (!rewardReady) {
            const timeLeft = (lastDay + 1) * dayInSeconds - os.time();
            rewardsPage.TimeTillNext.Text = formatToHHMMSS(timeLeft);
        }
        const nextStreak = rewardReady ? (diff === 1 ? streak + 1 : 1) : streak + 1;
        const rewards = dailyRewardsData[math.clamp(nextStreak, 1, dailyRewardsData.size()) - 1];
        for (let i = 0; i < rewardSlots.size(); i++) {
            fillSlot(rewardSlots[i], rewards[i]);
        }
    }

    trash.Add(UIUtilities.ButtonAction({
        Button: rewardsPage.Close,
        ExpandedSize: UIUtilities.MultiplyUdim2(rewardsPage.Close.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(rewardsPage.Close.Size, sizeOffset),
    }, () => pageStates.openPage("None")));

    trash.Add(UIUtilities.ButtonAction({
        Button: rewardsPage.ClaimButton,
        ExpandedSize: UIUtilities.MultiplyUdim2(rewardsPage.ClaimButton.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(rewardsPage.ClaimButton.Size, sizeOffset),
    }, () => {
        routes.claimDailyReward.send();
        rewardsPage.ClaimButton.Visible = false;
        rewardsPage.TimeTillNext.Visible = true;
        refresh();
        pageStates.openPage("None");
    }));

    trash.Add(useEffect(() => {
        refresh();
    }));

    trash.Add(task.spawn(() => {
        while (true) {
            if (pageStates.openPage() === "DailyRewards") refresh();
            task.wait(1);
        }
    }));

    return trash;
};
