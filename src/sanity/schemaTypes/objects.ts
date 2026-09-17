import { defineField, defineType } from "sanity";

export const contactEntry = defineType({
  name: "contactEntry",
  title: "Contact entry",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "value", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string" }),
    defineField({
      name: "kind",
      type: "string",
      options: {
        list: [
          { title: "Phone", value: "phone" },
          { title: "Email", value: "email" },
          { title: "Address", value: "address" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "other",
    }),
  ],
});

export const valueItem = defineType({
  name: "valueItem",
  title: "Value",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
  ],
});

export const serviceItem = defineType({
  name: "serviceItem",
  title: "Service",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 4 }),
  ],
});

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  fields: [
    defineField({ name: "quote", type: "text", rows: 3 }),
    defineField({ name: "attribution", type: "string" }),
  ],
});

export const certificateItem = defineType({
  name: "certificateItem",
  title: "Certificate",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "issuer", type: "string" }),
    defineField({ name: "recipient", type: "string" }),
    defineField({ name: "projectLabel", type: "string" }),
    defineField({ name: "summary", type: "text", rows: 4 }),
    defineField({
      name: "highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "image", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    select: { title: "title", subtitle: "issuer", media: "image" },
  },
});
