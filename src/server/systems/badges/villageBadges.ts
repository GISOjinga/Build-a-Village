import { World } from "@rbxts/jecs";
import { Players, BadgeService } from "@rbxts/services";
import { useEvent } from "shared/Plugin-Hook";

const BADGE_IDS = [
    4361348165786197, // E
    2236618367905072, // G
    3253586185017166, // A
    1880254493075857, // L
    636369565910968,  // L
    3840411970143858, // I
    3745057483115168, // V
];

function awardBadges(player: Player) {
    if (player.GetAttribute("VillageBadgesGranted")) return;
    player.SetAttribute("VillageBadgesGranted", true);

    task.spawn(() => {
        let previousId: number | undefined = undefined;
        for (const badgeId of BADGE_IDS) {
            if (previousId !== undefined) {
                let tries = 0;
                while (tries < 10 && !BadgeService.UserHasBadgeAsync(player.UserId, previousId)) {
                    task.wait(0.5);
                    tries++;
                }
            }

            if (!BadgeService.UserHasBadgeAsync(player.UserId, badgeId)) {
                const [success] = pcall(() => BadgeService.AwardBadge(player.UserId, badgeId));
                if (!success) warn(`Failed to award badge ${badgeId} to ${player.Name}`);
            }
            previousId = badgeId;
            task.wait(0.2);
        }
    });
}

export default (world: World) => {
    Players.GetPlayers().forEach(awardBadges);
    for (const [player] of useEvent(Players.PlayerAdded)) awardBadges(player);
};
