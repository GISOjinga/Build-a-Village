import { equals } from "@rbxts/phantom/src/Array";
import { useHookState } from "../topo";
import { deepEquals } from "@rbxts/object-utils";


const discriminators: Map<unknown, readonly unknown[]> = new Map();
export function useChange(dependencies: readonly unknown[], discriminator: unknown = debug.traceback(),): boolean {
    const previous = discriminators.get(discriminator);
    discriminators.set(discriminator, dependencies);
    return !previous || !deepEquals(previous, dependencies);
}