// UIUtilities.ts
//----------------------------------------------------------------------------------
// Provides common UI utility functions and button effects with robust error handling.
//----------------------------------------------------------------------------------

import { Janitor } from "@rbxts/janitor";
import { ReplicatedStorage, TweenService, UserInputService } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { warnTS } from "../functions/jecsHelpFunctions";

// Namespace to hold all utilities
namespace UIUtilities {
    //----------------------------------------------------------------------------------
    // Determines whether a given InputObject should be treated as an activation (touch or click).
    //----------------------------------------------------------------------------------
    export function IsInputActivated(input: InputObject): boolean {
        return (
            input.UserInputType === Enum.UserInputType.Touch ||
            input.UserInputType === Enum.UserInputType.MouseButton1
        );
    }

    //----------------------------------------------------------------------------------
    // Multiplies two UDim2 values element-wise, returning a new UDim2.
    //----------------------------------------------------------------------------------
    export function MultiplyUdim2(udim2: UDim2, m: UDim2): UDim2 {
        return new UDim2(
            udim2.X.Scale * m.X.Scale,
            udim2.X.Offset * m.X.Offset,
            udim2.Y.Scale * m.Y.Scale,
            udim2.Y.Offset * m.Y.Offset,
        );
    }

    //----------------------------------------------------------------------------------
    // Adds two UDim2 values element-wise, returning a new UDim2.
    //----------------------------------------------------------------------------------
    export function AddUdim2(a: UDim2, b: UDim2): UDim2 {
        return new UDim2(
            a.X.Scale + b.X.Scale,
            a.X.Offset + b.X.Offset,
            a.Y.Scale + b.Y.Scale,
            a.Y.Offset + b.Y.Offset,
        );
    }

    //----------------------------------------------------------------------------------
    // Subtracts the second UDim2 from the first element-wise, returning a new UDim2.
    //----------------------------------------------------------------------------------
    export function SubtractUdim2(a: UDim2, b: UDim2): UDim2 {
        return new UDim2(
            a.X.Scale - b.X.Scale,
            a.X.Offset - b.X.Offset,
            a.Y.Scale - b.Y.Scale,
            a.Y.Offset - b.Y.Offset,
        );
    }

    //----------------------------------------------------------------------------------
    // Divides the first UDim2 by the second element-wise, handling NaN or infinite results.
    //----------------------------------------------------------------------------------
    export function DivideUdim2(a: UDim2, b: UDim2): UDim2 {
        const divide = (num1: number, num2: number): number => {
            const result = num1 / num2;
            return (result === result && result) ? result : 0;
        };

        return new UDim2(
            divide(a.X.Scale, b.X.Scale),
            divide(a.X.Offset, b.X.Offset),
            divide(a.Y.Scale, b.Y.Scale),
            divide(a.Y.Offset, b.Y.Offset),
        );
    }

