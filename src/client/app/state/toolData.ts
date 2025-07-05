import Signal from "@rbxts/signal";

export const inventoryTools: Tool[] = [];
export const hotbarTools: Tool[] = [];

export const inventoryChanged = new Signal<() => void>();
export const hotbarChanged = new Signal<() => void>();

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
    const [item] = inventoryTools.splice(from, 1);
    inventoryTools.splice(to, 0, item);
    inventoryChanged.Fire();
}

export function swapHotbar(from: number, to: number) {
    if (from === to) return;
    const [item] = hotbarTools.splice(from, 1);
    hotbarTools.splice(to, 0, item);
    hotbarChanged.Fire();
}

export function moveInvToHotbar(invIndex: number, hotIndex: number) {
    const [item] = inventoryTools.splice(invIndex, 1);
    hotbarTools.splice(hotIndex, 0, item);
    inventoryChanged.Fire();
    hotbarChanged.Fire();
}

export function moveHotbarToInv(hotIndex: number, invIndex: number) {
    const [item] = hotbarTools.splice(hotIndex, 1);
    inventoryTools.splice(invIndex, 0, item);
    inventoryChanged.Fire();
    hotbarChanged.Fire();
}
