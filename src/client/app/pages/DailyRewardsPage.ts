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

        if (reward.type === "Villager") {
            // Use villager viewport from villagerviewports
            const villagerViewport = paths.Assets.UI.AllRenders.FindFirstChild(reward.name)?.Clone() as ViewportFrame | undefined;
            if (villagerViewport) {
                villagerViewport.Parent = slot;
                villagerViewport.Visible = true;
            }
        } else if (reward.type === "Produce") {
            // Use produce viewport  
            const produceViewport = paths.Assets.UI.AllRenders.FindFirstChild(reward.name)?.Clone() as ViewportFrame | undefined;
            if (produceViewport) {
                produceViewport.Parent = slot;
                produceViewport.Visible = true;
            }
        } else if (reward.type === "Coins") {
            // Create coin display for coin rewards
            const coinViewport = paths.Assets.UI.AllRenders.FindFirstChild("Coin")?.Clone() as ViewportFrame | undefined;
            if (coinViewport) {
                coinViewport.Parent = slot;
                coinViewport.Visible = true;

                // Add amount label
                const amountLabel = new Instance("TextLabel");
                amountLabel.Size = UDim2.fromScale(1, 0.3);
                amountLabel.Position = UDim2.fromScale(0, 0.7);
                amountLabel.BackgroundTransparency = 1;
                amountLabel.Text = `${reward.amount}`;
                amountLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
                amountLabel.TextScaled = true;
                amountLabel.Font = Enum.Font.GothamBold;
                amountLabel.Parent = slot;
            }
        }
    }

    function refresh() {
        const streak = pageStates.dailyRewardStreak();
        const lastDay = pageStates.lastDailyRewardDay();
        const currentDay = math.floor(os.time() / dayInSeconds);
        const diff = currentDay - lastDay;

        // Reset if player missed a day (diff > 1)
        const missedReward = diff > 1;
        const rewardReady = diff >= 1;

        rewardsPage.ClaimButton.Visible = rewardReady;
        rewardsPage.TimeTillNext.Visible = !rewardReady;

        if (!rewardReady) {
            const timeLeft = (lastDay + 1) * dayInSeconds - os.time();
            rewardsPage.TimeTillNext.Text = `Next reward in: ${formatToHHMMSS(timeLeft)}`;
        }

        // If missed reward, reset streak to 1, otherwise increment
        const nextStreak = missedReward ? 1 : (rewardReady ? streak + 1 : streak);

        // Cycle through rewards (reset to day 1 after day 6)
        const rewardDay = ((nextStreak - 1) % dailyRewardsData.size()) + 1;
        const rewards = dailyRewardsData[rewardDay - 1];

        for (let i = 0; i < rewardSlots.size(); i++) {
            fillSlot(rewardSlots[i], rewards[i]);
        }
    }

    // trash.Add(UIUtilities.ButtonAction({
    //     Button: rewardsPage.Close,
    //     ExpandedSize: UIUtilities.MultiplyUdim2(rewardsPage.Close.Size, sizeOffset),
    //     DeExpandedSize: UIUtilities.DivideUdim2(rewardsPage.Close.Size, sizeOffset),
    // }, () => pageStates.openPage("None")));

    trash.Add(UIUtilities.ButtonAction({
        Button: rewardsPage.ClaimButton,
        ExpandedSize: UIUtilities.MultiplyUdim2(rewardsPage.ClaimButton.Size, sizeOffset),
        DeExpandedSize: UIUtilities.DivideUdim2(rewardsPage.ClaimButton.Size, sizeOffset),
    }, () => {
        // Claim the reward
        routes.claimDailyReward.send();

        // Hide claim button and show time till next
        rewardsPage.ClaimButton.Visible = false;
        rewardsPage.TimeTillNext.Visible = true;

        // Close the page first so effects are visible
        pageStates.openPage("None");

        // Play surprise effects
        routes.playParticle.send({
            particle: paths.Assets.Particles.Surprise,
            location: undefined,
            forceAmount: 50
        });

        // Get current rewards to announce
        const streak = pageStates.dailyRewardStreak();
        const lastDay = pageStates.lastDailyRewardDay();
        const currentDay = math.floor(os.time() / dayInSeconds);
        const diff = currentDay - lastDay;
        const missedReward = diff > 1;
        const nextStreak = missedReward ? 1 : streak + 1;
        const rewardDay = ((nextStreak - 1) % dailyRewardsData.size()) + 1;
        const rewards = dailyRewardsData[rewardDay - 1];

        // Announce rewards one by one with 1 second delay between each
        rewards.forEach((reward, index) => {
            task.delay(index + 1, () => {
                let rewardText = "";
                if (reward.type === "Coins") {
                    rewardText = `${reward.amount} Coins`;
                } else {
                    rewardText = reward.name;
                }

                routes.notify.send({
                    text: `Daily Reward: ${rewardText}!`,
                    duration: 3
                });
            });
        });

        refresh();
    }));

    trash.Add(useEffect(() => {
        if (pageStates.openPage() === "DailyRewards") refresh();
    }));

    trash.Add(task.spawn(() => {
        while (true) {
            if (rewardsPage.Visible && !rewardsPage.ClaimButton.Visible) {
                const lastDay = pageStates.lastDailyRewardDay();
                const timeLeft = (lastDay + 1) * dayInSeconds - os.time();
                rewardsPage.TimeTillNext.Text = `Next reward in: ${formatToHHMMSS(timeLeft)}`;
            }
            task.wait(1);
        }
    }));

    return trash;
};
