import { sharedRoutes } from "shared/data/network";
import type { Network, ServerRoute } from "shared/data/network";

/**
 * Typed server-side view of all network routes.
 * Only exposes methods for sending data to clients and listening for messages.
 */


export const routes = sharedRoutes as unknown as { [K in keyof typeof sharedRoutes]: ServerRoute<typeof sharedRoutes[K]> };

export default routes;
