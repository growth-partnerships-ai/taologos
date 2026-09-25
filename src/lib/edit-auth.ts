import bcrypt from "bcryptjs";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export type CmsRole = "superadmin" | "admin";

export type CmsSessionUser = {
  id: string;
  email: string;
  role: CmsRole;
  mustChangePassword: boolean;
};

export const EDIT_SESSION_COOKIE = "taologos_edit_session";
export const DEFAULT_PASSWORD = "admin1234";
export const MIN_PASSWORD_LENGTH = 8;

const SESSION_VERSION = 1;

function sessionSecret() {
  return (
    process.env.EDIT_SESSION_SECRET || "Taologos General Contractor"
  );
}

export function validateNewPassword(password: string): string | null {
  if (!password || !password.trim()) {
    return "Password cannot be empty.";
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (password === DEFAULT_PASSWORD) {
    return "Choose a new password (not the default).";
  }
  return null;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

type SessionPayload = CmsSessionUser & {
  v: number;
  exp: number;
};

function sign(payloadB64: string) {
  return createHmac("sha256", sessionSecret())
    .update(payloadB64)
    .digest("base64url");
}

export function createSessionToken(
  user: CmsSessionUser,
  maxAgeSeconds: number,
) {
  const payload: SessionPayload = {
    ...user,
    v: SESSION_VERSION,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  return `${payloadB64}.${sign(payloadB64)}`;
}

export function readSessionToken(token: string | undefined | null): CmsSessionUser | null {
  if (!token) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  let expected: string;
  try {
    expected = sign(payloadB64);
  } catch {
    return null;
  }

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (payload.v !== SESSION_VERSION) return null;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.id || !payload.email || !payload.role) return null;
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      mustChangePassword: Boolean(payload.mustChangePassword),
    };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest): CmsSessionUser | null {
  return readSessionToken(request.cookies.get(EDIT_SESSION_COOKIE)?.value);
}

export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
