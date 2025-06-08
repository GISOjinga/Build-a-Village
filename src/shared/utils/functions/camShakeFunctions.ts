import CameraShaker from "@rbxts/camera-shaker";
import { Workspace } from "@rbxts/services";


const camera = Workspace.Camera;
const cameraShaker = new CameraShaker(Enum.RenderPriority.Camera.Value, (shakeCFrame) => {
    camera.CFrame = camera.CFrame.mul(shakeCFrame);
});

cameraShaker.Start();

export const camshake = {
    // heavy impact
    HeavyImpact: (percentage: number = 1) => {
        cameraShaker.ShakeOnce(5 * percentage, 30 * percentage, 0, 1 * percentage);
    },

    // shake the camera
    Impact: (percentage: number = 1) => {
        cameraShaker.ShakeOnce(3 * percentage, 20 * percentage, 0, 0.25 * percentage);
    },
};

