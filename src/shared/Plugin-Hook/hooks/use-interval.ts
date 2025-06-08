import { useHookState } from "../topo";

interface ThrottleStorage {
	expiry: number;
	time?: number;
}

function cleanup(storage: ThrottleStorage): boolean {
	return os.clock() >= storage.expiry;
}

/**
 * Utility for easy time based intervalues.
 *
 * Accepts a duration and returns `true` if it has been that long since the last
 * time this function returned `true`. Returns `false` the first time it is called.
 *
 * @param seconds - The number of seconds to throttle for.
 * @param discriminator - An optional value to additionally key by.
 * @param key - An automatically generated key to store the throttle state.
 * @returns - Returns true every x seconds, otherwise false.
 * @metadata macro
 */
export function useInterval(
	seconds: number,
	discriminator?: unknown,
): boolean {
	const storage = useHookState<ThrottleStorage>(discriminator, cleanup);

	const currentTime = os.clock();
	if (storage.time === undefined) {
		storage.time = currentTime;
		storage.expiry = currentTime + seconds;
		return false
	}
	if (currentTime - storage.time >= seconds) {
		storage.time = currentTime;
		storage.expiry = currentTime + seconds;
		return true;
	}

	return false;
}