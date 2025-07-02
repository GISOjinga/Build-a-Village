import { sharedRoutes } from "shared/data/network";
import type { ClientRoute, Network } from "shared/data/network";

/**
 * Typed client-side view of all available network routes.
 * Only exposes messaging methods usable from client scripts.
 */
export const routes = sharedRoutes as unknown as { [K in keyof typeof sharedRoutes]: ClientRoute<typeof sharedRoutes[K]> };

export default routes;
