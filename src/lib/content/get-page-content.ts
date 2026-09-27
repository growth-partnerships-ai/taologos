import { connection } from "next/server";
import { client } from "@/lib/sanity/client";
import { hasSanityConfig } from "@/lib/sanity/env";
import {
  homePageQuery,
  projectsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { seedContent } from "./seed";
import { resolveBrandLogo } from "./logo";
import { SECTION_TYPE_TO_ID } from "./sections";
import type {
  ContactEntry,
  NavLink,
  PageSection,
  ProjectItem,
  SiteContent,
} from "./types";

const CONTENT_FETCH = {
  next: { tags: ["site-content"] as string[] },
};

type SanitySettings = {
  brandName?: string;
  brandSubtitle?: string;
  legalName?: string;
  tagline?: string;
  logoUrl?: string | null;
  navLinks?: Array<{ label?: string; href?: string }>;
  navCtaLabel?: string;
  navCtaHref?: string;
  menuOpenLabel?: string;
  menuCloseLabel?: string;
  contacts?: Array<{
    label?: string;
    value?: string;
    href?: string;
    kind?: ContactEntry["kind"];
  }>;
  seoTitle?: string;
  seoDescription?: string;
  footerNote?: string;
  skipToContent?: string;
  primaryNavLabel?: string;
  mobileNavLabel?: string;
};

type SanityProject = {
  _id: string;
  number?: string;
  title?: string;
  client?: string;
  typology?: string;
  location?: string;
  scope?: string;
  group?: string;
  featured?: boolean;
  image?: string | null;
  testimonial?: { quote?: string; attribution?: string } | null;
};

type SanitySection = {
  _type?: string;
  _key?: string;
  enabled?: boolean;
  imageUrl?: string | null;
  projectRefs?: SanityProject[] | null;
  members?: Array<{
    name?: string;
    role?: string;
    bio?: string;
    photoUrl?: string | null;
  }>;
  items?: unknown;
  groups?: Array<{ id?: string; label?: string; blurb?: string }>;
  images?: Array<{ _key?: string; imageUrl?: string; alt?: string }>;
  logos?: Array<{ _key?: string; imageUrl?: string }>;
  [key: string]: unknown;
};

function str(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function mapProjects(rows: SanityProject[] | null | undefined): ProjectItem[] {
  if (!rows?.length) return [];
  return rows
    .filter((row) => row.title && row.group)
    .map((row, index) => ({
      id: row._id || `sanity-${index}`,
      number: row.number || String(index + 1).padStart(2, "0"),
      title: row.title!,
      client: row.client || "",
      typology: row.typology || "",
      location: row.location || "",
      scope: row.scope || "",
      group: row.group!,
      image: row.image || "/images/project-01.jpg",
      featured: Boolean(row.featured),
      testimonial:
        row.testimonial?.quote && row.testimonial?.attribution
          ? {
              quote: row.testimonial.quote,
              attribution: row.testimonial.attribution,
            }
          : undefined,
    }));
}

function applySettings(
  content: SiteContent,
  settings: SanitySettings | null,
): SiteContent {
  if (!settings) return content;

  const navLinks: NavLink[] =
    settings.navLinks
      ?.filter((l) => l.label && l.href)
      .map((l, i) => ({
        id: `nav-${i}`,
        label: l.label!,
        href: l.href!,
      })) || content.nav.links;

  return {
    ...content,
    brand: {
      name: settings.brandName || content.brand.name,
      legalName: settings.legalName || content.brand.legalName,
      tagline: settings.tagline || content.brand.tagline,
      subtitle: settings.brandSubtitle || content.brand.subtitle,
      logo: resolveBrandLogo(settings.logoUrl || content.brand.logo),
    },
    nav: {
      links: navLinks,
      ctaLabel: settings.navCtaLabel || content.nav.ctaLabel,
      ctaHref: settings.navCtaHref || content.nav.ctaHref,
      menuOpenLabel: settings.menuOpenLabel || content.nav.menuOpenLabel,
      menuCloseLabel: settings.menuCloseLabel || content.nav.menuCloseLabel,
    },
    seo: {
      title: settings.seoTitle || content.seo.title,
      description: settings.seoDescription || content.seo.description,
    },
    contacts:
      settings.contacts
        ?.filter((c) => c.label && c.value)
        .map((c, i) => ({
          id: `cms-${i}`,
          label: c.label!,
          value: c.value!,
          href: c.href,
          kind: c.kind || "other",
        })) || content.contacts,
    footer: {
      note: settings.footerNote || content.footer.note,
    },
    a11y: {
      skipToContent: settings.skipToContent || content.a11y.skipToContent,
      primaryNavLabel:
        settings.primaryNavLabel || content.a11y.primaryNavLabel,
      mobileNavLabel: settings.mobileNavLabel || content.a11y.mobileNavLabel,
    },
  };
}

function mapSanitySection(
  section: SanitySection,
  allProjects: ProjectItem[],
  seedFallback: PageSection | undefined,
): PageSection | null {
  const type = section._type
    ? SECTION_TYPE_TO_ID[section._type]
    : undefined;
  if (!type) return null;
  const key = section._key || `${type}-${Math.random().toString(36).slice(2, 7)}`;
  const enabled = section.enabled !== false;
  const seedData = seedFallback?.type === type ? seedFallback.data : undefined;

  switch (type) {
    case "hero": {
      const fallback = (seedData || seedContent.sections.find((s) => s.type === "hero")?.data) as
        | Extract<PageSection, { type: "hero" }>["data"]
        | undefined;
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, fallback?.eyebrow || ""),
          headline: str(section.headline, fallback?.headline || ""),
          supporting: str(section.supporting, fallback?.supporting || ""),
          image: str(section.imageUrl, fallback?.image || "/images/hero-cover.jpg"),
          primaryCtaLabel: str(
            section.primaryCtaLabel,
            fallback?.primaryCtaLabel || "",
          ),
          primaryCtaHref: str(
            section.primaryCtaHref,
            fallback?.primaryCtaHref || "#projects",
          ),
          secondaryCtaLabel: str(
            section.secondaryCtaLabel,
            fallback?.secondaryCtaLabel || "",
          ),
          secondaryCtaHref: str(
            section.secondaryCtaHref,
            fallback?.secondaryCtaHref || "#contact",
          ),
        },
      };
    }
    case "whoWeAre": {
      const fallback = seedContent.sections.find((s) => s.type === "whoWeAre");
      const fb = fallback?.type === "whoWeAre" ? fallback.data : undefined;
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, fb?.eyebrow || ""),
          title: str(section.title, fb?.title || ""),
          body: str(section.body, fb?.body || ""),
          credentials: Array.isArray(section.credentials)
            ? (section.credentials as string[]).filter(Boolean)
            : fb?.credentials || [],
        },
      };
    }
    case "missionVision": {
      const fallback = seedContent.sections.find((s) => s.type === "missionVision");
      const fb = fallback?.type === "missionVision" ? fallback.data : undefined;
      return {
        key,
        type,
        enabled,
        data: {
          missionTitle: str(section.missionTitle, fb?.missionTitle || ""),
          missionBody: str(section.missionBody, fb?.missionBody || ""),
          visionTitle: str(section.visionTitle, fb?.visionTitle || ""),
          visionBody: str(section.visionBody, fb?.visionBody || ""),
        },
      };
    }
    case "values": {
      const fallback = seedContent.sections.find((s) => s.type === "values");
      const fb = fallback?.type === "values" ? fallback.data : undefined;
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, fb?.eyebrow || ""),
          title: str(section.title, fb?.title || ""),
          intro: str(section.intro, fb?.intro || ""),
          items: Array.isArray(section.items)
            ? (
                section.items as Array<{
                  title?: string;
                  description?: string;
                }>
              ).map((item, i) => ({
                id: `value-${i}`,
                title: item.title || "",
                description: item.description || "",
              }))
            : fb?.items || [],
        },
      };
    }
    case "services": {
      const fallback = seedContent.sections.find((s) => s.type === "services");
      const fb = fallback?.type === "services" ? fallback.data : undefined;
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, fb?.eyebrow || ""),
          title: str(section.title, fb?.title || ""),
          image: str(section.imageUrl, fb?.image || "/images/services-bg.jpg"),
          items: Array.isArray(section.items)
            ? (
                section.items as Array<{
                  title?: string;
                  description?: string;
                }>
              ).map((item, i) => ({
                id: `service-${i}`,
                title: item.title || "",
                description: item.description || "",
              }))
            : fb?.items || [],
        },
      };
    }
    case "projects": {
      const fallback = seedContent.sections.find((s) => s.type === "projects");
      const fb = fallback?.type === "projects" ? fallback.data : undefined;
      const selected = mapProjects(section.projectRefs);
      const items = selected.length
        ? selected
        : allProjects.length
          ? allProjects
          : fb?.items || [];
      return {
        key,
        type,
        enabled,
        data: {
          title: str(section.title, fb?.title || "Selected Projects"),
          locationLabel: str(section.locationLabel, fb?.locationLabel || "Location"),
          typeLabel: str(section.typeLabel, fb?.typeLabel || "Type"),
          scopeLabel: str(section.scopeLabel, fb?.scopeLabel || "Scope"),
          projectSingular: str(
            section.projectSingular,
            fb?.projectSingular || "project",
          ),
          projectPlural: str(
            section.projectPlural,
            fb?.projectPlural || "projects",
          ),
          groups:
            Array.isArray(section.groups) && section.groups.length
              ? section.groups
                  .filter((g) => g.id && g.label)
                  .map((g) => ({
                    id: g.id!,
                    label: g.label!,
                    blurb: g.blurb || "",
                  }))
              : fb?.groups || [],
          projectIds: items.map((p) => p.id),
          items,
        },
      };
    }
    case "recognition": {
      const fallback = seedContent.sections.find((s) => s.type === "recognition");
      const fb = fallback?.type === "recognition" ? fallback.data : undefined;
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, fb?.eyebrow || ""),
          title: str(section.title, fb?.title || ""),
          intro: str(section.intro, fb?.intro || ""),
          presentedToLabel: str(
            section.presentedToLabel,
            fb?.presentedToLabel || "Presented to",
          ),
          items: Array.isArray(section.items)
            ? (
                section.items as Array<{
                  title?: string;
                  issuer?: string;
                  recipient?: string;
                  summary?: string;
                  highlights?: string[];
                  projectLabel?: string;
                  imageUrl?: string;
                }>
              ).map((item, i) => ({
                id: `cert-${i}`,
                title: item.title || "",
                issuer: item.issuer || "",
                recipient: item.recipient || "",
                summary: item.summary || "",
                highlights: item.highlights || [],
                image:
                  item.imageUrl ||
                  fb?.items[0]?.image ||
                  "/images/certificate-isspl-un-congo.jpg",
                projectLabel: item.projectLabel,
              }))
            : fb?.items || [],
        },
      };
    }
    case "team": {
      const fallback = seedContent.sections.find((s) => s.type === "team");
      const fb = fallback?.type === "team" ? fallback.data : undefined;
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, fb?.eyebrow || ""),
          title: str(section.title, fb?.title || ""),
          intro: str(section.intro, fb?.intro || ""),
          members: Array.isArray(section.members)
            ? section.members
                .filter((m) => m.name)
                .map((m, i) => ({
                  id: `member-${i}`,
                  name: m.name!,
                  role: m.role || "",
                  bio: m.bio,
                  photo: m.photoUrl || undefined,
                }))
            : fb?.members || [],
        },
      };
    }
    case "contact": {
      const fallback = seedContent.sections.find((s) => s.type === "contact");
      const fb = fallback?.type === "contact" ? fallback.data : undefined;
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, fb?.eyebrow || ""),
          title: str(section.title, fb?.title || ""),
          intro: str(section.intro, fb?.intro || ""),
          formNameLabel: str(section.formNameLabel, fb?.formNameLabel || "Name"),
          formPhoneLabel: str(
            section.formPhoneLabel,
            fb?.formPhoneLabel || "Phone",
          ),
          formEmailLabel: str(
            section.formEmailLabel,
            fb?.formEmailLabel || "Email",
          ),
          formMessageLabel: str(
            section.formMessageLabel,
            fb?.formMessageLabel || "Message",
          ),
          formSubmitLabel: str(
            section.formSubmitLabel,
            fb?.formSubmitLabel || "Send message",
          ),
          formSendingLabel: str(
            section.formSendingLabel,
            fb?.formSendingLabel || "Sending…",
          ),
          formSuccessMessage: str(
            section.formSuccessMessage,
            fb?.formSuccessMessage || "",
          ),
          formErrorMessage: str(
            section.formErrorMessage,
            fb?.formErrorMessage || "",
          ),
        },
      };
    }
    case "gallery": {
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, "Gallery"),
          title: str(section.title, "Project photos"),
          autoplay: section.autoplay !== false,
          images: Array.isArray(section.images)
            ? section.images
                .filter((img) => img.imageUrl)
                .map((img, i) => ({
                  id: img._key || `img-${i}`,
                  src: img.imageUrl!,
                  alt: img.alt || "",
                }))
            : [],
        },
      };
    }
    case "clientsMarquee": {
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, "Clients"),
          title: str(section.title, "Companies we’ve worked with"),
          direction: section.direction === "ltr" ? "ltr" : "rtl",
          logos: Array.isArray(section.logos)
            ? section.logos
                .filter((logo) => logo.imageUrl)
                .map((logo, i) => ({
                  id: logo._key || `logo-${i}`,
                  image: logo.imageUrl!,
                }))
            : [],
        },
      };
    }
    case "testimonials": {
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, "Voices"),
          title: str(section.title, "Testimonials"),
          intro: str(section.intro, ""),
          items: Array.isArray(section.items)
            ? (
                section.items as Array<{
                  quote?: string;
                  name?: string;
                  role?: string;
                  company?: string;
                  photoUrl?: string;
                  _key?: string;
                }>
              )
                .filter((item) => item.quote && item.name)
                .map((item, i) => ({
                  id: item._key || `t-${i}`,
                  quote: item.quote!,
                  name: item.name!,
                  role: item.role,
                  company: item.company,
                  photo: item.photoUrl,
                }))
            : [],
        },
      };
    }
    case "stats": {
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, ""),
          title: str(section.title, "At a glance"),
          items: Array.isArray(section.items)
            ? (
                section.items as Array<{
                  number?: string;
                  label?: string;
                  detail?: string;
                  _key?: string;
                }>
              )
                .filter((item) => item.number && item.label)
                .map((item, i) => ({
                  id: item._key || `stat-${i}`,
                  number: item.number!,
                  label: item.label!,
                  detail: item.detail,
                }))
            : [],
        },
      };
    }
    case "simpleText": {
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, ""),
          title: str(section.title, ""),
          body: str(section.body, ""),
        },
      };
    }
    case "imageText": {
      return {
        key,
        type,
        enabled,
        data: {
          eyebrow: str(section.eyebrow, ""),
          title: str(section.title, ""),
          body: str(section.body, ""),
          image: str(section.imageUrl, "/images/hero-cover.jpg"),
          imagePosition: section.imagePosition === "right" ? "right" : "left",
        },
      };
    }
    default:
      return null;
  }
}

