export type SectionId =
  | "hero"
  | "whoWeAre"
  | "missionVision"
  | "values"
  | "services"
  | "projects"
  | "recognition"
  | "contact"
  | "team";

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "hero",
  "whoWeAre",
  "missionVision",
  "values",
  "services",
  "projects",
  "recognition",
  "contact",
];

export const SECTION_TYPE_TO_ID: Record<string, SectionId> = {
  heroSection: "hero",
  whoWeAreSection: "whoWeAre",
  missionVisionSection: "missionVision",
  valuesSection: "values",
  servicesSection: "services",
  projectsSection: "projects",
  recognitionSection: "recognition",
  contactSection: "contact",
  teamSection: "team",
};
