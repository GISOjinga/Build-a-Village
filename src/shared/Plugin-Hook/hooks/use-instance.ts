import { useHookState } from "../topo";
import { useChange } from "./use-change";
import { useMemo } from "./use-memo";

interface Storage {
    instance?: Instance;
}

export function useInstance<T extends Instance>(creator: () => T, dependencies: unknown[], discriminator?: unknown): T {
    const storage = useHookState<Storage>(discriminator, (state) => {
        if (state.instance) {
            state.instance.Destroy();
        }
        return false;
    });
    if (storage.instance === undefined || useChange(dependencies, discriminator)) {
        storage.instance = creator();
    }
    return storage.instance as T;
}