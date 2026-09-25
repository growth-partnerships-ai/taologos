import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/edit-auth";
import { getEditWriteClient } from "@/lib/edit-users";
import type { SiteContent } from "@/lib/content/types";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
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

  const client = getEditWriteClient();
  if (!client) {
    return NextResponse.json(
      { error: "Missing SANITY_API_WRITE_TOKEN." },
      { status: 500 },
    );
  }

  let body: { content?: SiteContent };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.content?.sections?.length) {
    return NextResponse.json(
      { error: "Content with sections is required." },
      { status: 400 },
    );
  }

  const content = body.content;

  await client.createOrReplace({
    _id: "siteEditState",
    _type: "siteEditState",
    updatedAt: new Date().toISOString(),
    updatedBy: session.email,
    content: JSON.stringify(content),
  });

  // Keep Site settings document in sync for Studio users.
  await client
    .patch("siteSettings")
    .set({
      brandName: content.brand.name,
      brandSubtitle: content.brand.subtitle,
      legalName: content.brand.legalName,
      tagline: content.brand.tagline,
      navLinks: content.nav.links.map(({ label, href }) => ({ label, href })),
      navCtaLabel: content.nav.ctaLabel,
      navCtaHref: content.nav.ctaHref,
      menuOpenLabel: content.nav.menuOpenLabel,
      menuCloseLabel: content.nav.menuCloseLabel,
      contacts: content.contacts.map(({ label, value, href, kind }) => ({
        label,
        value,
        href,
        kind,
      })),
      seoTitle: content.seo.title,
      seoDescription: content.seo.description,
      footerNote: content.footer.note,
      skipToContent: content.a11y.skipToContent,
      primaryNavLabel: content.a11y.primaryNavLabel,
      mobileNavLabel: content.a11y.mobileNavLabel,
    })
    .commit()
    .catch(() => {
      /* siteSettings may be missing until seed */
    });

  revalidatePath("/");
  revalidatePath("/edit");

  return NextResponse.json({
    ok: true,
    message: "Saved — live site updates in about 30 seconds.",
  });
}
