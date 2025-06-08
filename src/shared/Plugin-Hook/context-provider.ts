

const data  = new Map<string, Array<unknown[]>>();

export function createContext<T extends unknown[]>(key: string, value: T, fn: () => void) {
    if (!data.has(key)) {
        data.set(key, []);
    }
    data.get(key)?.push(value);
    fn();
    data.get(key)?.pop();
}