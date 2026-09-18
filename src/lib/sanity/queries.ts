const imageUrl = `"imageUrl": image.asset->url`;
const photoUrl = `"photoUrl": photo.asset->url`;

export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  brandName,
  brandSubtitle,
  legalName,
  tagline,
  "logoUrl": logo.asset->url,
  navLinks[]{label, href},
  navCtaLabel,
  navCtaHref,
  menuOpenLabel,
  menuCloseLabel,
  contacts[]{label, value, href, kind},
  seoTitle,
  seoDescription,
  footerNote,
  skipToContent,
  primaryNavLabel,
  mobileNavLabel
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
    ${imageUrl},
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
    title,
    body,
    credentials,
    missionTitle,
    missionBody,
    visionTitle,
    visionBody,
    intro,
    locationLabel,
    typeLabel,
    scopeLabel,
    projectSingular,
    projectPlural,
    groups[]{id, label, blurb},
    presentedToLabel,
    formNameLabel,
    formPhoneLabel,
    formEmailLabel,
    formMessageLabel,
    formSubmitLabel,
    formSendingLabel,
    formSuccessMessage,
    formErrorMessage,
    items[]{
      ...,
      ${imageUrl},
      ${photoUrl},
      "imageUrl": image.asset->url
    },
    members[]{
      name,
      role,
      bio,
      ${photoUrl}
    },
    projectRefs[]->{
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
    }
  }
}`;
