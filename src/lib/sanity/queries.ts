export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  brandName,
  legalName,
  tagline,
  contacts[]{label, value, href, kind},
  seoTitle,
  seoDescription,
  footerNote
}`;

export const projectsQuery = `*[_type == "project"] | order(number asc){
  _id,
  number,
  title,
  client,
  typology,
  location,
  scope,
  group,
  featured,
  "image": images[0].asset->url,
  testimonial
}`;

export const homePageQuery = `*[_id == "homePage"][0]{
  sections[]{
    _type,
    enabled,
    eyebrow,
    headline,
    supporting,
    title,
    body,
    credentials,
    missionTitle,
    missionBody,
    visionTitle,
    visionBody,
    intro,
    items,
    projectLabel,
    issuer,
    recipient,
    summary,
    highlights
  }
}`;
