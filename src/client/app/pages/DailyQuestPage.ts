import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";
import pageStates from "shared/utils/Animations/pageStates";
import useEffect from "../hooks/useEffect";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const questPage = pagePaths.QuestPage

    trash.Add(routes.updateDailyQuest.listen((info) => {
        for (let i = 0; i < 3; i++) {
            const questInfo = info[i];
            const label = questPage["Quest" + (i + 1) as "Quest1"];
            label.text.Text = questInfo ? `${questInfo.description} (${questInfo.progress}/${questInfo.target})` : "";
        }
    }));

    trash.Add(useEffect(() => {
        // questPage.Visible = pageStates.openPage() === "Quests";
    }));

    return trash;
};
