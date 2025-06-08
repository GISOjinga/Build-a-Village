import { routes } from "shared/data/network";
import { useHookState } from "../topo";
import { useChange } from "./use-change";
import { useEffect } from "./use-effect";
import { defineCleanupCallback } from "@rbxts/hot-reloader";
import { Changed, Trash, world } from "shared/utils/jecs/jecsComponents";
import { Janitor } from "@rbxts/janitor";
import { RunService } from "@rbxts/services";
import { routesData } from "shared/systems/hooks/watchRoutes";


// get instance by full name
function getInstanceByName(fullName: string): Instance | undefined {
    // Split the full name by '.' to get each part of the path
    const pathParts = fullName.split('.');

    // Start from the 'game' root
    let currentInstance: Instance | undefined = game;

    // Iterate over each part of the path
    for (const partName of pathParts) {
        // Check if the current instance is valid
        if (currentInstance) {
            // Attempt to find the child with the given name
            const child = currentInstance.FindFirstChild(partName) as Instance;

            // If the child exists, update the current instance to this child
            if (child) {
                currentInstance = child;
            }
        }
    }

    // Return the found instance
    return currentInstance;
}

export function useRoute<T extends typeof routes[keyof typeof routes]>(
    route: T,
    callback: FirstParam<T["listen"]>,
) {
    // if system mod descendant of players
    routesData.get(route as never)?.forEach(([data, player]) => callback(data as never, player as Player))
}
