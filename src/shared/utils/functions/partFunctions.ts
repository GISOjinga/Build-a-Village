
export const basePart = {
    createBall: (data?: Partial<WritableInstanceProperties<Part>>) => {
        const part = new Instance("Part");

        part.Size = data?.Size || Vector3.one;
        part.Color = data?.Color || Color3.fromRGB();
        part.Position = data?.Position || Vector3.one;
        part.Material = Enum.Material.Neon;
        part.Anchored = true;
        part.CanTouch = false;
        part.CanCollide = false;
        part.CanQuery = false;
        part.Shape = Enum.PartType.Ball;
        part.Name = "Ball";

        return part;
    }
}


// This will get you a random point in a part
export const randomPointOnPart = (part: BasePart) => {
    const size = part.Size;
    const position = part.Position;
    const x = math.random(-size.X / 2, size.X / 2);
    const y = math.random(-size.Y / 2, size.Y / 2);
    const z = math.random(-size.Z / 2, size.Z / 2);
    const point = new Vector3(x, y, z).add(position);

    return point;
}