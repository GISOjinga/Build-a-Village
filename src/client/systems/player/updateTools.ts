import { Janitor } from "@rbxts/janitor";
import { World } from "@rbxts/jecs";
import { deepEquals } from "@rbxts/object-utils";
import { Players, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { Tracer } from "@rbxts/tracer";
import { $line } from "rbxts-transformer-inline";
import { routes } from "shared/data/network";
import { useChange, useEffect, useEvent, useMemo, useState, useThrottle } from "shared/Plugin-Hook";
import { getEntity, printJecs, printTS } from "shared/utils/functions/jecsHelpFunctions";
import { Raycast, rayParamsInclude } from "shared/utils/functions/rayFunctions";
import { isVillagersOverlapping } from "shared/utils/functions/villagerFunctions";
import { Body, Changed, Data, Player, TargetEntity } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";



// variables
const player = Players.LocalPlayer
const camera = Workspace.Camera
const mouse = player.GetMouse()
const registeredTools = new Map<Tool, ToolInfo>()
const trash = new Janitor();
let highlight: Highlight | undefined;
let fakeModel: VillagerModel | undefined;
let rotatedY = 0

// sets up trash
trash.LinkToInstances(script)

// function to tween highligh color
const highlightTween = (passed: boolean) => {
    if (highlight) {
        trash.Add(TweenService.Create(highlight, new TweenInfo(.3, Enum.EasingStyle.Cubic), {
            FillColor: passed ? new Color3(0, 1, 0.22) : new Color3(1, 0, 0),
            OutlineColor: passed ? new Color3(0, 0.5, 0) : new Color3(0.5, 0, 0),
        })).Play();
    }
}



export default (world: World) => {
    const body = getEntity.bodyFromPlayer(player);
    const platform = body && body.platform;
    const platformFloor = platform?.FindFirstChild("Floor") as BasePart | undefined;
    const backpack = player.FindFirstChild("Backpack");
    const equippedTool = body && body.model.FindFirstChildOfClass("Tool");

    // when a tool is added to backpack that isnt registered then backpack
    if (backpack) {
        const loadTool = (tool: Tool) => {
            printJecs($line, "Loading tool", tool, registeredTools);
            if (tool.IsA("Tool") && !registeredTools.has(tool)) {
                const toolType = tool.GetAttribute<"Villager">("ItemType")!;
                const itemName = tool.GetAttribute<ItemName>("ItemName")!;

                // when the tool is added to the world
                registeredTools.set(tool, { ItemName: itemName, ToolType: toolType as never });
                printJecs($line, "Registered tool", tool, itemName, toolType, registeredTools);

                // when destroying
                tool.Destroying.Connect(() => registeredTools.delete(tool));

                // when the tool is activated
                trash.Add(tool.Activated.Connect(() => {
                    printJecs($line, "Activated", registeredTools)
                    if (fakeModel) {
                        routes.placeVillager.send(fakeModel.GetPivot())
                    };
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
        printJecs($line, registeredTools);

        // destroys old model
        fakeModel?.Destroy();

        // sets up new model
        if (equippedTool && registeredTools.has(equippedTool)) {
            const { ToolType, ItemName } = registeredTools.get(equippedTool)!;
            printJecs($line, "Equipped tool", ItemName, "of type", ToolType);

            // if the tool is a villager then
            if (ToolType === "Villager") {

                // sets up fake model
                printJecs($line, "Creating fake model for Villager", ItemName);
                rotatedY = 0;
                fakeModel = trash.Add(paths.Assets.Villagers[ItemName].Clone()) as VillagerModel;
                fakeModel.GetDescendants().forEach((descendant) => { if (descendant.IsA("BasePart")) descendant.CollisionGroup = "NoCollision"; });
                fakeModel.Parent = paths.TestPlacementFolder

                // sets up highlight
                highlight = trash.Add(new Instance("Highlight"));
                highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
                highlight.Name = "Highlight";
                highlight.Adornee = fakeModel;
                highlight.FillColor = new Color3(0, 1, 0.22);
                highlight.OutlineColor = new Color3(0, 0.5, 0);
                highlight.FillTransparency = .5
                highlight.OutlineTransparency = 0;
                highlight.Parent = fakeModel;
            }
        }
    }

    // if r is being held down then increase r by 1
    for (const [input] of useEvent(UserInputService.InputBegan)) {
        if (input.KeyCode === Enum.KeyCode.R && fakeModel) {
            rotatedY = ((rotatedY + 1) > 360) ? 0 : rotatedY + 90;
        }
    }

    // if fake model exists and a valid platform/tool are present
    if (useThrottle(.01) && fakeModel && highlight && platform && platformFloor && equippedTool && registeredTools.has(equippedTool)) {
        const modelHalfExtents = fakeModel.GetExtentsSize().mul(0.5);
        const platformHalfExtents = platformFloor.Size.mul(0.5);
        const platformDirection = platformFloor.CFrame.LookVector;
        const { ToolType } = registeredTools.get(equippedTool)!;

        if (ToolType === "Villager") {
            const hitResults = Tracer
                .ray(camera.CFrame.Position, mouse.Hit.LookVector, 1000)
                .useRaycastParams(rayParamsInclude([platformFloor]))
                .run();
            printJecs($line, "Hit results", hitResults);

            if (hitResults.hit && hitResults.normal === Vector3.yAxis) {
                // convert world hit pos into platform-local space
                const localHitPos = platformFloor.CFrame.PointToObjectSpace(hitResults.position);
                const clampedX = math.clamp(
                    localHitPos.X,
                    -platformHalfExtents.X + modelHalfExtents.X,
                    platformHalfExtents.X - modelHalfExtents.X
                );
                const clampedZ = math.clamp(
                    localHitPos.Z,
                    -platformHalfExtents.Z + modelHalfExtents.Z,
                    platformHalfExtents.Z - modelHalfExtents.Z
                );
                const clampedLocalPos = new Vector3(clampedX, localHitPos.Y, clampedZ);
                const worldPos = platformFloor.CFrame.PointToWorldSpace(clampedLocalPos);
                const goalPos = new Vector3(math.floor(worldPos.X), math.max(worldPos.Y, platformFloor.Position.Y), math.floor(worldPos.Z));
                const finalCFrame = CFrame.lookAlong(
                    goalPos.add(Vector3.yAxis.mul(modelHalfExtents.Y - .25)),
                    platformDirection,
                    Vector3.yAxis
                ).mul(CFrame.Angles(0, math.rad(rotatedY), 0));

                // move the model
                fakeModel.PivotTo(finalCFrame);
                highlightTween(isVillagersOverlapping(platform.Villagers.GetChildren(), fakeModel) ? false : true);
            } else {
                highlightTween(false);
            }
        }
    }
}