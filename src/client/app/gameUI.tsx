import React, { ReactElement, useEffect, useMemo, useState } from "@rbxts/react";
import DefaultUIProperties from "./css/defaults/ui";




// the game ui
export default () => {

	// holds all the pages
	return (
		<frame key="GameUI" {...DefaultUIProperties}>
			{/* <ShopPage /> */}
		</frame>
	);
};


