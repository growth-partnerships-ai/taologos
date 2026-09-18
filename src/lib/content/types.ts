import { DEFAULT_SECTION_ORDER, type SectionId } from "./sections";

export type ProjectGroup =
  | "apartment"
  | "residential"
  | "interior"
  | "institutional";

export type ContactEntry = {
  id: string;
  label: string;
  value: string;
  href?: string;
  kind: "phone" | "email" | "address" | "other";
};

export type NavLink = {
  id: string;
  label: string;
  href: string;
};

export type ValueItem = {
  id: string;
  title: string;
  description: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
};

export type ProjectItem = {
  id: string;
  number: string;
  title: string;
  client: string;
  typology: string;
  location: string;
  scope: string;
  group: ProjectGroup;
  image: string;
  testimonial?: {
    quote: string;
    attribution: string;
  };
  featured?: boolean;
};

export type CertificateItem = {
  id: string;
  title: string;
  issuer: string;
  recipient: string;
  summary: string;
  highlights: string[];
  image: string;
  projectLabel?: string;
};

export type SiteContent = {
  brand: {
    name: string;
    legalName: string;
    tagline: string;
    subtitle: string;
    logo: string;
  };
  seo: {
    title: string;
    description: string;
  };
  nav: {
    links: NavLink[];
    ctaLabel: string;
    ctaHref: string;
  };
  contacts: ContactEntry[];
  hero: {
    eyebrow: string;
    headline: string;
    supporting: string;
    image: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  whoWeAre: {
    title: string;
    body: string;
    credentials: string[];
  };
  mission: {
    title: string;
    body: string;
  };
  vision: {
    title: string;
    body: string;
  };
  values: {
    title: string;
    intro: string;
    items: ValueItem[];
  };
  services: {
    title: string;
    image: string;
    items: ServiceItem[];
  };
  projects: {
    title: string;
    intro: string;
    items: ProjectItem[];
  };
  recognition: {
    title: string;
    intro: string;
    items: CertificateItem[];
  };
  team: {
    title: string;
    intro: string;
    members: TeamMember[];
  };
  contact: {
    title: string;
    intro: string;
  };
  footer: {
    note: string;
  };
  sectionOrder: SectionId[];
};

export const PROJECT_GROUP_META: Record<
  ProjectGroup,
  { label: string; blurb: string }
> = {
  apartment: {
    label: "Apartment & cooperative",
    blurb: "Multi-storey frames delivered from excavation through finishing.",
  },
  residential: {
    label: "Residential builds",
    blurb: "Private G+ homes across Addis Ababa and Sheger City.",
  },
  interior: {
    label: "Interior & renovation",
    blurb: "Fit-out, finishing, and office renewal with precise craft.",
  },
  institutional: {
    label: "Institutional & special works",
    blurb: "Maintenance and works for trusted institutional clients.",
  },
};

export { DEFAULT_SECTION_ORDER };
