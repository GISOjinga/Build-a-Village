import { Janitor } from "@rbxts/janitor";
import { Players } from "@rbxts/services";
import routes from "client/routes";
import { PagePaths } from "shared/utils/Animations/pagePaths";

export default (pagePaths: PagePaths) => {
    const trash = new Janitor();
    const questPage = pagePaths.QuestPage

    trash.Add(routes.updateDailyQuest.listen((info) => {
        for (let i = 0; i < 3; i++) {
            const questInfo = info[i];
            const button = questPage["Quest" + (i + 1) as "Quest1"];
            button.text.Text = questInfo ? `${questInfo.description} (${questInfo.progress}/${questInfo.target})` : "";
        }
    }));

    return trash;
};
