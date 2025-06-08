import Ripple from "@rbxts/ripple";

// functionality type
type functionality = {
    MouseEnter?: () => void,
    MouseLeave?: () => void,
    Activated?: () => void,
    MouseButton1Click?: () => void,
}
// const button elasticity
export function rotatingButton(functionality:functionality, motion: Ripple.Motion<number>, rotation: number, goal:number, tween?: Ripple.TweenOptions) {
    const realTween:Ripple.TweenOptions = {...{time:1, style:Enum.EasingStyle.Cubic, direction: Enum.EasingDirection.InOut, reverses:true, repeatCount:-1}, ...tween}
    let closed:boolean = false

    
    
    // returns the functionality
    return {...functionality, ...{
        MouseEnter: () => {
            // plays looping tween
            const cleanUp = motion.onComplete(()=> {if (closed) {motion.tween(goal, realTween)} cleanUp()})
            
            // sets the closed state to false
            closed = true;
            motion.tween(-goal, {time:realTween.time, style:Enum.EasingStyle.Cubic});

            // calls the functionality
            functionality.MouseEnter?.()
        },

        
        MouseLeave: () => {closed = false; motion.spring(rotation, Ripple.config.spring.wobbly); functionality.MouseLeave?.()},
    }}
}