import { World } from "@rbxts/jecs";
import { TweenService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

const GOLD_COLORS = [
    Color3.fromRGB(255, 214, 89),
    Color3.fromRGB(255, 223, 52),
    Color3.fromRGB(255, 232, 132),
];

const goldTweens = new Map<Instance, Janitor>();

function createLoop(part: BasePart, colors: readonly Color3[], janitor: Janitor) {
    let index = 0;
    const info = new TweenInfo(0.8, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut);
    const step = () => {
        const nextIndex = (index + 1) % colors.size();
        const tween = TweenService.Create(part, info, { Color: colors[nextIndex] });
        janitor.Add(tween);
        const conn = tween.Completed.Connect(step);
        janitor.Add(conn);
        tween.Play();
        index = nextIndex;
    };
    part.Color = colors[0];
    step();
}

function startTweens(instance: Instance) {
    const janitor = new Janitor();
    goldTweens.set(instance, janitor);
    if (instance.IsA("BasePart")) createLoop(instance, GOLD_COLORS, janitor);
    instance.GetDescendants().forEach((desc) => {
        if (desc.IsA("BasePart")) createLoop(desc, GOLD_COLORS, janitor);
    });
}

function stopTweens(instance: Instance) {
    const janitor = goldTweens.get(instance);
    if (janitor) {
        janitor.Destroy();
        goldTweens.delete(instance);
    }
}

export default (isTagged: boolean, inst: Instance, world: World) => {
    if (isTagged) startTweens(inst);
    else stopTweens(inst);
};
