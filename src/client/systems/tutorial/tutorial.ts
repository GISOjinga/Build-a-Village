import { Janitor } from "@rbxts/janitor";
import { World } from "@rbxts/jecs";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { PlayerData } from "shared/data/defaultData";
import { useMemo } from "shared/Plugin-Hook";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Data, ActiveVillagers, Villager } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";

const player = Players.LocalPlayer;
const trash = new Janitor();
let lastStage: PlayerData["Tutorial"] | undefined;

trash.LinkToInstance(script, true);

function updateMessage(stage: PlayerData["Tutorial"]) {
    if (stage === lastStage) return;
    lastStage = stage;
    if (stage === 0) pageStates.introText({ text: "Welcome to Grow a Village! Let’s get started by visiting the King and buying a Farmer.", duration: 5 });
    else if (stage === 1) pageStates.introText({ text: "Great! Return to your plot and place your new Farmer.", duration: 5 });
    else if (stage === 2) pageStates.introText({ text: "Wait for the Farmer to produce Wheat, then collect it.", duration: 5 });
    else if (stage === 3) pageStates.introText({ text: "Head over to the Merchant to sell the Wheat.", duration: 5 });
    else if (stage === "Done") pageStates.introText({ text: "Well done! +500 Coins.", duration: 5 });
}

export default function tutorial(world: World) {
    let arrow = useMemo(() => trash.Add(paths.Assets.Tutorial.Arrow.Clone()), [])
    const bodyEntity = getEntity.fromInstance(player);
    if (!bodyEntity) return;

    const body = world.get(bodyEntity, Body);
    const data = world.get(bodyEntity, Data);
    if (!body || !data) return;

    const computeTarget = (): BasePart | Model | undefined => {
        if (data.Tutorial === 0) return paths.Map.Shops.Buy.Noob.HumanoidRootPart;
        if (data.Tutorial === 1) return body.platform?.Floor;
        if (data.Tutorial === 2) {
            const active = world.get(bodyEntity, ActiveVillagers);
            if (active) {
                for (const info of active) {
                    const vInfo = world.get(info.entity, Villager);
                    if (vInfo && vInfo.villagerData.Name === "Farmer") return vInfo.villagerModel.PrimaryPart ?? vInfo.villagerModel;
                }
            }
        }
        if (data.Tutorial === 3) return paths.Map.Shops.Sell.Noob.HumanoidRootPart;
        return undefined;
    };

    const target = computeTarget();
    updateMessage(data.Tutorial);

    if (target) {
        const targetCFrame = target.GetPivot()
        const lookAt = new Vector3(targetCFrame.Position.X, arrow.GetPivot().Y, targetCFrame.Position.Z);
        arrow.PivotTo(arrow.GetPivot().Lerp(CFrame.lookAt(body.rootPart.Position.add(body.rootPart.CFrame.UpVector.mul(-3)), lookAt), .2))
        arrow.Parent = Workspace
    } else {
        arrow.Parent = ReplicatedStorage
    }
}
