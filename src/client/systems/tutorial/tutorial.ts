import { Janitor } from "@rbxts/janitor";
import { Entity, World } from "@rbxts/jecs";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { PlayerData } from "shared/data/defaultData";
import { useMemo } from "shared/Plugin-Hook";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Raycast } from "shared/utils/functions/rayFunctions";
import { Body, ActiveVillagers, Villager, ReplicatedComponent } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";
import { useRoute } from "shared/Plugin-Hook/hooks/use-route";
import routes from "client/routes";

const player = Players.LocalPlayer;
const trash = new Janitor();
const arrow = trash.Add(paths.Assets.Tutorial.ArrowTutorial.Clone())
let currentTutorialStage: PlayerData["Tutorial"] = "Done";
let lastStage: PlayerData["Tutorial"] | undefined;

trash.LinkToInstance(script, true);

function updateMessage(stage: PlayerData["Tutorial"], force: boolean = false) {
    if (pageStates.introText().text === "" || force) {
        if (stage === 0) pageStates.introText({ text: "Welcome to Grow a Village! Let’s get started by visiting the King and buying a Farmer.", duration: 10000000 });
        else if (stage === 1) pageStates.introText({ text: "Great! Return to your plot and place your new Farmer.", duration: 10000000 });
        else if (stage === 2) pageStates.introText({ text: "Wait for the Farmer to produce Wheat, then collect it.", duration: 10000000 });
        else if (stage === 3) pageStates.introText({ text: "Head over to the Merchant to sell the Wheat.", duration: 10000000 });
    }
}

export default (world: World) => {
    // Listen for tutorial progress updates
    useRoute(routes.updateTutorialProgress, (tutorial) => {
        const oldStage = currentTutorialStage;
        currentTutorialStage = tutorial;
        
        // if the tutorial stage has changed
        if (tutorial !== oldStage) {
            // if stage was 3 then changed to done then
            if (tutorial === "Done") {
                if (oldStage === 3) {
                    pageStates.introText({ text: "Well done! +50 Coins.", duration: 5 });
                } else {
                    pageStates.introText({ text: "", duration: 5 });
                }
                arrow.Parent = ReplicatedStorage;
                return;
            } else {
                updateMessage(tutorial, true);
            }
        }
    });

    const bodyEntity = getEntity.fromInstance(player);
    const serverEntity = player.GetAttribute<Entity>("ServerId");
    if (!bodyEntity || !serverEntity) return;

    const body = world.get(bodyEntity, Body);
    if (!body) return;

    const computeTarget = (): BasePart | Model | undefined => {
        if (currentTutorialStage === 0) return paths.Map.Shops.King.Npc.HumanoidRootPart;
        if (currentTutorialStage === 1) return body.platform?.Floor;
        if (currentTutorialStage === 2) {
            for (const [_, __, villagerInfo] of world.query(ReplicatedComponent, Villager)) {
                if (villagerInfo.playerEntity === serverEntity && villagerInfo.villagerData.Name === "Farmer") return villagerInfo.villagerModel.PrimaryPart ?? villagerInfo.villagerModel;
            }
        }
        if (currentTutorialStage === 3) return paths.Map.Shops.Merchant.Npc.HumanoidRootPart;
        return undefined;
    };

    const target = computeTarget();
    updateMessage(currentTutorialStage);

    if (target) {
        const targetCFrame = target.GetPivot()
        arrow.Attachment0.Position = body.rootPart.Position
        arrow.Attachment1.Position = targetCFrame.Position;
        arrow.Parent = Workspace
    } else {
        arrow.Parent = ReplicatedStorage
    }
}
