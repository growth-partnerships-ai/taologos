import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/edit-auth";
import { getPageContent } from "@/lib/content/get-page-content";

/** Authenticated snapshot of the live site content for /edit. */
export async function GET(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.mustChangePassword) {
    return NextResponse.json(
      { error: "Password change required." },
      { status: 403 },
    );
  }

  const content = await getPageContent();
  return NextResponse.json({ content });
}
