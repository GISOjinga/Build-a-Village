


export const MapUi = <T extends object, C extends defined>(
    obj: T,
    callback: (key: keyof T, value: T[keyof T]) => C,
) => {
    const newObject = {} as Record<keyof T, C>;

    for (const [key, value] of pairs(obj)) {
        newObject[key as keyof T] = callback(key as keyof T, value as T[keyof T]);
    }

    return newObject;
};