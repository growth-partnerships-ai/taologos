import { DEFAULT_SECTION_ORDER, type SectionId, type SectionType } from "./sections";

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

/** Free-form category id (decision 40A). */
export type ProjectGroupId = string;

export type ProjectItem = {
  id: string;
  number: string;
  title: string;
  client: string;
  typology: string;
  location: string;
  scope: string;
  group: ProjectGroupId;
  image: string;
  images?: string[];
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
  id: ProjectGroupId;
  label: string;
  blurb: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt?: string;
};

export type ClientLogo = {
  id: string;
  image: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role?: string;
  company?: string;
  photo?: string;
};

export type StatItem = {
  id: string;
  number: string;
  label: string;
  detail?: string;
};

export type HeroData = {
  eyebrow: string;
  headline: string;
  supporting: string;
  image: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export type WhoWeAreData = {
  eyebrow: string;
  title: string;
  body: string;
  credentials: string[];
};

export type MissionVisionData = {
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
};

export type ValuesData = {
  eyebrow: string;
  title: string;
  intro: string;
  items: ValueItem[];
};

export type ServicesData = {
  eyebrow: string;
  title: string;
  image: string;
  items: ServiceItem[];
};

export type ProjectsData = {
  title: string;
  locationLabel: string;
  typeLabel: string;
  scopeLabel: string;
  projectSingular: string;
  projectPlural: string;
  groups: ProjectGroupMeta[];
  /** Project document ids or inline items when seeded */
  projectIds: string[];
  items: ProjectItem[];
};

export type RecognitionData = {
  eyebrow: string;
  title: string;
  intro: string;
  presentedToLabel: string;
  items: CertificateItem[];
};

export type TeamData = {
  eyebrow: string;
  title: string;
  intro: string;
  members: TeamMember[];
};

export type ContactData = {
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

export type GalleryData = {
  eyebrow: string;
  title: string;
  images: GalleryImage[];
  autoplay: boolean;
};

export type ClientsMarqueeData = {
  eyebrow: string;
  title: string;
  /** rtl = right-to-left (typical marquee), ltr = left-to-right */
  direction: "rtl" | "ltr";
  logos: ClientLogo[];
};

export type TestimonialsData = {
  eyebrow: string;
  title: string;
  intro: string;
  items: TestimonialItem[];
};

export type StatsData = {
  eyebrow: string;
  title: string;
  items: StatItem[];
};

export type SimpleTextData = {
  eyebrow: string;
  title: string;
  body: string;
};

export type ImageTextData = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  /** default left — decision 62C */
  imagePosition: "left" | "right";
};

export type PageSection =
  | { key: string; type: "hero"; enabled: boolean; data: HeroData }
  | { key: string; type: "whoWeAre"; enabled: boolean; data: WhoWeAreData }
  | {
      key: string;
      type: "missionVision";
      enabled: boolean;
      data: MissionVisionData;
    }
  | { key: string; type: "values"; enabled: boolean; data: ValuesData }
  | { key: string; type: "services"; enabled: boolean; data: ServicesData }
  | { key: string; type: "projects"; enabled: boolean; data: ProjectsData }
  | {
      key: string;
      type: "recognition";
      enabled: boolean;
      data: RecognitionData;
    }
  | { key: string; type: "team"; enabled: boolean; data: TeamData }
  | { key: string; type: "contact"; enabled: boolean; data: ContactData }
  | { key: string; type: "gallery"; enabled: boolean; data: GalleryData }
  | {
      key: string;
      type: "clientsMarquee";
      enabled: boolean;
      data: ClientsMarqueeData;
    }
  | {
      key: string;
      type: "testimonials";
      enabled: boolean;
      data: TestimonialsData;
    }
  | { key: string; type: "stats"; enabled: boolean; data: StatsData }
  | { key: string; type: "simpleText"; enabled: boolean; data: SimpleTextData }
  | { key: string; type: "imageText"; enabled: boolean; data: ImageTextData };

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
  footer: {
    note: string;
  };
  a11y: {
    skipToContent: string;
    primaryNavLabel: string;
    mobileNavLabel: string;
  };
  /** Ordered page body sections (header/footer are separate). */
  sections: PageSection[];
};

/** @deprecated Prefer sections[]. Kept for gradual migration helpers. */
export type LegacySectionId = SectionId;

export { DEFAULT_SECTION_ORDER };
export type { SectionId, SectionType };
