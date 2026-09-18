import {
  certificateItem,
  contactEntry,
  projectGroupMeta,
  serviceItem,
  testimonial,
  valueItem,
} from "./objects";
import {
  contactSection,
  heroSection,
  missionVisionSection,
  projectsSection,
  recognitionSection,
  servicesSection,
  teamSection,
  valuesSection,
  whoWeAreSection,
} from "./sections";
import { homePage, project, siteSettings } from "./documents";

export const schemaTypes = [
  siteSettings,
  homePage,
  project,
  contactEntry,
  valueItem,
  serviceItem,
  testimonial,
  certificateItem,
  projectGroupMeta,
  heroSection,
  whoWeAreSection,
  missionVisionSection,
  valuesSection,
  servicesSection,
  projectsSection,
  recognitionSection,
  contactSection,
  teamSection,
];
