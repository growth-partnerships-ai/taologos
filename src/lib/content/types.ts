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

export type ProjectGroupMeta = {
  id: ProjectGroup;
  label: string;
  blurb: string;
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
    menuOpenLabel: string;
    menuCloseLabel: string;
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
    eyebrow: string;
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
    eyebrow: string;
    title: string;
    intro: string;
    items: ValueItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    image: string;
    items: ServiceItem[];
  };
  projects: {
    eyebrow: string;
    title: string;
    intro: string;
    locationLabel: string;
    typeLabel: string;
    scopeLabel: string;
    projectSingular: string;
    projectPlural: string;
    groups: ProjectGroupMeta[];
    items: ProjectItem[];
  };
  recognition: {
    eyebrow: string;
    title: string;
    intro: string;
    presentedToLabel: string;
    items: CertificateItem[];
  };
  team: {
    eyebrow: string;
    title: string;
    intro: string;
    members: TeamMember[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    formNameLabel: string;
    formPhoneLabel: string;
    formEmailLabel: string;
    formMessageLabel: string;
    formSubmitLabel: string;
    formSendingLabel: string;
    formSuccessMessage: string;
    formErrorMessage: string;
  };
  footer: {
    note: string;
  };
  a11y: {
    skipToContent: string;
    primaryNavLabel: string;
    mobileNavLabel: string;
  };
  sectionOrder: SectionId[];
};

export { DEFAULT_SECTION_ORDER };
export type { SectionId };
