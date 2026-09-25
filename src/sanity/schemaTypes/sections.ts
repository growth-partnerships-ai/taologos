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
    defineField({ name: "primaryCtaLabel", type: "string" }),
    defineField({ name: "primaryCtaHref", type: "string" }),
    defineField({ name: "secondaryCtaLabel", type: "string" }),
    defineField({ name: "secondaryCtaHref", type: "string" }),
  ],
  preview: {
    select: { title: "headline" },
    prepare: ({ title }) => ({ title: title || "Hero" }),
  },
});

export const whoWeAreSection = defineType({
  name: "whoWeAreSection",
  title: "Who we are",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string", initialValue: "Company" }),
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
    defineField({ name: "missionTitle", type: "string" }),
    defineField({ name: "missionBody", type: "text", rows: 4 }),
    defineField({ name: "visionTitle", type: "string" }),
    defineField({ name: "visionBody", type: "text", rows: 4 }),
  ],
});

export const valuesSection = defineType({
  name: "valuesSection",
  title: "Values",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({
      name: "eyebrow",
      type: "string",
      initialValue: "How we work",
    }),
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
    defineField({
      name: "eyebrow",
      type: "string",
      initialValue: "What we deliver",
    }),
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
    defineField({ name: "title", type: "string", initialValue: "Selected Projects" }),
    defineField({
      name: "locationLabel",
      title: "Location field label",
      type: "string",
      initialValue: "Location",
    }),
    defineField({
      name: "typeLabel",
      title: "Type field label",
      type: "string",
      initialValue: "Type",
    }),
    defineField({
      name: "scopeLabel",
      title: "Scope field label",
      type: "string",
      initialValue: "Scope",
    }),
    defineField({
      name: "projectSingular",
      title: "Singular project count word",
      type: "string",
      initialValue: "project",
    }),
    defineField({
      name: "projectPlural",
      title: "Plural project count word",
      type: "string",
      initialValue: "projects",
    }),
    defineField({
      name: "groups",
      title: "Project group headings",
      description:
        "Labels and blurbs for each portfolio group shown on the page.",
      type: "array",
      of: [defineArrayMember({ type: "projectGroupMeta" })],
    }),
    defineField({
      name: "projectRefs",
      title: "Projects to show (leave empty = all projects)",
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
    defineField({
      name: "eyebrow",
      type: "string",
      initialValue: "Get in touch",
    }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "formNameLabel",
      title: "Form — Name label",
      type: "string",
      initialValue: "Name",
    }),
    defineField({
      name: "formPhoneLabel",
      title: "Form — Phone label",
      type: "string",
      initialValue: "Phone",
    }),
    defineField({
      name: "formEmailLabel",
      title: "Form — Email label",
      type: "string",
      initialValue: "Email",
    }),
    defineField({
      name: "formMessageLabel",
      title: "Form — Message label",
      type: "string",
      initialValue: "Message",
    }),
    defineField({
      name: "formSubmitLabel",
      title: "Form — Submit button",
      type: "string",
      initialValue: "Send message",
    }),
    defineField({
      name: "formSendingLabel",
      title: "Form — Sending state",
      type: "string",
      initialValue: "Sending…",
    }),
    defineField({
      name: "formSuccessMessage",
      title: "Form — Success message",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "formErrorMessage",
      title: "Form — Error message",
      type: "text",
      rows: 2,
    }),
  ],
});

export const recognitionSection = defineType({
  name: "recognitionSection",
  title: "Recognition / certificates",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string", initialValue: "Trust" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({
      name: "presentedToLabel",
      title: "“Presented to” label",
      type: "string",
      initialValue: "Presented to",
    }),
    defineField({
      name: "items",
      type: "array",
      of: [defineArrayMember({ type: "certificateItem" })],
    }),
  ],
});

export const teamSection = defineType({
  name: "teamSection",
  title: "Team",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string", initialValue: "People" }),
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
            defineField({
              name: "photo",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({ name: "bio", type: "text", rows: 3 }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "photo" },
          },
        }),
      ],
    }),
  ],
});

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Image gallery",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "autoplay",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "images",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
    }),
  ],
});

export const clientsMarqueeSection = defineType({
  name: "clientsMarqueeSection",
  title: "Clients marquee",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "direction",
      type: "string",
      options: {
        list: [
          { title: "Right to left", value: "rtl" },
          { title: "Left to right", value: "ltr" },
        ],
      },
      initialValue: "rtl",
    }),
    defineField({
      name: "logos",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      options: { layout: "grid" },
    }),
  ],
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 2 }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", type: "text", rows: 3 }),
            defineField({ name: "name", type: "string" }),
            defineField({ name: "role", type: "string" }),
            defineField({ name: "company", type: "string" }),
            defineField({
              name: "photo",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: "name", subtitle: "company" } },
        }),
      ],
    }),
  ],
});

export const statsSection = defineType({
  name: "statsSection",
  title: "Stats",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "number", type: "string" }),
            defineField({ name: "label", type: "string" }),
            defineField({ name: "detail", type: "string" }),
          ],
          preview: { select: { title: "number", subtitle: "label" } },
        }),
      ],
    }),
  ],
});

export const simpleTextSection = defineType({
  name: "simpleTextSection",
  title: "Simple text",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "text", rows: 8 }),
  ],
});

export const imageTextSection = defineType({
  name: "imageTextSection",
  title: "Image + text",
  type: "object",
  fields: [
    ...sectionCommon,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "body", type: "text", rows: 6 }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "imagePosition",
      type: "string",
      options: {
        list: [
          { title: "Image left", value: "left" },
          { title: "Image right", value: "right" },
        ],
      },
      initialValue: "left",
    }),
  ],
});
