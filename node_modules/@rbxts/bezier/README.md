# Bezier Curve
Easily calculate points on a bezier curve!
Typescript 4+ due to Variadic Tuple Types.
## Example
```ts
import BezierCurve from "@rbxts/bezier";

const curve = new BezierCurve([
	new Vector3(0, 0, 0),
	new Vector3(100, 0, 0),
	new Vector3(100, 0, 100),
	new Vector3(0, 0, 100),
]);

const base = new Instance("Part");
base.Size = new Vector3(100, 1, 100);
base.Position = new Vector3(50, -1, 50);
base.Parent = game.Workspace;

for (let i = 0; i <= 100; i++) {
	const part = new Instance("Part");
	part.Position = curve.calculate(i / 100);
	part.Size = new Vector3(1, 1, 1);
	part.BrickColor = new BrickColor("Really red");
	part.Parent = game.Workspace;
}
```
