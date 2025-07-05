import { World } from "@rbxts/jecs";
import { TweenService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";

const GOLD_COLORS = [
    Color3.fromRGB(204, 173, 51),   // Deep gold base
    Color3.fromRGB(230, 194, 60),   // Rich yellow gold
    Color3.fromRGB(255, 214, 89),   // Mid gold (original)
    Color3.fromRGB(255, 223, 52),   // Bright gold (original)
    Color3.fromRGB(255, 232, 132),  // Soft highlight (original)
    Color3.fromRGB(255, 245, 184),  // Lightest edge highlight
    Color3.fromRGB(240, 210, 90),   // Matte gold tone
    Color3.fromRGB(220, 180, 70),   // Shadow gold
    Color3.fromRGB(190, 140, 50),   // Lowlight bronze-gold
];

const goldTweens = new Map<Instance, Janitor>();

function createLoop(part: BasePart, colors: readonly Color3[], trash: Janitor) {
    let goldColors = [...GOLD_COLORS]
    part.Material = Enum.Material.Metal; // Set the material to Neon for better visibility
    const step = () => {
        const info = new TweenInfo((math.random() * 2) + .5, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut);
        const nextIndex = math.floor(math.random() * goldColors.size())
        const tween = trash.Add(TweenService.Create(part, info, { Color: colors[nextIndex] }));
        goldColors.remove(nextIndex);
        if (goldColors.size() === 0) goldColors = [...GOLD_COLORS];
        trash.Add(tween.Completed.Connect(step));
        tween.Play();
    };
    part.SetAttribute("OriginalColor", part.GetAttribute("OriginalColor") || part.Color);
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
    const info = new TweenInfo(0.8, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut);
    const janitor = goldTweens.get(instance);
    if (janitor) {
        janitor.Destroy();
        goldTweens.delete(instance);
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
