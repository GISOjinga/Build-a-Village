

export function useContext<T extends unknown[]>(key: string): T | undefined {
    const data = new Map<string, Array<unknown[]>>();
    if (!data.has(key)) {
        return undefined;
    }
    return data.get(key)?.[data.get(key)!.size() - 1] as T;
}