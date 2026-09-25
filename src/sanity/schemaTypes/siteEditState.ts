import { defineField, defineType } from "sanity";

/** Full-site JSON snapshot written by /edit (primary client CMS). */
export const siteEditState = defineType({
  name: "siteEditState",
  title: "Edit state (from /edit)",
  type: "document",
  fields: [
    defineField({
      name: "updatedAt",
      type: "datetime",
    }),
    defineField({
      name: "updatedBy",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Site content JSON",
      type: "text",
      rows: 20,
      description:
        "Managed by /edit. Prefer editing at /edit rather than changing this by hand.",
    }),
  ],
});
