// gets a path of unique id from instance
export function getUniqueIdPathFromInstance(instance: Instance, uniqueIdPath: string[] = []): string[] {
    // If the instance is the game, return the path
    if (instance === game) {
        return uniqueIdPath;
    }

    // Get the unique ID of the current instance
    const uniqueId = instance.GetAttribute<string>("__UniqueInstanceId");

    // If the unique ID is defined, add it to the path
    if (uniqueId !== undefined) uniqueIdPath.unshift(uniqueId);

    // Recursively get the unique ID path for the parent instance
    return getUniqueIdPathFromInstance(instance.Parent as Instance, uniqueIdPath);
}

// gets instance by unique id path
export function getInstanceByUniqueIdPath(uniqueIdPath: string[]): Instance | undefined {
    // Start from the 'game' root
    let currentInstance: Instance | undefined = game;

    // Iterate over each unique ID in the path
    for (const uniqueId of uniqueIdPath) {
        // Check if the current instance is valid
        if (currentInstance) {
            // Attempt to find the child with the given unique ID
            currentInstance = currentInstance.GetChildren().find(child => child.GetAttribute<string>("__UniqueInstanceId") === uniqueId);

            // If the child exists, update the current instance to this child
            if (!currentInstance) return undefined; // If any part of the path is not found, return undefined
        }
    }

    // Return the found instance
    return currentInstance;
}

// get instance by full name
export function getInstanceByName(fullName: string): Instance | undefined {
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
            } else {
                return undefined; // If any part of the path is not found, return undefined
            }
        }
    }

    // Return the found instance
    return currentInstance;
}