interface Pebble {
	widget: typeof import("./components/display/widget"),
	background: typeof import("./components/display/background"),
	pane: typeof import("./components/display/pane"),
	snapping: typeof import("./components/display/snapping"),
	typography: typeof import("./components/display/typography"),
	tablesheet: typeof import("./components/display/tablesheet"),
	accordion: typeof import("./components/display/accordion"),
	divider: typeof import("./components/display/divider"),
	checkbox: typeof import("./components/display/checkbox"),

	bargraph: typeof import("./components/graph/bargraph"),
	graph: typeof import("./components/graph/graph"),
	linegraph: typeof import("./components/graph/linegraph"),

	button: typeof import("./components/interactable/button"),
	textfield: typeof import("./components/interactable/textfield"),
	select: typeof import("./components/interactable/select"),

	pages: typeof import("./components/display/pages"),

	theme: typeof import("./util/theme"),
	anim: typeof import("./util/anim"),
	
	container: typeof import("./components/util/container"),
	rounded_frame: typeof import("./components/util/rounded_frame"),
	list: typeof import("./components/util/list"),
	row: typeof import("./components/util/row"),
	shadow: typeof import("./components/util/shadow"),
	
	padding: typeof import("./components/util/padding"),

	virtualscroller: typeof import("./components/util/virtualscroller"),
	gap: typeof import("./components/util/gap"),

	oklch: typeof import("./util/oklch")
}

declare const pebble: Pebble
export = pebble
