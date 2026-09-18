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
  NavLink,
  ProjectGroup,
  ProjectItem,
  SiteContent,
  TeamMember,
  ValueItem,
} from "./types";

type SanitySettings = {
  brandName?: string;
  brandSubtitle?: string;
  legalName?: string;
  tagline?: string;
  logoUrl?: string | null;
  navLinks?: Array<{ label?: string; href?: string }>;
  navCtaLabel?: string;
  navCtaHref?: string;
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
  imageUrl?: string | null;
  projectRefs?: SanityProject[] | null;
  members?: Array<{
    name?: string;
    role?: string;
    bio?: string;
    photoUrl?: string | null;
  }>;
  items?: unknown;
  [key: string]: unknown;
};

type SanityHomePage = {
  sections?: SanitySection[] | null;
};

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

function str(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
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
      logo: settings.logoUrl || content.brand.logo,
    },
    nav: {
      links: navLinks,
      ctaLabel: settings.navCtaLabel || content.nav.ctaLabel,
      ctaHref: settings.navCtaHref || content.nav.ctaHref,
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

function applyHomeSections(
  content: SiteContent,
  home: SanityHomePage | null,
  allProjects: ProjectItem[],
): SiteContent {
  const sections = home?.sections;
  if (!sections?.length) {
    return {
      ...content,
      sectionOrder: DEFAULT_SECTION_ORDER,
      projects: {
        ...content.projects,
        items: allProjects.length ? allProjects : content.projects.items,
      },
    };
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
            image: str(section.imageUrl, next.hero.image),
            primaryCtaLabel: str(
              section.primaryCtaLabel,
              next.hero.primaryCtaLabel,
            ),
            primaryCtaHref: str(
              section.primaryCtaHref,
              next.hero.primaryCtaHref,
            ),
            secondaryCtaLabel: str(
              section.secondaryCtaLabel,
              next.hero.secondaryCtaLabel,
            ),
            secondaryCtaHref: str(
              section.secondaryCtaHref,
              next.hero.secondaryCtaHref,
            ),
          },
        };
        break;
      case "whoWeAreSection":
        next = {
          ...next,
          whoWeAre: {
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
            title: str(section.title, next.services.title),
            image: str(section.imageUrl, next.services.image),
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
      case "projectsSection": {
        const selected = mapProjects(section.projectRefs);
        next = {
          ...next,
          projects: {
            title: str(section.title, next.projects.title),
            intro: str(section.intro, next.projects.intro),
            items: selected.length
              ? selected
              : allProjects.length
                ? allProjects
                : next.projects.items,
          },
        };
        break;
      }
      case "recognitionSection":
        next = {
          ...next,
          recognition: {
            title: str(section.title, next.recognition.title),
            intro: str(section.intro, next.recognition.intro),
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
                    next.recognition.items[0]?.image ||
                    "/images/certificate-isspl-un-congo.jpg",
                  projectLabel: item.projectLabel,
                }))
              : next.recognition.items,
          },
        };
        break;
      case "teamSection":
        next = {
          ...next,
          team: {
            title: str(section.title, next.team.title),
            intro: str(section.intro, next.team.intro),
            members: Array.isArray(section.members)
              ? section.members
                  .filter((m) => m.name)
                  .map(
                    (m, i): TeamMember => ({
                      id: `member-${i}`,
                      name: m.name!,
                      role: m.role || "",
                      bio: m.bio,
                      photo: m.photoUrl || undefined,
                    }),
                  )
              : next.team.members,
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

export async function getPageContent(language = "en"): Promise<SiteContent> {
  void language;
  if (!hasSanityConfig()) return seedContent;

  try {
    const [settings, projects, home] = await Promise.all([
      client.fetch<SanitySettings | null>(siteSettingsQuery),
      client.fetch<SanityProject[] | null>(projectsQuery),
      client.fetch<SanityHomePage | null>(homePageQuery),
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
