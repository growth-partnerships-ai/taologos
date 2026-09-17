import { seedContent } from "./seed";
import type { SiteContent } from "./types";

/**
 * Returns page content. When Sanity env is configured, this can be swapped
 * to fetch live documents; seed content ships so the site works immediately.
 */
export async function getPageContent(): Promise<SiteContent> {
  // Future: if (hasSanityConfig()) return fetchFromSanity()
  return seedContent;
}
