import { Contact } from "@/components/sections/contact";
import { ClientsMarquee } from "@/components/sections/clients-marquee";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { ImageText } from "@/components/sections/image-text";
import { MissionVision } from "@/components/sections/mission-vision";
import { Projects } from "@/components/sections/projects";
import { Recognition } from "@/components/sections/recognition";
import { Services } from "@/components/sections/services";
import { SimpleText } from "@/components/sections/simple-text";
import { SiteFooter } from "@/components/sections/footer";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { Testimonials } from "@/components/sections/testimonials";
import { Values } from "@/components/sections/values";
import { WhoWeAre } from "@/components/sections/who-we-are";
import { SiteHeader } from "@/components/site-header";
import { getPageContent } from "@/lib/content/get-page-content";
import type { PageSection, SiteContent } from "@/lib/content/types";

/** CMS-driven — always render from current Sanity /edit snapshot */
export const dynamic = "force-dynamic";

function renderSection(
  section: PageSection,
  content: SiteContent,
) {
  if (!section.enabled) return null;

  switch (section.type) {
    case "hero":
      return (
        <Hero
          key={section.key}
          content={section.data}
          tagline={content.brand.tagline}
          brandName={content.brand.name}
          brandSubtitle={content.brand.subtitle}
        />
      );
    case "whoWeAre":
      return <WhoWeAre key={section.key} content={section.data} />;
    case "missionVision":
      return (
        <MissionVision
          key={section.key}
          mission={{
            title: section.data.missionTitle,
            body: section.data.missionBody,
          }}
          vision={{
            title: section.data.visionTitle,
            body: section.data.visionBody,
          }}
        />
      );
    case "values":
      return <Values key={section.key} content={section.data} />;
    case "services":
      return <Services key={section.key} content={section.data} />;
    case "projects":
      return <Projects key={section.key} content={section.data} />;
    case "recognition":
      return <Recognition key={section.key} content={section.data} />;
    case "team":
      return <Team key={section.key} content={section.data} />;
    case "contact":
      return (
        <Contact
          key={section.key}
          content={section.data}
          contacts={content.contacts}
        />
      );
    case "gallery":
      return <Gallery key={section.key} content={section.data} />;
    case "clientsMarquee":
      return <ClientsMarquee key={section.key} content={section.data} />;
    case "testimonials":
      return <Testimonials key={section.key} content={section.data} />;
    case "stats":
      return <Stats key={section.key} content={section.data} />;
    case "simpleText":
      return <SimpleText key={section.key} content={section.data} />;
    case "imageText":
      return <ImageText key={section.key} content={section.data} />;
    default:
      return null;
  }
}

export default async function HomePage() {
  const content = await getPageContent();

  return (
    <>
      <a href="#who-we-are" className="sr-only">
        {content.a11y.skipToContent}
      </a>
      <SiteHeader
        brandName={content.brand.name}
        brandSubtitle={content.brand.subtitle}
        logo={content.brand.logo}
        nav={content.nav}
        a11y={content.a11y}
      />
      <main>
        {content.sections.map((section) => renderSection(section, content))}
      </main>
      <SiteFooter note={content.footer.note} tagline={content.brand.tagline} />
    </>
  );
}
