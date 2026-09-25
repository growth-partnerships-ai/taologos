import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/edit-auth";
import { getEditWriteClient } from "@/lib/edit-users";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session || session.mustChangePassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = getEditWriteClient();
  if (!client) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: file.name || "upload.jpg",
    contentType: file.type || "image/jpeg",
  });

  return NextResponse.json({
    ok: true,
    url: asset.url,
    assetId: asset._id,
  });
}
