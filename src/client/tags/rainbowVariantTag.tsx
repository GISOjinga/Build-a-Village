import { World } from "@rbxts/jecs";
import { TweenService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

const RAINBOW_COLORS = [
    Color3.fromRGB(255, 0, 0),     // Red
    Color3.fromRGB(255, 64, 0),
    Color3.fromRGB(255, 127, 0),   // Orange
    Color3.fromRGB(255, 191, 0),
    Color3.fromRGB(255, 255, 0),   // Yellow
    Color3.fromRGB(191, 255, 0),
    Color3.fromRGB(127, 255, 0),
    Color3.fromRGB(0, 255, 0),     // Green
    Color3.fromRGB(0, 255, 127),
    Color3.fromRGB(0, 255, 255),   // Cyan
    Color3.fromRGB(0, 191, 255),
    Color3.fromRGB(0, 127, 255),
    Color3.fromRGB(0, 0, 255),     // Blue
    Color3.fromRGB(38, 0, 255),
    Color3.fromRGB(75, 0, 130),    // Indigo
    Color3.fromRGB(111, 0, 170),
    Color3.fromRGB(148, 0, 211),   // Violet
    Color3.fromRGB(186, 0, 255),
];

const rainbowTweens = new Map<Instance, Janitor>();

function createLoop(part: BasePart, colors: readonly Color3[], trash: Janitor) {
    let rainbowColorsClone = [...RAINBOW_COLORS]
    part.Material = Enum.Material.Neon; // Set the material to Neon for better visibility
    const step = () => {
        const info = new TweenInfo((math.random() * 2) + .5, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut);
        const nextIndex = math.floor(math.random() * rainbowColorsClone.size())
        const tween = trash.Add(TweenService.Create(part, info, { Color: colors[nextIndex] }));
        rainbowColorsClone.remove(nextIndex);
        if (rainbowColorsClone.size() === 0) rainbowColorsClone = [...RAINBOW_COLORS];
        trash.Add(tween.Completed.Connect(step))
        tween.Play();
    };
    part.Color = colors[0];
    part.SetAttribute("OriginalColor", part.GetAttribute("OriginalColor") || part.Color);
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
    const info = new TweenInfo(0.8, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut);
    const janitor = rainbowTweens.get(instance);
    if (janitor) {
        janitor.Destroy();
        rainbowTweens.delete(instance);
        if (instance.IsA("BasePart")) {
            TweenService.Create(instance, info, { Color: instance.GetAttribute<Color3>("OriginalColor") || instance.Color }).Play();
            instance.Material = Enum.Material.Plastic; // Reset material to default
        }
        instance.GetDescendants().forEach((desc) => {
            if (desc.IsA("BasePart")) {
                TweenService.Create(desc, info, { Color: desc.GetAttribute<Color3>("OriginalColor") || desc.Color }).Play();
                desc.Material = Enum.Material.Plastic; // Reset material to default
            }
        })
    }
}

export default (isTagged: boolean, inst: Instance, world: World) => {
    if (isTagged) startTweens(inst);
    else stopTweens(inst);
};
