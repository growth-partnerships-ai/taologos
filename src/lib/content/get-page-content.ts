import { client } from "@/lib/sanity/client";
import { hasSanityConfig } from "@/lib/sanity/env";
import {
  homePageQuery,
  projectsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { seedContent } from "./seed";
import {
  DEFAULT_SECTION_ORDER,
  SECTION_TYPE_TO_ID,
  type SectionId,
} from "./sections";
import type {
  CertificateItem,
  ContactEntry,
  ProjectGroup,
  ProjectItem,
  SiteContent,
  ValueItem,
} from "./types";

type SanitySettings = {
  brandName?: string;
  legalName?: string;
  tagline?: string;
  contacts?: Array<{
    label?: string;
    value?: string;
    href?: string;
    kind?: ContactEntry["kind"];
  }>;
  seoTitle?: string;
  seoDescription?: string;
  footerNote?: string;
};

type SanityProject = {
  _id: string;
  number?: string;
  title?: string;
  client?: string;
  typology?: string;
  location?: string;
  scope?: string;
  group?: ProjectGroup;
  featured?: boolean;
  image?: string | null;
  testimonial?: { quote?: string; attribution?: string } | null;
};

type SanitySection = {
  _type?: string;
  enabled?: boolean;
  [key: string]: unknown;
};

type SanityHomePage = {
  sections?: SanitySection[] | null;
};

function mapProjects(rows: SanityProject[] | null): ProjectItem[] | null {
  if (!rows?.length) return null;
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
  return {
    ...content,
    brand: {
      name: settings.brandName || content.brand.name,
      legalName: settings.legalName || content.brand.legalName,
      tagline: settings.tagline || content.brand.tagline,
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
  };
}

function str(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function applyHomeSections(
  content: SiteContent,
  home: SanityHomePage | null,
): SiteContent {
  const sections = home?.sections;
  if (!sections?.length) {
    return { ...content, sectionOrder: DEFAULT_SECTION_ORDER };
  }

  const order: SectionId[] = [];
  let next = { ...content };

  for (const section of sections) {
    if (section.enabled === false) continue;
    const id = section._type ? SECTION_TYPE_TO_ID[section._type] : undefined;
    if (!id) continue;
    order.push(id);

    switch (section._type) {
      case "heroSection":
        next = {
          ...next,
          hero: {
            ...next.hero,
            eyebrow: str(section.eyebrow, next.hero.eyebrow),
            headline: str(section.headline, next.hero.headline),
            supporting: str(section.supporting, next.hero.supporting),
          },
        };
        break;
      case "whoWeAreSection":
        next = {
          ...next,
          whoWeAre: {
            ...next.whoWeAre,
            title: str(section.title, next.whoWeAre.title),
            body: str(section.body, next.whoWeAre.body),
            credentials: Array.isArray(section.credentials)
              ? (section.credentials as string[]).filter(Boolean)
              : next.whoWeAre.credentials,
          },
        };
        break;
      case "missionVisionSection":
        next = {
          ...next,
          mission: {
            title: str(section.missionTitle, next.mission.title),
            body: str(section.missionBody, next.mission.body),
          },
          vision: {
            title: str(section.visionTitle, next.vision.title),
            body: str(section.visionBody, next.vision.body),
          },
        };
        break;
      case "valuesSection":
        next = {
          ...next,
          values: {
            title: str(section.title, next.values.title),
            intro: str(section.intro, next.values.intro),
            items: Array.isArray(section.items)
              ? (section.items as ValueItem[]).map((item, i) => ({
                  id: `value-${i}`,
                  title: item.title || "",
                  description: item.description || "",
                }))
              : next.values.items,
          },
        };
        break;
      case "servicesSection":
        next = {
          ...next,
          services: {
            ...next.services,
            title: str(section.title, next.services.title),
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
              : next.services.items,
          },
        };
        break;
      case "projectsSection":
        next = {
          ...next,
          projects: {
            ...next.projects,
            title: str(section.title, next.projects.title),
            intro: str(section.intro, next.projects.intro),
          },
        };
        break;
      case "recognitionSection":
        next = {
          ...next,
          recognition: {
            title: str(section.title, next.recognition.title),
            intro: str(section.intro, next.recognition.intro),
            items: Array.isArray(section.items)
              ? (section.items as CertificateItem[]).map((item, i) => ({
                  id: item.id || `cert-${i}`,
                  title: item.title || "",
                  issuer: item.issuer || "",
                  recipient: item.recipient || "",
                  summary: item.summary || "",
                  highlights: item.highlights || [],
                  image:
                    typeof item.image === "string"
                      ? item.image
                      : next.recognition.items[0]?.image ||
                        "/images/certificate-isspl-un-congo.jpg",
                  projectLabel: item.projectLabel,
                }))
              : next.recognition.items,
          },
        };
        break;
      case "contactSection":
        next = {
          ...next,
          contact: {
            title: str(section.title, next.contact.title),
            intro: str(section.intro, next.contact.intro),
          },
        };
        break;
      default:
        break;
    }
  }

  return {
    ...next,
    sectionOrder: order.length ? order : DEFAULT_SECTION_ORDER,
  };
}

/**
 * Prefer live Sanity content when documents exist; otherwise use seed.
 */
export async function getPageContent(language = "en"): Promise<SiteContent> {
  if (!hasSanityConfig()) return seedContent;

  try {
    const [settings, projects, home] = await Promise.all([
      client.fetch<SanitySettings | null>(siteSettingsQuery, { language }),
      client.fetch<SanityProject[] | null>(projectsQuery),
      client.fetch<SanityHomePage | null>(homePageQuery, { language }),
    ]);

    let content = applySettings(seedContent, settings);
    content = applyHomeSections(content, home);

    const mapped = mapProjects(projects);
    if (mapped?.length) {
      content = {
        ...content,
        projects: {
          ...content.projects,
          items: mapped,
        },
      };
    }
    return content;
  } catch (error) {
    console.error("[content] Sanity fetch failed, using seed", error);
    return seedContent;
  }
}
