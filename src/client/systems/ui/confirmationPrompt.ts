import { World } from "@rbxts/jecs";
import { routes } from "shared/data/network";
import pageStates from "shared/utils/Animations/pageStates";
import { Added, ConfirmationPrompt, Removed } from "shared/utils/jecs/jecsComponents";







export default (world: World) => {
    // when ever confirmation prompt is added
    for (const [_, { title, message }] of world.query(Added(ConfirmationPrompt))) pageStates.confirmPrompt({ message, title })

    // when removed hides the text
    for (const [_, confirmationPrompt] of world.query(Removed(ConfirmationPrompt))) pageStates.confirmPrompt({ title: "", message: "" });
}