import Vide from "@rbxts/vide"

interface App<T> {
    mount: (props: T, destroy: () => void) => Vide.Node
}

interface BaseAppProps {
    host: Player | "server",
	vm: number,
	id: number
}

interface Entity extends BaseAppProps {
	entity: number,
}

interface JabbyClient {
    apps: {
		home: App<undefined>,
		entity: App<Entity>,
		scheduler: App<BaseAppProps>,
		registry: App<BaseAppProps>,
	},

	spawn_app: <T>(app: App<T>) => () => void,
	unmount_all: () => void    
}

declare const client: JabbyClient
export = client
