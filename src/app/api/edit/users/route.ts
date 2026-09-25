import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_PASSWORD,
  getSessionFromRequest,
  hashPassword,
} from "@/lib/edit-auth";
import {
  cmsUserDocId,
  getEditWriteClient,
  type CmsUserDoc,
} from "@/lib/edit-users";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const client = getEditWriteClient();
  if (!client) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  const users = await client.fetch<CmsUserDoc[]>(
    `*[_type == "cmsUser"]|order(email asc){
      _id, email, role, mustChangePassword, active
    }`,
  );

  return NextResponse.json({
    users: users.map((u) => ({
      id: u._id,
      email: u.email,
      role: u.role,
      mustChangePassword: Boolean(u.mustChangePassword),
      active: u.active !== false,
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const client = getEditWriteClient();
  if (!client) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as { email?: string; role?: string };
  const email = (body.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const id = cmsUserDocId(email);
  const passwordHash = await hashPassword(DEFAULT_PASSWORD);
  await client.createOrReplace({
    _id: id,
    _type: "cmsUser",
    email,
    role: body.role === "superadmin" ? "superadmin" : "admin",
    passwordHash,
    mustChangePassword: true,
    active: true,
  });

  return NextResponse.json({ ok: true, id });
}

export async function PATCH(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const client = getEditWriteClient();
  if (!client) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    id?: string;
    action?: "resetPassword" | "setActive";
    active?: boolean;
  };

  if (!body.id || !body.action) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (body.action === "resetPassword") {
    const passwordHash = await hashPassword(DEFAULT_PASSWORD);
    await client
      .patch(body.id)
      .set({ passwordHash, mustChangePassword: true })
      .commit();
    return NextResponse.json({ ok: true });
  }

  if (body.action === "setActive") {
    await client
      .patch(body.id)
      .set({ active: Boolean(body.active) })
      .commit();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
