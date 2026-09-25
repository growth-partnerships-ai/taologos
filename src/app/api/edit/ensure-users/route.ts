import { NextRequest, NextResponse } from "next/server";
import { ensureDefaultCmsUsers } from "@/lib/ensure-cms-users";

/**
 * Creates default /edit users if missing.
 * - With SEED_SECRET: always allowed (backup / ops).
 * - Without secret: allowed only as a soft bootstrap from /edit (7C).
 */
export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-seed-secret");
  const expected = process.env.SEED_SECRET;
  const hasValidSecret = Boolean(expected && secret && secret === expected);
  const fromEditBootstrap =
    request.headers.get("x-edit-bootstrap") === "1";

  if (!hasValidSecret && !fromEditBootstrap) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN" },
      { status: 500 },
    );
  }

  try {
    const results = await ensureDefaultCmsUsers();
    return NextResponse.json({ ok: true, results });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to seed users",
      },
      { status: 500 },
    );
  }
}
