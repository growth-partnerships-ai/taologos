import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "@/lib/sanity/env";
import type { CmsRole } from "@/lib/edit-auth";

export type CmsUserDoc = {
  _id: string;
  email: string;
  role: CmsRole;
  passwordHash?: string;
  mustChangePassword?: boolean;
  active?: boolean;
};

export function getEditWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}

export async function findCmsUserByEmail(email: string) {
  const client = getEditWriteClient();
  if (!client) return null;
  const normalized = email.trim().toLowerCase();
  return client.fetch<CmsUserDoc | null>(
    `*[_type == "cmsUser" && email == $email][0]{
      _id, email, role, passwordHash, mustChangePassword, active
    }`,
    { email: normalized },
  );
}

export async function getCmsUserById(id: string) {
  const client = getEditWriteClient();
  if (!client) return null;
  return client.fetch<CmsUserDoc | null>(
    `*[_type == "cmsUser" && _id == $id][0]{
      _id, email, role, passwordHash, mustChangePassword, active
    }`,
    { id },
  );
}

export function cmsUserDocId(email: string) {
  const slug = email.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `cmsUser-${slug}`;
}
