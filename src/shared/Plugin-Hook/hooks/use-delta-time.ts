import { useCurrentFrame } from "../topo";

export function useDeltaTime(): number {
    const frameState = useCurrentFrame();
    return frameState.deltaTime;
}