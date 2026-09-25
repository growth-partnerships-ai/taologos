import { NextResponse } from "next/server";
import {
  EDIT_SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/edit-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EDIT_SESSION_COOKIE, "", {
    ...sessionCookieOptions(0),
    maxAge: 0,
  });
  return res;
}