function applyHomeSections(
  content: SiteContent,
  home: { sections?: SanitySection[] | null } | null,
  allProjects: ProjectItem[],
): SiteContent {
  const rows = home?.sections;
  if (!rows?.length) {
    return {
      ...content,
      sections: content.sections.map((section) => {
        if (section.type !== "projects") return section;
        return {
          ...section,
          data: {
            ...section.data,
            items: allProjects.length ? allProjects : section.data.items,
            projectIds: (allProjects.length ? allProjects : section.data.items).map(
              (p) => p.id,
            ),
          },
        };
      }),
    };
  }

  const mapped = rows
    .map((row, index) =>
      mapSanitySection(row, allProjects, content.sections[index]),
    )
    .filter((s): s is PageSection => Boolean(s));

  return {
    ...content,
    sections: mapped.length ? mapped : content.sections,
  };
}

async function loadEditSnapshot(): Promise<SiteContent | null> {
  try {
    const row = await client.fetch<{ content?: string } | null>(
      `*[_id == "siteEditState"][0]{ content }`,
      {},
      CONTENT_FETCH,
    );
    if (!row?.content) return null;
    const parsed = JSON.parse(row.content) as SiteContent;
    if (!parsed?.sections?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getPageContent(language = "en"): Promise<SiteContent> {
  void language;
  // Always read current CMS state — never serve a multi-minute ISR shell.
  await connection();
  if (!hasSanityConfig()) return seedContent;

  try {
    const snapshot = await loadEditSnapshot();
    if (snapshot) {
      return {
        ...snapshot,
        brand: {
          ...snapshot.brand,
          logo: resolveBrandLogo(snapshot.brand.logo),
        },
      };
    }

    const [settings, projects, home] = await Promise.all([
      client.fetch<SanitySettings | null>(siteSettingsQuery, {}, CONTENT_FETCH),
      client.fetch<SanityProject[] | null>(projectsQuery, {}, CONTENT_FETCH),
      client.fetch<{ sections?: SanitySection[] | null } | null>(
        homePageQuery,
        {},
        CONTENT_FETCH,
      ),
    ]);

    const mappedProjects = mapProjects(projects);
    let content = applySettings(seedContent, settings);
    content = applyHomeSections(content, home, mappedProjects);
    return content;
  } catch (error) {
    console.error("[content] Sanity fetch failed, using seed", error);
    return seedContent;
  }
}
