--!strict
--!native
--!optimize 2

export type Context = {
	originalModule: ModuleScript,
	isReloading: boolean,
}

export type CleanupFunction = () -> ()

return nil
