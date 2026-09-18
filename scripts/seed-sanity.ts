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

  console.log("Uploading shared images…");
  const logo = await uploadImage(s.brand.logo, "logo-mark.png");
  const heroImage = await uploadImage(s.hero.image, "hero-cover.jpg");
  const servicesImage = await uploadImage(s.services.image, "services-bg.jpg");
  const certImage = await uploadImage(
    s.recognition.items[0]?.image || "/images/certificate-isspl-un-congo.jpg",
    "certificate-isspl.jpg",
  );
  const teamPhoto = await uploadImage(
    s.team.members[0]?.photo || "/images/card-binyam.jpg",
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

  for (const project of s.projects.items) {
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
      // Always set so every project has editable photo + testimonial fields
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
        _key: "hero",
        enabled: true,
        eyebrow: s.hero.eyebrow,
        headline: s.hero.headline,
        supporting: s.hero.supporting,
        image: heroImage,
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
        image: servicesImage,
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
          image: certImage,
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
          photo: teamPhoto,
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
  console.log("✓ Home page with sections + images");
  console.log("\nDone. In /studio you can replace any image (click the image → Upload / Select).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
