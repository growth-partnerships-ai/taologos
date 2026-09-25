import {
  DEFAULT_PASSWORD,
  hashPassword,
} from "@/lib/edit-auth";
import {
  cmsUserDocId,
  getEditWriteClient,
  type CmsUserDoc,
} from "@/lib/edit-users";

const DEFAULT_USERS = [
  {
    email: "superadmin@taologos.com",
    role: "superadmin" as const,
  },
  {
    email: "admin@taologos.com",
    role: "admin" as const,
  },
  {
    email: "binyamt3@gmail.com",
    role: "admin" as const,
  },
  {
    email: "taologos04@gmail.com",
    role: "admin" as const,
  },
];

/**
 * Creates the default /edit accounts if they do not exist.
 * Does not overwrite an existing password hash (so changed passwords stay).
 */
export async function ensureDefaultCmsUsers() {
  const client = getEditWriteClient();
  if (!client) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN");
  }

  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  const results: Array<{ email: string; created: boolean; id: string }> = [];

  for (const account of DEFAULT_USERS) {
    const id = cmsUserDocId(account.email);
    const existing = await client.fetch<CmsUserDoc | null>(
      `*[_id == $id][0]{ _id, email, passwordHash }`,
      { id },
    );

    if (existing?.passwordHash) {
      results.push({ email: account.email, created: false, id });
      continue;
    }

    await client.createOrReplace({
      _id: id,
      _type: "cmsUser",
      email: account.email,
      role: account.role,
      passwordHash,
      mustChangePassword: true,
      active: true,
    });
    results.push({ email: account.email, created: true, id });
  }

  return results;
}
