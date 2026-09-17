export const siteSettingsQuery = `*[_type == "siteSettings" && language == $language][0]{
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

export const homePageQuery = `*[_type == "homePage" && language == $language][0]{
  sections[]{
    _type,
    enabled,
    ...,
  }
}`;
