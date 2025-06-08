import { Workspace } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";

/**
 * Given the CFrame and Size of a cube, this function returns the closest surface position.
 * 
 * @param {CFrame} areaCFrame - The CFrame of the area (cube).
 * @param {Vector3} areaSize - The Size of the area (cube).
 * @param {Vector3} targetPosition - The target position to find the closest surface position to.
 * @returns {Vector3} - The closest surface position on the cube.
 */
export function vector3GetPointOnSurface(areaCFrame: CFrame, areaSize: Vector3, _targetPosition: Vector3): Vector3 {
    const direction = _targetPosition.sub(areaCFrame.Position).Unit;
    const targetPosition = areaCFrame.Position.add(direction.mul(100));

    // Calculate half sizes of the cube
    const halfSize = areaSize.div(2);

    // Convert the target position to the local space of the cube
    const localPosition = areaCFrame.PointToObjectSpace(targetPosition);

    // Clamp the local position to the bounds of the cube to find the closest point on the surface
    const clampedLocalPosition = new Vector3(
        math.clamp(localPosition.X, -halfSize.X, halfSize.X),
        math.clamp(localPosition.Y, -halfSize.Y, halfSize.Y),
        math.clamp(localPosition.Z, -halfSize.Z, halfSize.Z)
    );

    // Convert the clamped local position back to world space
    const surfacePosition = areaCFrame.PointToWorldSpace(clampedLocalPosition);

    return surfacePosition;
}

export class CreateVisualizer {
    private attachment1: Attachment;
    private attachment0: Attachment;
    private container: Attachment;
    private beam: Beam;

    constructor(parent?: Instance) {
        const beam = new Instance("Beam"); // Creating the beam instance
        const container = new Instance("Attachment")

        // Creating the first attachment
        this.attachment0 = new Instance("Attachment");
        this.attachment0.Parent = container;

        // Creating the second attachment
        this.attachment1 = new Instance("Attachment");
        this.attachment1.Parent = container;

        // sets up beam
        beam.Parent = container;
        beam.Attachment0 = this.attachment0;
        beam.Attachment1 = this.attachment1;
        beam.FaceCamera = true
        beam.Width0 = 0.1; // Set the width of the beam at the first attachment
        beam.Width1 = 0.1; // Set the width of the beam at the second attachment
        beam.Transparency = new NumberSequence(0); // Set the transparency of the beam
        beam.Color = new ColorSequence(Color3.fromRGB(255, 0, 0)); // Set the color of the beam
        beam.LightEmission = 1; // Set the light emission of the beam
        this.beam = beam;

        // Creating the folder that will hold the attachments
        container.Name = "RayVisualizer";
        container.Parent = parent || Workspace.Terrain; // Default to Workspace if no parent is provided
        this.container = container;
    }

    // to change color
    public SetColor(color: Color3) {
        this.beam.Color = new ColorSequence(color); // Set the color of the beam
        return this
    }

    // Overloaded MoveTo method
    public MoveTo(origin: Vector3, unitDirection: Vector3, length?: number): void;
    public MoveTo(startPoint: Vector3, endPoint: Vector3): void;
    public MoveTo(startPoint: Vector3, directionOrEndPoint: Vector3, length?: number): void {
        if (length !== undefined) {
            // If length is provided, calculate the end point using the direction and length
            const direction = directionOrEndPoint.Unit; // Normalize the direction
            const endPoint = startPoint.add(direction.mul(length)); // Default length logic
            this.attachment1.WorldPosition = endPoint;
            this.attachment0.WorldPosition = startPoint;
        } else {
            // Otherwise, use the second method with start and end points
            this.attachment1.WorldPosition = directionOrEndPoint;
            this.attachment0.WorldPosition = startPoint;
        }
    }

    // Destroy the visualizer (remove the part and attachments)
    public Destroy() {
        this.container.Destroy();
    }
}

// tells you if the params of two vectors are equal
export const isVectorAxisEqual = (a: Vector3, b: Vector3, axis: { x?: boolean, y?: boolean, z?: boolean }): boolean => {
    return (axis.x === true ? a.X === b.X : axis.x === undefined) && (axis.y === true ? a.Y === b.Y : axis.y === undefined) && (axis.z === true ? a.Z === b.Z : axis.z === undefined);
};


/**
 * 
 */
export const isPointInView = (
    origin: Vector3,
    target: Vector3,
    direction: Vector3,
    distance: number,
    fov: number
): boolean => {
    const dirToEnemy = target.sub(origin);  // Calculate direction to the target
    const angle = math.acos(math.clamp(direction.Dot(dirToEnemy.Unit), -1, 1)); // Angle between direction and target

    // Check if the target is within the field of view and distance
    if (dirToEnemy.Magnitude <= distance && math.abs(angle) <= math.rad(fov) / 2) {
        return true; // Target is in view
    }

    return false; // Target is not in view
};


// AngleUtils.ts

/**
 * Returns the angle in degrees (0–180) between two Vector3s.
 *
 * @param vectorA - First vector
 * @param vectorB - Second vector
 * @returns Angle in degrees
 */
export function vector3AngleBetween(vectorA: Vector3, vectorB: Vector3): number {
    try {
        const magA = vectorA.Magnitude;
        const magB = vectorB.Magnitude;

        if (magA === 0 || magB === 0) {
            warn(`vector3AngleBetween: zero-length vector at line ${$line}`);
            return 0;
        }

        const cosTheta = math.clamp(
            vectorA.Dot(vectorB) / (magA * magB),
            -1,
            1,
        );
        const angleRad = math.acos(cosTheta);
        return math.deg(angleRad);
    } catch (err) {
        warn(`Error in vector3AngleBetween at line ${$line}: ${tostring(err)}`);
        return 0;
    }
}

