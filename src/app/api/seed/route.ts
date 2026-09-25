import { createClient } from "@sanity/client";
import { NextRequest, NextResponse } from "next/server";
import { findSection, seedContent } from "@/lib/content/seed";
import { ensureDefaultCmsUsers } from "@/lib/ensure-cms-users";

export const runtime = "nodejs";

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
  const hero = findSection("hero")!;
  const who = findSection("whoWeAre")!;
  const mv = findSection("missionVision")!;
  const values = findSection("values")!;
  const services = findSection("services")!;
  const projects = findSection("projects")!;
  const recognition = findSection("recognition")!;
  const team = findSection("team")!;
  const contact = findSection("contact")!;

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
    for (const project of projects.data.items) {
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
          _key: hero.key,
          enabled: hero.enabled,
          ...hero.data,
          image: undefined,
        },
        {
          _type: "whoWeAreSection",
          _key: who.key,
          enabled: who.enabled,
          ...who.data,
        },
        {
          _type: "missionVisionSection",
          _key: mv.key,
          enabled: mv.enabled,
          ...mv.data,
        },
        {
          _type: "valuesSection",
          _key: values.key,
          enabled: values.enabled,
          eyebrow: values.data.eyebrow,
          title: values.data.title,
          intro: values.data.intro,
          items: values.data.items.map(({ title, description }) => ({
            title,
            description,
          })),
        },
        {
          _type: "servicesSection",
          _key: services.key,
          enabled: services.enabled,
          eyebrow: services.data.eyebrow,
          title: services.data.title,
          items: services.data.items.map(({ title, description }) => ({
            title,
            description,
          })),
        },
        {
          _type: "projectsSection",
          _key: projects.key,
          enabled: projects.enabled,
          title: projects.data.title,
          locationLabel: projects.data.locationLabel,
          typeLabel: projects.data.typeLabel,
          scopeLabel: projects.data.scopeLabel,
          projectSingular: projects.data.projectSingular,
          projectPlural: projects.data.projectPlural,
          groups: projects.data.groups,
          projectRefs: projectIds.map((id) => ({
            _type: "reference",
            _ref: id,
          })),
        },
        {
          _type: "recognitionSection",
          _key: recognition.key,
          enabled: recognition.enabled,
          eyebrow: recognition.data.eyebrow,
          title: recognition.data.title,
          intro: recognition.data.intro,
          presentedToLabel: recognition.data.presentedToLabel,
          items: recognition.data.items.map((item) => ({
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
          _key: team.key,
          enabled: team.enabled,
          eyebrow: team.data.eyebrow,
          title: team.data.title,
          intro: team.data.intro,
          members: team.data.members.map(({ name, role, bio }) => ({
            name,
            role,
            bio,
          })),
        },
        {
          _type: "contactSection",
          _key: contact.key,
          enabled: contact.enabled,
          ...contact.data,
        },
      ],
    });

    const users = await ensureDefaultCmsUsers();

    return NextResponse.json({
      ok: true,
      message:
        "CMS seeded. Open /edit to manage the site. /studio remains for advanced use.",
      edit: "/edit",
      projects: projectIds.length,
      users,
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
