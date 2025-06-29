import { Janitor } from "@rbxts/janitor";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const label = pagePaths.Page.InviteIncentive.InviteIncentive;

    trash.Add(useEffect(() => {
        label.Text = pageStates.friendsBonus() ? "10% bonus active" : "Play with a friend for 10% bonus";
    }));

    return trash;
};
