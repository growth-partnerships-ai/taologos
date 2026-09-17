import { client } from "@/lib/sanity/client";
import { hasSanityConfig } from "@/lib/sanity/env";
import {
  homePageQuery,
  projectsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { seedContent } from "./seed";
import type {
  ContactEntry,
  ProjectGroup,
  ProjectItem,
  SiteContent,
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

/**
 * Prefer live Sanity content when documents exist; otherwise use seed.
 * Homepage section blocks in Studio can be filled gradually — seed fills gaps.
 */
export async function getPageContent(
  language = "en",
): Promise<SiteContent> {
  if (!hasSanityConfig()) return seedContent;

  try {
    const [settings, projects] = await Promise.all([
      client.fetch<SanitySettings | null>(siteSettingsQuery, { language }),
      client.fetch<SanityProject[] | null>(projectsQuery),
    ]);

    // Touch homePage so empty Studio still "connects"; sections overlay can come later.
    await client.fetch(homePageQuery, { language }).catch(() => null);

    let content = applySettings(seedContent, settings);
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
