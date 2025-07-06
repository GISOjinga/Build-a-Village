export function slotIndexAtPosition(slots: GuiObject[], pos: Vector2): number | undefined {
    let bestIndex: number | undefined;
    let bestDist = math.huge;
    slots.forEach((slot, i) => {
        const center = slot.AbsolutePosition.add(slot.AbsoluteSize.div(2));
        const dist = center.sub(pos).Magnitude;
        if (dist < bestDist) {
            bestDist = dist;
            bestIndex = i;
        }
    });
    return bestIndex;
}
