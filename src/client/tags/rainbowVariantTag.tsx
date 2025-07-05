import { World } from "@rbxts/jecs";
import { TweenService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

const RAINBOW_COLORS = [
    Color3.fromRGB(255, 0, 0),
    Color3.fromRGB(255, 127, 0),
    Color3.fromRGB(255, 255, 0),
    Color3.fromRGB(0, 255, 0),
    Color3.fromRGB(0, 0, 255),
    Color3.fromRGB(75, 0, 130),
    Color3.fromRGB(148, 0, 211),
];

const rainbowTweens = new Map<Instance, Janitor>();

function createLoop(part: BasePart, colors: readonly Color3[], janitor: Janitor) {
    let index = 0;
    const info = new TweenInfo(0.5, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut);
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
    rainbowTweens.set(instance, janitor);
    if (instance.IsA("BasePart")) createLoop(instance, RAINBOW_COLORS, janitor);
    instance.GetDescendants().forEach((desc) => {
        if (desc.IsA("BasePart")) createLoop(desc, RAINBOW_COLORS, janitor);
    });
}

function stopTweens(instance: Instance) {
    const janitor = rainbowTweens.get(instance);
    if (janitor) {
        janitor.Destroy();
        rainbowTweens.delete(instance);
    }
}

export default (isTagged: boolean, inst: Instance, world: World) => {
    if (isTagged) startTweens(inst);
    else stopTweens(inst);
};
