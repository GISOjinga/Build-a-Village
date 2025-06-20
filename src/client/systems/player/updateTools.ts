import { Janitor } from "@rbxts/janitor";
import { Entity, World } from "@rbxts/jecs";
import { deepEquals } from "@rbxts/object-utils";
import { Players, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { useChange, useEffect, useEvent, useMemo, useState, useThrottle } from "shared/Plugin-Hook";
import pageStates from "shared/utils/Animations/pageStates";
import { getEntity, printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Raycast, rayParamsInclude } from "shared/utils/functions/rayFunctions";
import { isVillagersOverlapping } from "shared/utils/functions/villagerFunctions";
import { Body, Changed, Data, Player, ReplicatedComponent, TargetEntity, Villager } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";



// variables
const player = Players.LocalPlayer
const camera = Workspace.Camera
const mouse = player.GetMouse()
const registeredTools = new Map<Tool, ToolInfo>()
const trash = new Janitor();
let villagerServerEntityToDig: Entity | undefined;
let goalCFrame: CFrame | undefined;
let highlight: Highlight | undefined;
let fakeModel: VillagerModel | undefined;
let rotatedY = 0

// sets up trash
trash.LinkToInstance(script, false)


// function to tween highligh color
const highlightTween = (passed: boolean | undefined) => {
    if (highlight) {
        trash.Add(TweenService.Create(highlight, new TweenInfo(.3, Enum.EasingStyle.Cubic), {
            FillColor: passed === true ? new Color3(0, 1, 0.22) : new Color3(1, 0, 0),
            OutlineColor: passed === true ? new Color3(0, 0.5, 0) : new Color3(0.5, 0, 0),
            FillTransparency: passed === undefined ? 1 : 0.5,
            OutlineTransparency: passed === undefined ? 1 : 0.5,
        })).Play();
    }
}

/**
 * Snaps a CFrame to the nearest grid unit relative to a given origin CFrame.
 * The object's rotation is preserved, and the pivot point is snapped to the grid.
 *
 * @param originCFrame - The CFrame defining the grid's origin and orientation.
 * @param objectCFrame - The object's CFrame to be snapped.
 * @param gridSize - Size of one grid unit (default: 1)
 * @returns A new CFrame snapped to the grid, preserving rotation.
 */
export function getSnappedGridCFrame(originCFrame: CFrame, objectCFrame: CFrame, gridSize = 1): CFrame {
    // Convert object's world position into the local space of the grid
    const localPos = originCFrame.PointToObjectSpace(objectCFrame.Position);

    // Snap the local coordinates to the nearest grid step
    const snappedLocalX = math.floor((localPos.X / gridSize) + 0.5) * gridSize;
    const snappedLocalY = math.floor((localPos.Y / gridSize) + 0.5) * gridSize;
    const snappedLocalZ = math.floor((localPos.Z / gridSize) + 0.5) * gridSize;

    const snappedLocalPos = new Vector3(snappedLocalX, snappedLocalY, snappedLocalZ);

    // Convert the snapped position back into world space
    const snappedWorldPos = originCFrame.PointToWorldSpace(snappedLocalPos);

    // Extract rotation from the original object's CFrame
    const [_, __, ___, R00, R01, R02, R10, R11, R12, R20, R21, R22] = objectCFrame.GetComponents();

    // Return a new CFrame with snapped position and original rotation
    return new CFrame(
        snappedWorldPos.X, snappedWorldPos.Y, snappedWorldPos.Z,
        R00, R01, R02,
        R10, R11, R12,
        R20, R21, R22
    );
}

/**
 * Clamps a CFrame (with size) to stay fully within a rotated bounding box.
 *
 * @param objectCFrame - The object's CFrame.
 * @param objectSize - The object's full size (from GetExtentsSize()).
 * @param boundsCFrame - The center CFrame of the bounding region.
 * @param boundsSize - The bounds' full size (e.g. platform size).
 * @returns A new CFrame with the object's position clamped, preserving rotation.
 */
export function clampCFrameToBounds(
    objectCFrame: CFrame,
    objectSize: Vector3,
    boundsCFrame: CFrame,
    boundsSize: Vector3
): CFrame {
    // Convert object's position into bounds' local space
    const localPos = boundsCFrame.PointToObjectSpace(objectCFrame.Position);

    // Rotate the object's size into bounds-local space to get actual footprint
    const objectRight = objectCFrame.RightVector.Abs().mul(objectSize.X);
    const objectUp = objectCFrame.UpVector.Abs().mul(objectSize.Y);
    const objectLook = objectCFrame.LookVector.Abs().mul(objectSize.Z);
    const rotatedSize = objectRight.add(objectUp).add(objectLook);
    const objectHalf = rotatedSize.div(2);
    const boundsHalf = boundsSize.div(2);

    // Clamp local position so the object stays fully within the bounds
    const clampedX = math.clamp(localPos.X, -boundsHalf.X + objectHalf.X, boundsHalf.X - objectHalf.X);
    const clampedY = math.clamp(localPos.Y, -boundsHalf.Y + objectHalf.Y, boundsHalf.Y - objectHalf.Y);
    const clampedZ = math.clamp(localPos.Z, -boundsHalf.Z + objectHalf.Z, boundsHalf.Z - objectHalf.Z);

    const clampedLocalPos = new Vector3(clampedX, clampedY, clampedZ);
    const clampedWorldPos = boundsCFrame.PointToWorldSpace(clampedLocalPos);

    // Reconstruct CFrame with original rotation but clamped position
    const [_, __, ___, R00, R01, R02, R10, R11, R12, R20, R21, R22] = objectCFrame.GetComponents();
    return new CFrame(clampedWorldPos.X, clampedWorldPos.Y, clampedWorldPos.Z, R00, R01, R02, R10, R11, R12, R20, R21, R22);
}

export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player);
    const platform = body && body.platform;
    const platformFloor = platform?.FindFirstChild("Floor") as BasePart | undefined;
    const villagers = platform?.FindFirstChild("Villagers") as Folder | undefined;
    const backpack = player.FindFirstChild("Backpack");
    const equippedTool = body && body.model.FindFirstChildOfClass("Tool");

    // for palcing villagers
    if (pageStates.placeVillager() && fakeModel && goalCFrame && !UserInputService.KeyboardEnabled) {
        printJecs($line, "Placing villager at", goalCFrame);
        pageStates.placeVillager(false)
        routes.placeVillager.send(goalCFrame)
    } else if (pageStates.digVillager() && villagerServerEntityToDig) {
        printJecs($line, "Digging villager at", goalCFrame);
        pageStates.digVillager(false);
        routes.digVillager.send(villagerServerEntityToDig);
    }

    // when a tool is added to backpack that isnt registered then backpack
    if (backpack) {
        const loadTool = (tool: Tool) => {
            printJecs($line, "Loading tool", tool, registeredTools);
            if (tool.IsA("Tool") && !registeredTools.has(tool)) {
                const toolType = tool.GetAttribute<"Villager" | "DigTool">("ItemType")!;
                const itemName = tool.GetAttribute<ItemName>("ItemName")!;

                // when the tool is added to the world
                registeredTools.set(tool, { ItemName: itemName, ToolType: toolType as never });
                printJecs($line, "Registered tool", tool, itemName, toolType, registeredTools);

                // when destroying
                tool.Destroying.Connect(() => registeredTools.delete(tool));

                // when the tool is activated
                trash.Add(tool.Activated.Connect(() => {
                    if (!UserInputService.KeyboardEnabled) return
                    printJecs($line, "Activated", registeredTools, toolType)
                    if (toolType === "Villager" && fakeModel && goalCFrame) {
                        printJecs($line, "Placing villager at", goalCFrame);
                        routes.placeVillager.send(goalCFrame)
                    } else if (toolType === "DigTool" && villagerServerEntityToDig) {
                        printJecs($line, "Digging villager at", goalCFrame);
                        routes.digVillager.send(villagerServerEntityToDig);
                    }
                }))
            }
        }

        // initially registers all the tools
        useEffect(() => {
            const trash = new Janitor();

            // when a tool is added to the backpack
            trash.Add(backpack.ChildAdded.Connect((tool) => loadTool(tool as Tool)))

            // gets the children in the body model
            body?.model.GetChildren().forEach((tool) => {
                if (tool.IsA("Tool")) loadTool(tool as Tool);
            })

            // when a tool is removed from the backpack
            backpack.GetChildren().forEach((tool) => {
                if (tool.IsA("Tool")) loadTool(tool as Tool);
            })

            return () => trash.Destroy();
        }, [body && backpack], $line)
    }


    // if there is a equipped tool and its registered then
    if (body && useChange([equippedTool, equippedTool && registeredTools.has(equippedTool)])) {

        // destroys old model
        fakeModel?.Destroy();
        highlight?.Destroy();
        fakeModel = undefined;
        highlight = undefined;
        villagerServerEntityToDig = undefined;
        pageStates.placementOffset(0);
        pageStates.placeVillager(false);
        pageStates.digVillager(false);
        pageStates.openPage("None");

        // sets up new model
        printJecs($line, "Equipped tool", equippedTool, "with registered tools", registeredTools);
        if (equippedTool && registeredTools.has(equippedTool)) {
            const { ToolType, ItemName } = registeredTools.get(equippedTool)!;
            printJecs($line, "Equipped tool", ItemName, "of type", ToolType);

            // function to make a highlight
            function makeHighlight(parent: Instance) {
                // sets up highlight
                highlight = trash.Add(new Instance("Highlight"));
                highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
                highlight.Name = "Highlight";
                highlight.Adornee = parent;
                highlight.FillColor = new Color3(0, 1, 0.22);
                highlight.OutlineColor = new Color3(0, 0.5, 0);
                highlight.FillTransparency = .5
                highlight.OutlineTransparency = 0;
                highlight.Parent = parent;
            }

            // if the tool is a villager then
            if (ToolType === "Villager") {
                const hitBox = new Instance("Part")

                // sets up fake model
                printJecs($line, "Creating fake model for Villager", ItemName);
                rotatedY = 0;
                fakeModel = trash.Add(paths.Assets.Villagers[ItemName].Clone()) as VillagerModel;
                fakeModel.GetDescendants().forEach((descendant) => { if (descendant.IsA("BasePart")) descendant.CollisionGroup = "NoCollision"; });
                fakeModel.PivotTo(body.rootPart.CFrame);
                fakeModel.Parent = paths.TestPlacementFolder

                // sets up highlight
                makeHighlight(fakeModel)

                // set up part
                hitBox.Transparency = 1;
                hitBox.Anchored = true;
                hitBox.CanCollide = false
                hitBox.Size = fakeModel.GetExtentsSize();
                hitBox.CFrame = fakeModel.GetPivot();
                hitBox.Name = "HitBox";
                hitBox.Parent = fakeModel;
            } else if (ToolType === "DigTool") {
                printJecs($line, "Creating highlight for DigTool", ItemName);
                // sets up highlight
                makeHighlight(Workspace.Camera)
            }
        }
    }

    // if r is being held down then increase r by 1
    for (const [input] of useEvent(UserInputService.InputBegan)) {
        if (input.KeyCode === Enum.KeyCode.R && fakeModel) {
            rotatedY = ((rotatedY + 90) >= 360) ? 0 : rotatedY + 90;
        }
    }

    // if fake model exists and a valid platform/tool are present
    if (useThrottle(.01) && fakeModel && highlight && platform && platformFloor && equippedTool && registeredTools.has(equippedTool)) {
        const fullModelSize = fakeModel.GetExtentsSize();
        const modelHalfExtents = fullModelSize.mul(0.5);
        const platformDirection = platformFloor.CFrame.LookVector;
        const { ToolType } = registeredTools.get(equippedTool)!;
        const offsetDirection = platformFloor.CFrame.RightVector.mul(pageStates.placementOffset() * -1)

        if (ToolType === "Villager") {
            const hitResults = Tracer
                .ray(camera.CFrame.Position.add(offsetDirection), !UserInputService.KeyboardEnabled ? camera.CFrame.LookVector : mouse.Hit.LookVector, 1000)
                .useRaycastParams(rayParamsInclude([platformFloor]))
                .run();

            // open the placement page
            if (!UserInputService.KeyboardEnabled && pageStates.openPage() !== "Placement") pageStates.openPage("Placement");

            // if the hit results are valid and the hit normal is upwards then
            if (hitResults.hit && hitResults.normal === Vector3.yAxis) {
                // convert world hit pos into platform-local space
                const localHitPos = platformFloor.CFrame.PointToObjectSpace(hitResults.position);
                const worldPos = platformFloor.CFrame.PointToWorldSpace(localHitPos)
                const goalPos = new Vector3(worldPos.X, math.max(worldPos.Y, platformFloor.Position.Y), worldPos.Z);
                const finalCFrame = clampCFrameToBounds(CFrame.lookAlong(
                    goalPos.add(Vector3.yAxis.mul(modelHalfExtents.Y - .25)),
                    platformDirection,
                    Vector3.yAxis
                ).mul(CFrame.Angles(0, math.rad(rotatedY), 0)), fullModelSize, platformFloor.CFrame, platformFloor.Size.add(Vector3.yAxis.mul(1000)));
                const realCFrame = getSnappedGridCFrame(platformFloor.CFrame, finalCFrame, 1 + math.max(modelHalfExtents.X - math.floor(fullModelSize.X), modelHalfExtents.Z - math.floor(fullModelSize.Z)));

                // move the model
                fakeModel.PivotTo(fakeModel.GetPivot().Lerp(realCFrame, .2));
                goalCFrame = realCFrame
                highlightTween(isVillagersOverlapping(platform.Villagers.GetChildren(), fakeModel) ? false : true);
            } else {
                highlightTween(isVillagersOverlapping(platform.Villagers.GetChildren(), fakeModel) ? false : true);
            }
        }
    } else if (equippedTool?.GetAttribute("ItemType") === "DigTool" && platform && villagers && highlight) {
        const villagerPartResults = Tracer.ray(camera.CFrame.Position, mouse.Hit.Position).useRaycastParams(rayParamsInclude([platform.Villagers])).run()
        const villagerPartHovered = villagers && villagerPartResults?.hit?.IsDescendantOf(villagers) && villagerPartResults.hit
        const villagerModel = villagerPartHovered && villagers?.GetChildren().find((child) => villagerPartHovered.IsDescendantOf(child));
        const villagerEntity = villagerModel && getEntity.fromInstance(villagerModel);
        const villagerServerEntity = villagerEntity && world.get(villagerEntity, ReplicatedComponent);

        // open the placement page
        if (!UserInputService.KeyboardEnabled && pageStates.openPage() !== "Dig") pageStates.openPage("Dig");

        // if villager model then
        if (villagerModel && villagerServerEntity) {
            villagerServerEntityToDig = villagerServerEntity;
            highlight.Adornee = villagerModel;
            highlightTween(false);
        } else {
            villagerServerEntityToDig = UserInputService.KeyboardEnabled ? undefined : villagerServerEntityToDig;
            highlightTween(undefined);
        }
    }
}