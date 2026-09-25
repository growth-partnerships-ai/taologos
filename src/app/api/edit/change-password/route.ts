import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  EDIT_SESSION_COOKIE,
  getSessionFromRequest,
  hashPassword,
  sessionCookieOptions,
  validateNewPassword,
  verifyPassword,
} from "@/lib/edit-auth";
import { getCmsUserById, getEditWriteClient } from "@/lib/edit-users";
import { SESSION_MAX_AGE_SECONDS } from "@/app/api/edit/login/route";

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  if (!SESSION_MAX_AGE_SECONDS || SESSION_MAX_AGE_SECONDS < 60) {
    return NextResponse.json(
      { error: "Session length is not configured." },
      { status: 500 },
    );
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const currentPassword = body.currentPassword || "";
  const newPassword = body.newPassword || "";

  const ruleError = validateNewPassword(newPassword);
  if (ruleError) {
    return NextResponse.json({ error: ruleError }, { status: 400 });
  }

  const user = await getCmsUserById(session.id);
  if (!user?.passwordHash) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const forced = Boolean(user.mustChangePassword);
  // 9B: forced first change does not require typing the default again.
  if (!forced) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required." },
        { status: 400 },
      );
    }
    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 },
      );
    }
  }

  const client = getEditWriteClient();
  if (!client) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  const passwordHash = await hashPassword(newPassword);
  await client
    .patch(user._id)
    .set({ passwordHash, mustChangePassword: false })
    .commit();

  const nextSession = {
    id: user._id,
    email: user.email,
    role: user.role,
    mustChangePassword: false,
  };
  const token = createSessionToken(nextSession, SESSION_MAX_AGE_SECONDS);
  const res = NextResponse.json({ ok: true, user: nextSession });
  res.cookies.set(
    EDIT_SESSION_COOKIE,
    token,
    sessionCookieOptions(SESSION_MAX_AGE_SECONDS),
  );
  return res;
}
