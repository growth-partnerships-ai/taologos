/**
 * Seeds Sanity with the full current website content so every field is editable in Studio.
 *
 * Requires Node 18+ (File polyfill included) or Node 20+.
 *
 * 1. In sanity.io/manage → API → Tokens → Add API token (Editor permissions)
 * 2. Put it in .env.local as SANITY_API_WRITE_TOKEN=...
 * 3. Run: npm run seed:sanity
 *
 * Or from Vercel only: set env vars, redeploy, open /api/seed?secret=YOUR_SEED_SECRET
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import { seedContent } from "../src/lib/content/seed";

loadEnv({ path: ".env.local" });

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "k8clerei";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN. Create an Editor token in Sanity Manage → API → Tokens.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

async function main() {
  const s = seedContent;

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
    contacts: s.contacts.map(({ label, value, href, kind }) => ({
      label,
      value,
      href,
      kind,
    })),
    seoTitle: s.seo.title,
    seoDescription: s.seo.description,
    footerNote: s.footer.note,
  });
  console.log("✓ Site settings");

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
  console.log(`✓ ${projectIds.length} projects`);

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
        title: s.projects.title,
        intro: s.projects.intro,
        projectRefs: projectIds.map((id) => ({
          _type: "reference",
          _ref: id,
        })),
      },
      {
        _type: "recognitionSection",
        _key: "recognition",
        enabled: true,
        title: s.recognition.title,
        intro: s.recognition.intro,
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
        title: s.contact.title,
        intro: s.contact.intro,
      },
    ],
  });
  console.log("✓ Home page with all sections");
  console.log("\nDone. Open /studio — every part of the page is now editable.");
  console.log(
    "Note: upload images (hero, logo, certificates, project photos) in Studio — text/structure is seeded.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
