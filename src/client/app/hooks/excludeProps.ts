import Object from "@rbxts/object-utils";


export function excludeProps(props: object, names: string[]) {
    return Object.fromEntries(Object.entries(props).filter(([key]) => !names.includes(key as string)) as [string, unknown][]);
}