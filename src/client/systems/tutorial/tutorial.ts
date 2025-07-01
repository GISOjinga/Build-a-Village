import { Janitor } from "@rbxts/janitor";
import { Entity, World } from "@rbxts/jecs";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { PlayerData } from "shared/data/defaultData";
import { useMemo } from "shared/Plugin-Hook";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Raycast } from "shared/utils/functions/rayFunctions";
import { Body, Data, ActiveVillagers, Villager, Changed, ReplicatedComponent } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";

const player = Players.LocalPlayer;
const trash = new Janitor();
const arrow = trash.Add(paths.Assets.Tutorial.ArrowTutorial.Clone())
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
    const bodyEntity = getEntity.fromInstance(player);
    const serverEntity = player.GetAttribute<Entity>("ServerId");
    if (!bodyEntity || !serverEntity) return;

    const body = world.get(bodyEntity, Body);
    const data = world.get(bodyEntity, Data);
    if (!body || !data) return;

    const computeTarget = (): BasePart | Model | undefined => {
        if (data.Tutorial === 0) return paths.Map.Shops.King.Npc.HumanoidRootPart;
        if (data.Tutorial === 1) return body.platform?.Floor;
        if (data.Tutorial === 2) {
            for (const [_, __, villagerInfo] of world.query(ReplicatedComponent, Villager)) {
                if (villagerInfo.playerEntity === serverEntity && villagerInfo.villagerData.Name === "Farmer") return villagerInfo.villagerModel.PrimaryPart ?? villagerInfo.villagerModel;
            }
        }
        if (data.Tutorial === 3) return paths.Map.Shops.Merchant.Npc.HumanoidRootPart;
        return undefined;
    };

    const target = computeTarget();
    updateMessage(data.Tutorial);

    // when data changes
    for (const [_, changed] of world.query(Changed(Data))) {
        const newData = changed.new
        const oldData = changed.old

        // if the tutorial stage has changed
        if (newData?.Tutorial !== oldData?.Tutorial) {
            const currentStage = newData?.Tutorial || 0;

            // if stage was 3 then changed to done then
            if (currentStage === "Done") {
                if (oldData?.Tutorial === 3) {
                    pageStates.introText({ text: "Well done! +50 Coins.", duration: 5 });
                } else {
                    pageStates.introText({ text: "", duration: 5 });
                }
                arrow.Parent = ReplicatedStorage;
                return;
            } else {
                updateMessage(currentStage, true);
            }
        }
    }

    if (target) {
        const targetCFrame = target.GetPivot()
        arrow.Attachment0.Position = body.rootPart.Position
        arrow.Attachment1.Position = targetCFrame.Position;
        arrow.Parent = Workspace
    } else {
        arrow.Parent = ReplicatedStorage
    }
}
