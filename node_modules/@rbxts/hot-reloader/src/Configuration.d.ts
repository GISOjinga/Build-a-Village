export declare interface ConfigurationProps {
	readonly clonedModuleTagName: string;
}

export declare class Configuration {
	constructor(props?: ConfigurationProps);

	static is: (value: unknown) => value is Configuration;

	readonly props: ConfigurationProps;
}
