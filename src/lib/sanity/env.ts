export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "k8clerei";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

export function hasSanityConfig() {
  return Boolean(projectId);
}
