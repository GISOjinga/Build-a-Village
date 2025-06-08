import { useEventListener } from "@rbxts/pretty-react-hooks";
import { createMotion, Motion, MotionGoal, PartialMotionGoal, spring } from "@rbxts/ripple";
import { Binding, useBinding, useMemo, useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";


export function useMotion2(initialValue: number): LuaTuple<[Binding<number>, Motion]>;

export function useMotion2<T extends MotionGoal>(initialValue: T): LuaTuple<[Binding<T>, Motion<T>]>;

export function useMotion2<T extends MotionGoal>(initialValue: T, start?: boolean) {
    const [startUpTween, setStartUpTween] = useState(true);
    const [binding, setValue] = useBinding(initialValue);
    const motion = useMemo(() => {
        const original = createMotion(initialValue, { start: start })

        // replaces the calls to notify it has started up
        for (const [key, value] of pairs(original)) {
            const old = original[key] as (self: any, goal: T, options?: any) => Motion<T>;
            if (typeOf(value) === "function" && (key === "spring" || key === "linear" || key === "tween")) {
                (original as any)[key] = (_original: any, goal: T, options?: any) => {
                    if (original.isComplete() && original.get() === goal) return
                    setStartUpTween(true);
                    //print("Starting Up Tween", key, original.isComplete(), original.get() === goal)
                    return old(_original, goal, options);
                }
            }
        }
        return original;
    }, []);


    // runs the tween
    useEventListener(RunService.Heartbeat, (delta) => {
        //print("Running Still", motion.isComplete())
        if (motion.isComplete()) {
            setStartUpTween(false);
        } else {
            const value = motion.step(delta)
            setValue(value)
        }
    }, { connected: startUpTween });


    // destroys it
    useEffect(() => {
        const trash = new Janitor();

        // adds on destroy
        trash.Add(motion, "destroy");

        // cleans up
        return () => {
            trash.Destroy();
            setStartUpTween(false);
        }
    }, []);

    return $tuple(binding, motion);
}