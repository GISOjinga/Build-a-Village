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


function serializeValue(value: unknown): unknown {
    if (typeIs(value, "Vector3")) {
        return { __type: "Vector3", x: value.X, y: value.Y, z: value.Z };
    } else if (typeIs(value, "CFrame")) {
        return { __type: "CFrame", components: value.GetComponents() };
    } else if (typeIs(value, "Color3")) {
        return { __type: "Color3", r: value.R, g: value.G, b: value.B };
    } else if (typeIs(value, "EnumItem")) {
        return { __type: "EnumItem", value: tostring(value) };
    } else {
        return value;
    }
}

function deserializeValue(value: unknown): unknown {
    if (typeIs(value, "table") && value !== undefined) {
        const t = value as { __type: string } & { [key in any]: never }
        if (t.__type === "Vector3") {
            return new Vector3(t.x, t.y, t.z);
        } else if (t.__type === "CFrame") {
            const components = (t as unknown as { components: number[] }).components
            return new CFrame(...components as [number, number, number, number, number, number, number, number, number, number, number, number]);
        } else if (t.__type === "Color3") {
            return new Color3(t.r, t.g, t.b);
        } else if (t.__type === "EnumItem") {
            const parts = (t as unknown as { value: string }).value.split(".");
            return (Enum as never)[parts[1]][parts[2]];
        }
    }
    return value;
}

export function instanceToAttributeTree(instance: Instance): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const attributes: Record<string, unknown> = {};

    for (const [key, value] of pairs(instance.GetAttributes())) {
        attributes[key] = serializeValue(value);
    }

    for (const child of instance.GetChildren()) {
        const childTree = instanceToAttributeTree(child);
        for (const [childName, childData] of pairs(childTree)) {
            attributes[childName] = childData;
        }
    }
    result[instance.Name] = attributes;
    return result;
}
