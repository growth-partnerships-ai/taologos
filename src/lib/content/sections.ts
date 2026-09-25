export type SectionType =
  | "hero"
  | "whoWeAre"
  | "missionVision"
  | "values"
  | "services"
  | "projects"
  | "recognition"
  | "contact"
  | "team"
  | "gallery"
  | "clientsMarquee"
  | "testimonials"
  | "stats"
  | "simpleText"
  | "imageText";

/** @deprecated use SectionType */
export type SectionId = SectionType;

export const DEFAULT_SECTION_ORDER: SectionType[] = [
  "hero",
  "whoWeAre",
  "missionVision",
  "values",
  "services",
  "projects",
  "recognition",
  "contact",
];

export const SECTION_TYPE_TO_ID: Record<string, SectionType> = {
  heroSection: "hero",
  whoWeAreSection: "whoWeAre",
  missionVisionSection: "missionVision",
  valuesSection: "values",
  servicesSection: "services",
  projectsSection: "projects",
  recognitionSection: "recognition",
  contactSection: "contact",
  teamSection: "team",
  gallerySection: "gallery",
  clientsMarqueeSection: "clientsMarquee",
  testimonialsSection: "testimonials",
  statsSection: "stats",
  simpleTextSection: "simpleText",
  imageTextSection: "imageText",
};

export const SECTION_ID_TO_SANITY_TYPE: Record<SectionType, string> = {
  hero: "heroSection",
  whoWeAre: "whoWeAreSection",
  missionVision: "missionVisionSection",
  values: "valuesSection",
  services: "servicesSection",
  projects: "projectsSection",
  recognition: "recognitionSection",
  contact: "contactSection",
  team: "teamSection",
  gallery: "gallerySection",
  clientsMarquee: "clientsMarqueeSection",
  testimonials: "testimonialsSection",
  stats: "statsSection",
  simpleText: "simpleTextSection",
  imageText: "imageTextSection",
};

export type SectionTemplate = {
  type: SectionType;
  name: string;
  description: string;
  /** Decision 48C */
  singleton?: boolean;
};

/** Final picker list (decisions 50 + removals). */
export const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    type: "hero",
    name: "Hero",
    description: "Full-bleed image, headline, and two buttons",
    singleton: true,
  },
  {
    type: "whoWeAre",
    name: "Who we are",
    description: "Company story and credential lines",
  },
  {
    type: "missionVision",
    name: "Mission & vision",
    description: "Two columns for mission and vision",
  },
  {
    type: "values",
    name: "Values",
    description: "Grid of value cards",
  },
  {
    type: "services",
    name: "Services",
    description: "Services over a background image",
  },
  {
    type: "projects",
    name: "Projects",
    description: "Selected Projects with categories",
  },
  {
    type: "recognition",
    name: "Recognition",
    description: "Certificates and awards",
  },
  {
    type: "team",
    name: "Team",
    description: "People cards",
  },
  {
    type: "contact",
    name: "Contact",
    description: "Contact details and form labels",
  },
  {
    type: "gallery",
    name: "Image gallery",
    description: "Slideshow with auto-play and arrows",
  },
  {
    type: "clientsMarquee",
    name: "Clients marquee",
    description: "Client logos sliding across the page",
  },
  {
    type: "testimonials",
    name: "Testimonials",
    description: "Quote cards with optional photos",
  },
  {
    type: "stats",
    name: "Stats",
    description: "Numbers with labels and a short detail line",
  },
  {
    type: "simpleText",
    name: "Simple text",
    description: "Title and paragraph",
  },
  {
    type: "imageText",
    name: "Image + text",
    description: "Photo beside copy (left or right)",
  },
];
