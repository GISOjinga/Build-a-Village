




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