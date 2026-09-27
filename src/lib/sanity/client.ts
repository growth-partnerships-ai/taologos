import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/** Live site + /edit reads — skip Sanity CDN so CMS saves show up immediately. */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

/** Write client — only when SANITY_API_WRITE_TOKEN is set (seed scripts / drafts). */
export function getWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });
}
