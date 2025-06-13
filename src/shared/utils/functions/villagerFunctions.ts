import RotatedRegion3 from "@rbxts/fast-rotated-region3";



// checks if model is overlapping other models
export const isVillagersOverlapping = (models: Model[], villager: VillagerModel, villagerPivot: CFrame = villager.GetPivot()) => {
    // const villagerCenter = villagerPivot.Position;
    const villagerSize = villager.GetExtentsSize();
    const region = new RotatedRegion3(villagerPivot, villagerSize)


    for (const model of models) {
        const hitBox = model.FindFirstChild("HitBox") as BasePart | undefined;
        const position = model.GetPivot().Position;

        // Skip comparing the villager to itself
        if (model === villager) continue

        // Get other model's pivot and center
        if (hitBox && (position === villagerPivot.Position || region.CastPart(hitBox))) return true;
    }

    // No overlaps

    return false
}