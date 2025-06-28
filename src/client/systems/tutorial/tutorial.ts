import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity } from "shared/utils/functions/jecsHelpFunctions";
import { Body, Data, ActiveVillagers, Villager } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";

const player = Players.LocalPlayer;
let arrow: Part | undefined;
let lastStage: PlayerData["Tutorial"] | undefined;

function updateMessage(stage: PlayerData["Tutorial"]) {
    if (stage === lastStage) return;
    lastStage = stage;
    if (stage === 0) pageStates.introText({ text: "Welcome to Grow a Village! Let’s get started by visiting the King.", duration: 4 });
    else if (stage === 1) pageStates.introText({ text: "Great! Return to your plot and place your new Farmer.", duration: 4 });
    else if (stage === 2) pageStates.introText({ text: "Wait for the Farmer to produce Wheat, then collect it.", duration: 4 });
    else if (stage === 3) pageStates.introText({ text: "Head over to the Merchant to sell the Wheat.", duration: 4 });
    else if (stage === "Done") pageStates.introText({ text: "Well done! +500 Coins.", duration: 4 });
}

export default function tutorial(world: World) {
    const bodyEntity = getEntity.bodyFromPlayer(player);
    if (!bodyEntity) return;

    const body = world.get(bodyEntity, Body);
    const data = world.get(bodyEntity, Data);
    if (!body || !data) return;

    if (!arrow) {
        arrow = new Instance("Part");
        arrow.Name = "TutorialArrow";
        arrow.Anchored = true;
        arrow.CanCollide = false;
        arrow.Size = new Vector3(0.3, 0.3, 1);
        arrow.Material = Enum.Material.Neon;
        arrow.Color = Color3.fromRGB(255, 0, 0);
        arrow.Parent = body.model;
    }

    const computeTarget = (): BasePart | undefined => {
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
        arrow.Transparency = 0;
        arrow.Position = body.rootPart.Position.add(Vector3.yAxis.mul(3));
        const lookAt = new Vector3(target.Position.X, arrow.Position.Y, target.Position.Z);
        arrow.CFrame = CFrame.lookAt(arrow.Position, lookAt);
    } else {
        arrow.Transparency = 1;
    }
}
