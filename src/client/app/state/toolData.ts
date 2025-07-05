import Signal from "@rbxts/signal";

export const inventoryTools: Tool[] = [];
export const hotbarTools: Tool[] = [];

export const inventoryChanged = new Signal<() => void>();
export const hotbarChanged = new Signal<() => void>();

function splice<T>(arr: T[], start: number, deleteCount: number, ...items: T[]): T[] {
    const removed: T[] = [];
    for (let i = 0; i < deleteCount; i++) removed.push(arr[start + i]);
    for (let i = 0; i < deleteCount; i++) arr.remove(start);
    for (let i = items.size() - 1; i >= 0; i--) arr.insert(start, items[i]);
    return removed;
}

export function initialize(backpack: Backpack) {
    inventoryTools.clear();
    for (const child of backpack.GetChildren()) if (child.IsA("Tool")) inventoryTools.push(child);
    hotbarTools.clear();
    for (let i = 0; i < math.min(5, inventoryTools.size()); i++) hotbarTools.push(inventoryTools[i]);
    inventoryChanged.Fire();
    hotbarChanged.Fire();
}

export function setHotbarSize(size: number) {
    while (hotbarTools.size() > size) hotbarTools.pop();
    hotbarChanged.Fire();
}

export function swapInventory(from: number, to: number) {
    if (from === to) return;
    const [item] = splice(inventoryTools, from, 1);
    splice(inventoryTools, to, 0, item);
    inventoryChanged.Fire();
}

export function swapHotbar(from: number, to: number) {
    if (from === to) return;
    const [item] = splice(hotbarTools, from, 1);
    splice(hotbarTools, to, 0, item);
    hotbarChanged.Fire();
}

export function moveInvToHotbar(invIndex: number, hotIndex: number) {
    const [item] = splice(inventoryTools, invIndex, 1);
    splice(hotbarTools, hotIndex, 0, item);
    inventoryChanged.Fire();
    hotbarChanged.Fire();
}

export function moveHotbarToInv(hotIndex: number, invIndex: number) {
    const [item] = splice(hotbarTools, hotIndex, 1);
    splice(inventoryTools, invIndex, 0, item);
    inventoryChanged.Fire();
    hotbarChanged.Fire();
}

