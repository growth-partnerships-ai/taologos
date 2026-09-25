import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/edit-auth";
import { getCmsUserById } from "@/lib/edit-users";

export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const fresh = await getCmsUserById(session.id);
  if (!fresh || fresh.active === false) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: fresh._id,
      email: fresh.email,
      role: fresh.role,
      mustChangePassword: Boolean(fresh.mustChangePassword),
    },
  });
}
