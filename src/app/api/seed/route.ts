import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { seedContent } from "@/lib/content/seed";

export const runtime = "nodejs";

/**
 * One-time CMS seed for people who only have Vercel (no local terminal).
 *
 * Setup in Vercel → Project → Settings → Environment Variables:
 *   SANITY_API_WRITE_TOKEN = Editor token from Sanity Manage → API → Tokens
 *   SEED_SECRET            = any long random string you invent
 *
 * Then open once:
 *   https://YOUR-SITE.vercel.app/api/seed?secret=YOUR_SEED_SECRET
 *
 * Delete SEED_SECRET from Vercel (or change it) after seeding.
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.SEED_SECRET;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!expected || !secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!token) {
    return NextResponse.json(
      {
        error:
          "Missing SANITY_API_WRITE_TOKEN in Vercel env. Add it under Settings → Environment Variables, redeploy, then try again.",
      },
      { status: 500 },
    );
  }

  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "k8clerei";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
    token,
    useCdn: false,
  });

  const s = seedContent;

  try {
    await client.createOrReplace({
      _id: "siteSettings",
      _type: "siteSettings",
      language: "en",
      brandName: s.brand.name,
      brandSubtitle: s.brand.subtitle,
      legalName: s.brand.legalName,
      tagline: s.brand.tagline,
      navLinks: s.nav.links.map(({ label, href }) => ({ label, href })),
      navCtaLabel: s.nav.ctaLabel,
      navCtaHref: s.nav.ctaHref,
      menuOpenLabel: s.nav.menuOpenLabel,
      menuCloseLabel: s.nav.menuCloseLabel,
      contacts: s.contacts.map(({ label, value, href, kind }) => ({
        label,
        value,
        href,
        kind,
      })),
      seoTitle: s.seo.title,
      seoDescription: s.seo.description,
      footerNote: s.footer.note,
      skipToContent: s.a11y.skipToContent,
      primaryNavLabel: s.a11y.primaryNavLabel,
      mobileNavLabel: s.a11y.mobileNavLabel,
    });

    const projectIds: string[] = [];
    for (const project of s.projects.items) {
      const id = `project-${project.id}`;
      await client.createOrReplace({
        _id: id,
        _type: "project",
        number: project.number,
        title: project.title,
        client: project.client,
        typology: project.typology,
        location: project.location,
        scope: project.scope,
        group: project.group,
        featured: Boolean(project.featured),
        testimonial: project.testimonial || undefined,
      });
      projectIds.push(id);
    }

    await client.createOrReplace({
      _id: "homePage",
      _type: "homePage",
      language: "en",
      title: "Home",
      sections: [
        {
          _type: "heroSection",
          _key: "hero",
          enabled: true,
          eyebrow: s.hero.eyebrow,
          headline: s.hero.headline,
          supporting: s.hero.supporting,
          primaryCtaLabel: s.hero.primaryCtaLabel,
          primaryCtaHref: s.hero.primaryCtaHref,
          secondaryCtaLabel: s.hero.secondaryCtaLabel,
          secondaryCtaHref: s.hero.secondaryCtaHref,
        },
        {
          _type: "whoWeAreSection",
          _key: "who",
          enabled: true,
          eyebrow: s.whoWeAre.eyebrow,
          title: s.whoWeAre.title,
          body: s.whoWeAre.body,
          credentials: s.whoWeAre.credentials,
        },
        {
          _type: "missionVisionSection",
          _key: "mv",
          enabled: true,
          missionTitle: s.mission.title,
          missionBody: s.mission.body,
          visionTitle: s.vision.title,
          visionBody: s.vision.body,
        },
        {
          _type: "valuesSection",
          _key: "values",
          enabled: true,
          eyebrow: s.values.eyebrow,
          title: s.values.title,
          intro: s.values.intro,
          items: s.values.items.map(({ title, description }) => ({
            title,
            description,
          })),
        },
        {
          _type: "servicesSection",
          _key: "services",
          enabled: true,
          eyebrow: s.services.eyebrow,
          title: s.services.title,
          items: s.services.items.map(({ title, description }) => ({
            title,
            description,
          })),
        },
        {
          _type: "projectsSection",
          _key: "projects",
          enabled: true,
          eyebrow: s.projects.eyebrow,
          title: s.projects.title,
          intro: s.projects.intro,
          locationLabel: s.projects.locationLabel,
          typeLabel: s.projects.typeLabel,
          scopeLabel: s.projects.scopeLabel,
          projectSingular: s.projects.projectSingular,
          projectPlural: s.projects.projectPlural,
          groups: s.projects.groups.map(({ id, label, blurb }) => ({
            id,
            label,
            blurb,
          })),
          projectRefs: projectIds.map((id) => ({
            _type: "reference",
            _ref: id,
          })),
        },
        {
          _type: "recognitionSection",
          _key: "recognition",
          enabled: true,
          eyebrow: s.recognition.eyebrow,
          title: s.recognition.title,
          intro: s.recognition.intro,
          presentedToLabel: s.recognition.presentedToLabel,
          items: s.recognition.items.map((item) => ({
            title: item.title,
            issuer: item.issuer,
            recipient: item.recipient,
            summary: item.summary,
            highlights: item.highlights,
            projectLabel: item.projectLabel,
          })),
        },
        {
          _type: "teamSection",
          _key: "team",
          enabled: false,
          eyebrow: s.team.eyebrow,
          title: s.team.title,
          intro: s.team.intro,
          members: s.team.members.map(({ name, role, bio }) => ({
            name,
            role,
            bio,
          })),
        },
        {
          _type: "contactSection",
          _key: "contact",
          enabled: true,
          eyebrow: s.contact.eyebrow,
          title: s.contact.title,
          intro: s.contact.intro,
          formNameLabel: s.contact.formNameLabel,
          formPhoneLabel: s.contact.formPhoneLabel,
          formEmailLabel: s.contact.formEmailLabel,
          formMessageLabel: s.contact.formMessageLabel,
          formSubmitLabel: s.contact.formSubmitLabel,
          formSendingLabel: s.contact.formSendingLabel,
          formSuccessMessage: s.contact.formSuccessMessage,
          formErrorMessage: s.contact.formErrorMessage,
        },
      ],
    });

    return NextResponse.json({
      ok: true,
      message:
        "CMS seeded. Open /studio to edit. Remove SEED_SECRET from Vercel env when done.",
      studio: "/studio",
      projects: projectIds.length,
    });
  } catch (error) {
    console.error("[seed]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Seed failed",
      },
      { status: 500 },
    );
  }
}
