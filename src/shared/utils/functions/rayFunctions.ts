import { Workspace } from "@rbxts/services"

// variables
const map = Workspace.FindFirstChild("Map")
const characters = Workspace.FindFirstChild("Characters")
const players = characters?.FindFirstChild("Players")

// includes instances
export function rayParamsInclude(included: Instance[]) {
    const rayParams = new RaycastParams()
    rayParams.FilterType = Enum.RaycastFilterType.Include
    rayParams.FilterDescendantsInstances = included

    // returns rayParams with included instances
    return rayParams
}


// returns you the distance from ray and wether the point is within that radius
export function rayDistance(unitRay: Ray, point: Vector3): { distanceFromRay: number, distanceFromOrigin: number } {
    const distanceFromRay = unitRay.Distance(point)
    const distanceFromOrigin = unitRay.Origin.sub(point).Magnitude

    // if radius is provided then
    return { distanceFromRay, distanceFromOrigin }
}

export const Raycast = {
    Include: {
        Map: rayParamsInclude(map ? [map] : []),
        Players: rayParamsInclude(players ? [players] : []),
    }
}

export const Ray = {
    Include: {
        Map: rayParamsInclude(map ? [map] : []),
        Players: rayParamsInclude(players ? [players] : []),
    }
}