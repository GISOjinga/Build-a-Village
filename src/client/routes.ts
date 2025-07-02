import { routes as sharedRoutes } from "shared/data/network";
import type { Network } from "shared/data/network";

/**
 * Typed client-side view of all available network routes.
 * Only exposes messaging methods usable from client scripts.
 */
export type ClientRoute<T extends Network<any>> = Pick<T, "send" | "listen" | "wait">;

export const routes = sharedRoutes as unknown as { [K in keyof typeof sharedRoutes]: ClientRoute<typeof sharedRoutes[K]> };

export default routes;
