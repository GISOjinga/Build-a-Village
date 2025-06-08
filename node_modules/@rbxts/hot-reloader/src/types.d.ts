export declare interface Context {
	readonly originalModule: ModuleScript;
	readonly isReloading: boolean;
}

export declare type CleanupFunction = () => void;
