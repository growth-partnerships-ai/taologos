import { defineField, defineType } from "sanity";

/**
 * /edit login accounts. Passwords are stored as bcrypt hashes only.
 * Not shown on the public site — Studio list is for admins who use Studio.
 */
export const cmsUser = defineType({
  name: "cmsUser",
  title: "CMS user (/edit login)",
  type: "document",
  fields: [
    defineField({
      name: "email",
      type: "string",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "role",
      type: "string",
      options: {
        list: [
          { title: "Superadmin", value: "superadmin" },
          { title: "Admin", value: "admin" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "passwordHash",
      title: "Password hash (bcrypt — do not edit by hand)",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "mustChangePassword",
      title: "Must change password on next login",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "role" },
  },
});
