import type {
  ContactData,
  GalleryData,
  ClientsMarqueeData,
  HeroData,
  ImageTextData,
  MissionVisionData,
  PageSection,
  ProjectsData,
  RecognitionData,
  ServicesData,
  SimpleTextData,
  StatsData,
  TeamData,
  TestimonialsData,
  ValuesData,
  WhoWeAreData,
} from "./types";
import type { SectionType } from "./sections";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createSectionDefaults(type: SectionType): PageSection {
  switch (type) {
    case "hero":
      return {
        key: uid("hero"),
        type: "hero",
        enabled: true,
        data: {
          eyebrow: "Company profile",
          headline: "Your Vision, Our Construction",
          supporting: "Add a short supporting line about the company.",
          image: "/images/hero-cover.jpg",
          primaryCtaLabel: "View projects",
          primaryCtaHref: "#projects",
          secondaryCtaLabel: "Contact us",
          secondaryCtaHref: "#contact",
        } satisfies HeroData,
      };
    case "whoWeAre":
      return {
        key: uid("who"),
        type: "whoWeAre",
        enabled: true,
        data: {
          eyebrow: "Company",
          title: "Who we are",
          body: "Tell visitors who you are and what you build.",
          credentials: ["Credential one", "Credential two"],
        } satisfies WhoWeAreData,
      };
    case "missionVision":
      return {
        key: uid("mv"),
        type: "missionVision",
        enabled: true,
        data: {
          missionTitle: "Mission",
          missionBody: "Write your mission here.",
          visionTitle: "Vision",
          visionBody: "Write your vision here.",
        } satisfies MissionVisionData,
      };
    case "values":
      return {
        key: uid("values"),
        type: "values",
        enabled: true,
        data: {
          eyebrow: "How we work",
          title: "Values",
          intro: "Short intro for your values.",
          items: [
            {
              id: uid("value"),
              title: "New value",
              description: "Describe this value.",
            },
          ],
        } satisfies ValuesData,
      };
    case "services":
      return {
        key: uid("services"),
        type: "services",
        enabled: true,
        data: {
          eyebrow: "What we deliver",
          title: "Services",
          image: "/images/services-bg.jpg",
          items: [
            {
              id: uid("service"),
              title: "New service",
              description: "Describe this service.",
            },
          ],
        } satisfies ServicesData,
      };
    case "projects":
      return {
        key: uid("projects"),
        type: "projects",
        enabled: true,
        data: {
          title: "Selected Projects",
          locationLabel: "Location",
          typeLabel: "Type",
          scopeLabel: "Scope",
          projectSingular: "project",
          projectPlural: "projects",
          groups: [],
          projectIds: [],
          items: [],
        } satisfies ProjectsData,
      };
    case "recognition":
      return {
        key: uid("recognition"),
        type: "recognition",
        enabled: true,
        data: {
          eyebrow: "Trust",
          title: "Recognition",
          intro: "Certificates and appreciation.",
          presentedToLabel: "Presented to",
          items: [],
        } satisfies RecognitionData,
      };
    case "team":
      return {
        key: uid("team"),
        type: "team",
        enabled: true,
        data: {
          eyebrow: "People",
          title: "Team",
          intro: "Meet the team.",
          members: [],
        } satisfies TeamData,
      };
    case "contact":
      return {
        key: uid("contact"),
        type: "contact",
        enabled: true,
        data: {
          eyebrow: "Get in touch",
          title: "Contact",
          intro: "Tell us about your project.",
          formNameLabel: "Name",
          formPhoneLabel: "Phone",
          formEmailLabel: "Email",
          formMessageLabel: "Message",
          formSubmitLabel: "Send message",
          formSendingLabel: "Sending…",
          formSuccessMessage:
            "Thank you — we received your message and will follow up soon.",
          formErrorMessage: "Could not send message. Please call us instead.",
        } satisfies ContactData,
      };
    case "gallery":
      return {
        key: uid("gallery"),
        type: "gallery",
        enabled: true,
        data: {
          eyebrow: "Gallery",
          title: "Project photos",
          autoplay: true,
          images: [],
        } satisfies GalleryData,
      };
    case "clientsMarquee":
      return {
        key: uid("clients"),
        type: "clientsMarquee",
        enabled: true,
        data: {
          eyebrow: "Clients",
          title: "Companies we’ve worked with",
          direction: "rtl",
          logos: [],
        } satisfies ClientsMarqueeData,
      };
    case "testimonials":
      return {
        key: uid("testimonials"),
        type: "testimonials",
        enabled: true,
        data: {
          eyebrow: "Voices",
          title: "Testimonials",
          intro: "What clients say about working with us.",
          items: [],
        } satisfies TestimonialsData,
      };
    case "stats":
      return {
        key: uid("stats"),
        type: "stats",
        enabled: true,
        data: {
          eyebrow: "Numbers",
          title: "At a glance",
          items: [
            {
              id: uid("stat"),
              number: "0+",
              label: "Label",
              detail: "Optional detail",
            },
          ],
        } satisfies StatsData,
      };
    case "simpleText":
      return {
        key: uid("text"),
        type: "simpleText",
        enabled: true,
        data: {
          eyebrow: "",
          title: "New section",
          body: "Add your text here.",
        } satisfies SimpleTextData,
      };
    case "imageText":
      return {
        key: uid("imagetext"),
        type: "imageText",
        enabled: true,
        data: {
          eyebrow: "",
          title: "New section",
          body: "Add your text here.",
          image: "/images/hero-cover.jpg",
          imagePosition: "left",
        } satisfies ImageTextData,
      };
    default: {
      const _exhaustive: never = type;
      return _exhaustive;
    }
  }
}

export function findHeroImage(sections: PageSection[]) {
  const hero = sections.find((s) => s.type === "hero" && s.enabled);
  return hero?.type === "hero" ? hero.data.image : "/images/hero-cover.jpg";
}
