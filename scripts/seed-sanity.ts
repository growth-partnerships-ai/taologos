/**
 * Seeds Sanity with full website content INCLUDING images from /public.
 *
 * 1. SANITY_API_WRITE_TOKEN in .env.local (Editor token)
 * 2. npm run seed:sanity
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { findSection, seedContent } from "../src/lib/content/seed";
import { ensureDefaultCmsUsers } from "../src/lib/ensure-cms-users";

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

function publicPath(urlPath: string) {
  const rel = urlPath.replace(/^\//, "");
  return path.join(process.cwd(), "public", rel);
}

async function uploadImage(urlPath: string, filename: string) {
  const filePath = publicPath(urlPath);
  if (!existsSync(filePath)) {
    console.warn(`  skip missing image: ${urlPath}`);
    return undefined;
  }
  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename,
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

async function main() {
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

  console.log("Uploading shared images…");
  const logo = await uploadImage(s.brand.logo, "logo-mark.png");
  const heroImage = await uploadImage(hero.data.image, "hero-cover.jpg");
  const servicesImage = await uploadImage(services.data.image, "services-bg.jpg");
  const certImage = await uploadImage(
    recognition.data.items[0]?.image || "/images/certificate-isspl-un-congo.jpg",
    "certificate-isspl.jpg",
  );
  const teamPhoto = await uploadImage(
    team.data.members[0]?.photo || "/images/card-binyam.jpg",
    "binyam-card.jpg",
  );

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    language: "en",
    brandName: s.brand.name,
    brandSubtitle: s.brand.subtitle,
    legalName: s.brand.legalName,
    tagline: s.brand.tagline,
    logo,
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
  console.log("✓ Site settings (incl. logo)");

  const projectIds: string[] = [];
  const imageCache = new Map<string, Awaited<ReturnType<typeof uploadImage>>>();

  for (const project of projects.data.items) {
    const id = `project-${project.id}`;
    let images: Array<{
      _type: "image";
      _key: string;
      asset: { _type: "reference"; _ref: string };
    }> = [];
    if (project.image) {
      if (!imageCache.has(project.image)) {
        imageCache.set(
          project.image,
          await uploadImage(
            project.image,
            path.basename(project.image) || `project-${project.id}.jpg`,
          ),
        );
      }
      const img = imageCache.get(project.image);
      if (img?.asset?._ref) {
        images = [
          {
            _type: "image",
            _key: `img-${project.id}`,
            asset: img.asset,
          },
        ];
      }
    }

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
      images,
      testimonial: {
        _type: "testimonial",
        quote: project.testimonial?.quote || "",
        attribution: project.testimonial?.attribution || "",
      },
    });
    projectIds.push(id);
  }
  console.log(`✓ ${projectIds.length} projects (photos + testimonials)`);

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
        eyebrow: hero.data.eyebrow,
        headline: hero.data.headline,
        supporting: hero.data.supporting,
        image: heroImage,
        primaryCtaLabel: hero.data.primaryCtaLabel,
        primaryCtaHref: hero.data.primaryCtaHref,
        secondaryCtaLabel: hero.data.secondaryCtaLabel,
        secondaryCtaHref: hero.data.secondaryCtaHref,
      },
      {
        _type: "whoWeAreSection",
        _key: who.key,
        enabled: who.enabled,
        eyebrow: who.data.eyebrow,
        title: who.data.title,
        body: who.data.body,
        credentials: who.data.credentials,
      },
      {
        _type: "missionVisionSection",
        _key: mv.key,
        enabled: mv.enabled,
        missionTitle: mv.data.missionTitle,
        missionBody: mv.data.missionBody,
        visionTitle: mv.data.visionTitle,
        visionBody: mv.data.visionBody,
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
        image: servicesImage,
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
        groups: projects.data.groups.map(({ id, label, blurb }) => ({
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
          image: certImage,
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
          photo: teamPhoto,
        })),
      },
      {
        _type: "contactSection",
        _key: contact.key,
        enabled: contact.enabled,
        eyebrow: contact.data.eyebrow,
        title: contact.data.title,
        intro: contact.data.intro,
        formNameLabel: contact.data.formNameLabel,
        formPhoneLabel: contact.data.formPhoneLabel,
        formEmailLabel: contact.data.formEmailLabel,
        formMessageLabel: contact.data.formMessageLabel,
        formSubmitLabel: contact.data.formSubmitLabel,
        formSendingLabel: contact.data.formSendingLabel,
        formSuccessMessage: contact.data.formSuccessMessage,
        formErrorMessage: contact.data.formErrorMessage,
      },
    ],
  });
  console.log("✓ Home page with sections + images");

  const users = await ensureDefaultCmsUsers();
  console.log("✓ CMS users", users);

  console.log("\nDone. Open /edit to manage the site. /studio remains for advanced use.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
