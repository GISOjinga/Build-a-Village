import { RunService, TweenService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { Janitor } from "@rbxts/janitor";

/**
 * Creates a simple tween utility that emits step updates.
 *
 * @returns Tween controller
 */
export function createTween<T>() {
    const trash = new Janitor();
    let runningThread: RBXScriptConnection | undefined;
    const changedSignal = trash.Add(new Signal<(value: T) => unknown>());
    const stoppedSignal = trash.Add(new Signal());

    function stop() {
        if (runningThread) {
            runningThread.Disconnect();
            runningThread = undefined;
            stoppedSignal.Fire();
        }
    }

    function destroy() {
        stop();
        trash.Destroy();
    }

    function play(from: T, to: T, info: TweenInfo) {
        const allowed = ["CFrame", "number", "Vector3", "Vector2"] as const;
        const typeOfTween = typeOf(from);

        stop();

        if (typeOf(from) !== typeOf(to)) {
            warn(`To and from must be the same type! (to: ${typeOf(to)}, from: ${typeOf(from)})`);
            return controller;
        } else if (!allowed.includes(typeOfTween as never)) {
            warn(`To and from must be a ${allowed.join(", ")}! (to: ${typeOf(to)}, from: ${typeOf(from)})`);
            return controller;
        }

        let elapsed = 0;
        runningThread = RunService.Heartbeat.Connect((delta) => {
            const alpha = math.clamp(elapsed / info.Time, 0, 1);
            const easedAlpha = TweenService.GetValue(alpha, info.EasingStyle, info.EasingDirection);

            let current: T;
            if (typeOfTween === "number") {
                current = (from as unknown as number) + ((to as unknown as number) - (from as unknown as number)) * easedAlpha as unknown as T;
            } else {
                current = (from as unknown as Vector3).Lerp(to as Vector3, easedAlpha) as never;
            }

            changedSignal.Fire(current);
            elapsed += delta;

            if (alpha >= 1) {
                task.spawn(() => {
                    task.wait();
                    stop();
                });
            }
        });

        return controller;
    }

    function connectChanged(cb: (val: T) => void) {
        return changedSignal.Connect(cb);
    }

    function connectStopped(cb: () => void) {
        return stoppedSignal.Connect(cb);
    }

    const controller = {
        Play: play,
        Stop: stop,
        Destroy: destroy,
        ConnectChanged: connectChanged,
        ConnectStopped: connectStopped,

        // compatibility aliases
        tween: play,
        onStep: connectChanged,
        onComplete: connectStopped,
        destroy,
    } as const;

    return controller;
}

export type TweenController<T> = ReturnType<typeof createTween<T>>