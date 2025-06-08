import React, { ReactElement, useEffect, useMemo, useState } from "@rbxts/react";
import DefaultUIProperties from "./css/defaults/ui";
import HudPage from "./pages/hudPage";




// the game ui
export default () => {

	// holds all the pages
	return (
		<frame key="GameUI" {...DefaultUIProperties}>
			{/* <ShopPage /> */}
			<HudPage />
		</frame>
	);
};


