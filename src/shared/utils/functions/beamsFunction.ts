import { copy } from "@rbxts/object-utils";


// loops through beams toggling their ennabledd
export function beamsToggle(instance: Instance, toggle: boolean) {
    instance.GetDescendants().forEach((descendant) => { if (descendant.IsA("Beam")) descendant.Enabled = toggle; })
}


// function to get you the keypoints mapped
function getKeyPointsMapped(beams: Beam[], property: "Transparency") {
    const originalKeyPoints = new Map<Beam, NumberSequenceKeypoint[]>();

    // loops through all the beams and maps the original key points
    beams.forEach((beam) => {
        // sets the beam
        originalKeyPoints.set(beam, [])

        // loops through each keypoint to be added
        beam[property].Keypoints.forEach((keypoint) => {
            originalKeyPoints.get(beam)?.push(keypoint)
        })
    })

    return originalKeyPoints
}

// update beams Keypoints
function updateBeamsKeypoints(percentile: number, property: "Transparency", originalKeyPoints: Map<Beam, NumberSequenceKeypoint[]>) {
    originalKeyPoints.forEach((keypoints, beam) => {
        const newKeyPoints: NumberSequenceKeypoint[] = []

        // loops through each keypoint to be added
        keypoints.forEach((keypoint, index) => { // sets the keypoint
            newKeyPoints[index] = new NumberSequenceKeypoint(
                keypoint.Time,
                (keypoint.Value + ((1 - keypoint.Value) * (1 - percentile))),
                keypoint.Envelope
            )
        })

        // sets the keypoints
        beam[property] = new NumberSequence(newKeyPoints)
    })
}

// beams tween to 0
// export function beamsTweenToZero(properties: ("Transparency")[], beams: Beam[], time: number) {
//     const originalTransparencyKeyPoints = properties.includes("Transparency") && getKeyPointsMapped(beams, "Transparency")
//     const fakeTween = createMotion(1, { start: true })


//     // for each step lerps each keypoint to 0
//     fakeTween.onStep((percentile) => {
//         // loops through all the beams and maps the original key points
//         if (originalTransparencyKeyPoints) updateBeamsKeypoints(percentile, "Transparency", originalTransparencyKeyPoints)
//     })

//     // when completed destroys itself
//     fakeTween.onComplete(() => fakeTween.destroy())

//     // plays the tween
//     fakeTween.tween(0, { time: time })
// }