import { useHookState } from "../topo";
import { useChange } from "./use-change";

interface Storage<T extends unknown> {
    oldValues: T;
}

export function useMemo<T extends unknown>(
    callback: () => T,
    dependencies: readonly unknown[],
    discriminator?: unknown,
): T {
    const storage = useHookState<Storage<T>>(discriminator);
    if (useChange(dependencies, storage)) {
        const newValues = callback();
        storage.oldValues = newValues;
        return newValues;
    }
    return storage.oldValues;
}
