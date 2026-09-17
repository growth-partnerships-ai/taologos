import { defineArrayMember, defineField, defineType } from "sanity";

const sectionCommon = [
  defineField({
    name: "enabled",
    type: "boolean",
    initialValue: true,
    description: "Turn this section on or off on the live page.",
  }),
];

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "headline", type: "string" }),
    defineField({ name: "supporting", type: "text", rows: 3 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
  preview: { select: { title: "headline" }, prepare: ({ title }) => ({ title: title || "Hero" }) },
});

export const whoWeAreSection = defineType({
  name: "whoWeAreSection",
  title: "Who we are",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "text", rows: 8 }),
    defineField({
      name: "credentials",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});

export const missionVisionSection = defineType({
  name: "missionVisionSection",
  title: "Mission & vision",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "missionTitle", type: "string", initialValue: "Mission" }),
    defineField({ name: "missionBody", type: "text", rows: 4 }),
    defineField({ name: "visionTitle", type: "string", initialValue: "Vision" }),
    defineField({ name: "visionBody", type: "text", rows: 4 }),
  ],
});

export const valuesSection = defineType({
  name: "valuesSection",
  title: "Values",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "valueItem" })],
    }),
  ],
});

export const servicesSection = defineType({
  name: "servicesSection",
  title: "Services",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "serviceItem" })],
    }),
  ],
});

export const projectsSection = defineType({
  name: "projectsSection",
  title: "Projects",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "projectRefs",
      title: "Projects to show",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })],
    }),
  ],
});

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
  ],
});

/** Available for later — not used on the live page in v1. */
export const teamSection = defineType({
  name: "teamSection",
  title: "Team (unused on page until enabled)",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "members",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "role", type: "string" }),
            defineField({ name: "photo", type: "image", options: { hotspot: true } }),
            defineField({ name: "bio", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "name", subtitle: "role" },
          },
        }),
      ],
    }),
  ],
});
