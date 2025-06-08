import { Transition } from "@rbxts/react-motion";





// the transition
export const transition: Transition = {
    duration: .5,
    easingStyle: Enum.EasingStyle.Cubic,
    easingDirection: Enum.EasingDirection.InOut,
};


export const pageVariants = {
    // for main frame
    Frame: {
        Open: {
            Position: UDim2.fromScale(.5, .5),
            transition: transition
        },

        Close: {
            Position: UDim2.fromScale(.5, 2),
            transition: transition
        }
    },

    // for text those with text
    Text: {
        Open: {
            TextTransparency: 0,
            TextStrokeTransparency: 0,
            transition: transition
        },

        Close: {
            TextTransparency: 1,
            TextStrokeTransparency: 1,
            transition: transition
        }
    },

    // for images
    Image: {
        Open: {
            ImageTransparency: 0,
            transition: transition
        },

        Close: {
            ImageTransparency: 1,
            transition: transition
        }
    },

    // for ui stroke
    UiStroke: {
        Open: {
            Transparency: 0,
            transition: transition
        },

        Close: {
            Transparency: 1,
            transition: transition
        }
    }
}