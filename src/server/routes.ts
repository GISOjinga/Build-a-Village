import { routes as sharedRoutes } from "shared/data/network";
import type { Network } from "shared/data/network";

/**
 * Typed server-side view of all network routes.
 * Only exposes methods for sending data to clients and listening for messages.
 */
export type ServerRoute<T extends Network<any>> = Pick<T, "listen" | "sendTo" | "sendToAll" | "sendToAllExcept" | "sendToList" | "wait">;

export const routes = sharedRoutes as unknown as { [K in keyof typeof sharedRoutes]: ServerRoute<typeof sharedRoutes[K]> };

export default routes;
