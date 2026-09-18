import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "language",
      type: "string",
      initialValue: "en",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Amharic", value: "am" },
        ],
      },
    }),
    defineField({ name: "brandName", type: "string", initialValue: "TAOLOGOS" }),
    defineField({
      name: "brandSubtitle",
      title: "Brand subtitle under name",
      type: "string",
      initialValue: "CONSTRUCTION",
    }),
    defineField({
      name: "legalName",
      type: "string",
      initialValue: "Taologos Construction",
    }),
    defineField({
      name: "tagline",
      type: "string",
      initialValue: "Your Vision, Our Construction",
    }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "navLinks",
      title: "Header navigation",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "navCtaLabel",
      type: "string",
      initialValue: "Contact us",
    }),
    defineField({
      name: "navCtaHref",
      type: "string",
      initialValue: "#contact",
    }),
    defineField({
      name: "contacts",
      type: "array",
      of: [defineArrayMember({ type: "contactEntry" })],
    }),
    defineField({ name: "seoTitle", type: "string" }),
    defineField({ name: "seoDescription", type: "text", rows: 3 }),
    defineField({ name: "footerNote", type: "string" }),
  ],
  preview: {
    select: { title: "brandName", subtitle: "tagline" },
  },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "number", type: "string" }),
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "client", type: "string" }),
    defineField({ name: "typology", type: "string" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "scope", type: "text", rows: 3 }),
    defineField({
      name: "group",
      type: "string",
      options: {
        list: [
          { title: "Apartment & cooperative", value: "apartment" },
          { title: "Residential", value: "residential" },
          { title: "Interior & renovation", value: "interior" },
          { title: "Institutional", value: "institutional" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
    }),
    defineField({ name: "testimonial", type: "testimonial" }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", subtitle: "client", media: "images.0" },
  },
});

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "language",
      type: "string",
      initialValue: "en",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Amharic", value: "am" },
        ],
      },
    }),
    defineField({ name: "title", type: "string", initialValue: "Home" }),
    defineField({
      name: "sections",
      title: "Page sections (everything on the homepage)",
      description:
        "Every visible block on the site. Add, remove, reorder, or disable. Edit all text/images inside each section. Publish to update the live page.",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "whoWeAreSection" }),
        defineArrayMember({ type: "missionVisionSection" }),
        defineArrayMember({ type: "valuesSection" }),
        defineArrayMember({ type: "servicesSection" }),
        defineArrayMember({ type: "projectsSection" }),
        defineArrayMember({ type: "recognitionSection" }),
        defineArrayMember({ type: "teamSection" }),
        defineArrayMember({ type: "contactSection" }),
      ],
    }),
  ],
});
