import type { StructureResolver } from "sanity/structure";

/**
 * Left sidebar of /studio — power users only.
 * Clients should use /edit instead.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Edit the website")
    .items([
      S.listItem()
        .title("Site settings (contacts, SEO)")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
      S.listItem()
        .title("Home page — add / remove sections")
        .id("homePage")
        .child(
          S.document()
            .schemaType("homePage")
            .documentId("homePage")
            .title("Home page sections"),
        ),
      S.divider(),
      S.listItem()
        .title("Projects")
        .schemaType("project")
        .child(S.documentTypeList("project").title("All projects")),
      S.divider(),
      S.listItem()
        .title("CMS users (/edit logins)")
        .schemaType("cmsUser")
        .child(S.documentTypeList("cmsUser").title("CMS users")),
    ]);
