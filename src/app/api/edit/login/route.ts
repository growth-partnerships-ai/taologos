import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  EDIT_SESSION_COOKIE,
  sessionCookieOptions,
  verifyPassword,
  type CmsSessionUser,
} from "@/lib/edit-auth";
import { findCmsUserByEmail } from "@/lib/edit-users";

/** 7 days — product decision 6C */
export const SESSION_MAX_AGE_SECONDS = Number(
  process.env.EDIT_SESSION_MAX_AGE_SECONDS || String(60 * 60 * 24 * 7),
);

export async function POST(request: NextRequest) {
  try {
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Server missing SANITY_API_WRITE_TOKEN. Add an Editor token from Sanity Manage → API → Tokens in Vercel env, then redeploy.",
        },
        { status: 500 },
      );
    }
    if (!SESSION_MAX_AGE_SECONDS || SESSION_MAX_AGE_SECONDS < 60) {
      return NextResponse.json(
        {
          error:
            "EDIT_SESSION_MAX_AGE_SECONDS is invalid. Use seconds (e.g. 604800 for 7 days).",
        },
        { status: 500 },
      );
    }

    let body: { email?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await findCmsUserByEmail(email);
    if (!user || user.active === false || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const sessionUser: CmsSessionUser = {
      id: user._id,
      email: user.email,
      role: user.role,
      mustChangePassword: Boolean(user.mustChangePassword),
    };

    const token = createSessionToken(sessionUser, SESSION_MAX_AGE_SECONDS);
    const res = NextResponse.json({
      ok: true,
      user: sessionUser,
    });
    res.cookies.set(
      EDIT_SESSION_COOKIE,
      token,
      sessionCookieOptions(SESSION_MAX_AGE_SECONDS),
    );
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    const hint = /unauthorized|session not found/i.test(message)
      ? " Sanity rejected SANITY_API_WRITE_TOKEN — create a new Editor token in Sanity Manage → API → Tokens, paste it in Vercel, redeploy."
      : "";
    return NextResponse.json({ error: message + hint }, { status: 500 });
  }
}
