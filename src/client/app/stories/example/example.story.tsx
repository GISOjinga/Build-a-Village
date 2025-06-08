import React, { StrictMode } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { producer } from "shared/utils/producers";
import { Players } from "@rbxts/services";
import Object from "@rbxts/object-utils";


// variables
const player = Players.LocalPlayer



// return the controller
export = (frame: Frame) => {
    const root = createRoot(new Instance("Folder"));


    // changes the ui to the loading screen
    // producer.togglePages("CustomaztionMenu");


    // starts the ui by opening setting the screen gui and opening the home page
    // root.render(
    //     <StrictMode>
    //         <ReflexProvider producer={producer}>
    //             {createPortal(
    //                 <CustomaztionMenu />,
    //                 frame
    //             )}
    //         </ReflexProvider>
    //     </StrictMode>
    // );


    //We need to return another function to unmount the handle
    return () => {
        root.unmount();
    };
}