    //----------------------------------------------------------------------------------
    // Connects button hover, press, and release effects with callbacks.
    //
    // @param buttonEffects  Configuration for sizes, tweens, and container.
    // @param onReleased     Optional callback when input is released.
    // @param onHeld         Optional callback when input is held down.
    // @returns              Controls for toggling hover, enabling/disabling, and destroying.
    //----------------------------------------------------------------------------------
    export function ButtonAction(
        buttonEffects: ButtonEffects,
        onReleased?: () => void,
        onHeld?: () => void
    ): ButtonActionControls {
        const trash = new Janitor();
        const trashTween = new Janitor();
        const button = buttonEffects.Button;
        const container = buttonEffects.Container || buttonEffects.Button;
        const defaultSize = buttonEffects.DefaultSize || container.Size;
        const expandedSize = buttonEffects.ExpandedSize || defaultSize;
        const deExpandedSize = buttonEffects.DeExpandedSize || defaultSize;
        const hoveringTweenInfo = buttonEffects.HoveringTweenInfo ||
            new TweenInfo(0.25, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);
        const elasticTweenInfo = buttonEffects.ElasticTweenInfo ||
            new TweenInfo(1.25, Enum.EasingStyle.Elastic, Enum.EasingDirection.Out);

        const extraControls: ButtonActionControls = {
            _hoverEffect: true,
            _isHovering: false,
            _enabled: true,

            ToggleHover(this: ButtonActionControls, toggle: boolean) {
                this._hoverEffect = toggle;
                return this;
            },
            ToggleEnabled(this: ButtonActionControls, toggle: boolean) {
                this._enabled = toggle;
                return this;
            },
            Destroy(this: ButtonActionControls) {
                trash.Destroy();
            },
        };

        // Mouse enters -> expand
        trash.Add(
            button.MouseEnter.Connect(() => {
                Promise.try(() => {
                    if (extraControls._hoverEffect && extraControls._enabled) {
                        extraControls._isHovering = true;
                        trashTween.Add(TweenService.Create(container, hoveringTweenInfo, { Size: expandedSize })).Play();
                    }
                }).catch(err => warnTS($line, err));
            })
        );

        // Mouse leaves -> revert
        trash.Add(
            button.MouseLeave.Connect(() => {
                Promise.try(() => {
                    if (!extraControls._enabled) return;
                    if (extraControls._hoverEffect || extraControls._isHovering) {
                        extraControls._isHovering = false;
                        trashTween.Add(TweenService.Create(container, hoveringTweenInfo, { Size: defaultSize })).Play();
                    }
                }).catch(err => warnTS($line, err));
            })
        );

        // Input began -> de-expand & onHeld
        trash.Add(
            button.InputBegan.Connect((input) => {
                Promise.try(() => {
                    if (!extraControls._enabled) return;
                    if (IsInputActivated(input)) {
                        container.Size = defaultSize;
                        trashTween.Add(TweenService.Create(container, hoveringTweenInfo, { Size: deExpandedSize })).Play();
                        if (onHeld) onHeld();
                    }
                }).catch(err => warnTS($line, err));
            })
        );

        // Input ended -> expand back & onReleased
        trash.Add(
            button.InputEnded.Connect((input) => {
                Promise.try(() => {
                    if (!extraControls._enabled) return;
                    if (IsInputActivated(input)) {
                        trashTween.Add(TweenService.Create(container, elasticTweenInfo, { Size: defaultSize })).Play();
                        if (onReleased) onReleased();
                    }
                }).catch(err => warnTS($line, err));
            })
        );

        // when trash is getting destroyed it resets the size
        trash.Add(() => {
            trashTween.Destroy();
            container.Size = defaultSize;
        });

        return extraControls;
    }

    //----------------------------------------------------------------------------------
    // Opens or closes a GUI object by tweening its position or instantly moving it.
    //
    // @param guiObject  The GuiObject to move.
    // @param openClose  True to center, false to hide off-screen left.
    // @param noTween    True to move instantly; false to animate.
    // @returns          The Tween if animated, otherwise undefined.
    //----------------------------------------------------------------------------------
    export function OpenClose(
        guiObject: GuiObject,
        openClose: boolean,
        noTween?: boolean
    ): Tween | undefined {
        if (noTween) {
            guiObject.Position = openClose
                ? UDim2.fromScale(0.5, 0.5)
                : UDim2.fromScale(-2, 0.5);
            return undefined;
        } else {
            const tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Cubic, Enum.EasingDirection.Out);
            const tween = TweenService.Create(guiObject, tweenInfo, {
                Position: openClose
                    ? UDim2.fromScale(0.5, 0.5)
                    : UDim2.fromScale(-2, 0.5),
            });
            tween.Play();
            return tween;
        }
    }

    // Types for button effects configuration
    export interface ButtonEffects {
        Button: GuiButton;
        DefaultSize?: UDim2;
        Container?: GuiObject;
        ExpandedSize?: UDim2;
        DeExpandedSize?: UDim2;
        HoveringTweenInfo?: TweenInfo;
        ElasticTweenInfo?: TweenInfo;
    }

    // Controls returned by ButtonAction, including internal flags
    export interface ButtonActionControls {
        _hoverEffect: boolean;
        _isHovering: boolean;
        _enabled: boolean;

        ToggleHover(toggle: boolean): ButtonActionControls;
        ToggleEnabled(toggle: boolean): ButtonActionControls;
        Destroy(): void;
    }
}

// Export the namespace for use in other scripts
export = UIUtilities;
