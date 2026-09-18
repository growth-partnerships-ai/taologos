import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { MissionVision } from "@/components/sections/mission-vision";
import { Projects } from "@/components/sections/projects";
import { Recognition } from "@/components/sections/recognition";
import { Services } from "@/components/sections/services";
import { SiteFooter } from "@/components/sections/footer";
import { Team } from "@/components/sections/team";
import { Values } from "@/components/sections/values";
import { WhoWeAre } from "@/components/sections/who-we-are";
import { SiteHeader } from "@/components/site-header";
import { getPageContent } from "@/lib/content/get-page-content";
import type { SectionId } from "@/lib/content/sections";
import type { SiteContent } from "@/lib/content/types";

/** Refresh CMS content periodically */
export const revalidate = 30;

function renderSection(id: SectionId, content: SiteContent) {
  switch (id) {
    case "hero":
      return (
        <Hero
          key={id}
          content={content.hero}
          tagline={content.brand.tagline}
          brandName={content.brand.name}
          brandSubtitle={content.brand.subtitle}
        />
      );
    case "whoWeAre":
      return <WhoWeAre key={id} content={content.whoWeAre} />;
    case "missionVision":
      return (
        <MissionVision
          key={id}
          mission={content.mission}
          vision={content.vision}
        />
      );
    case "values":
      return <Values key={id} content={content.values} />;
    case "services":
      return <Services key={id} content={content.services} />;
    case "projects":
      return <Projects key={id} content={content.projects} />;
    case "recognition":
      return <Recognition key={id} content={content.recognition} />;
    case "team":
      return <Team key={id} content={content.team} />;
    case "contact":
      return (
        <Contact
          key={id}
          content={content.contact}
          contacts={content.contacts}
        />
      );
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
        {content.sectionOrder.map((id) => renderSection(id, content))}
      </main>
      <SiteFooter note={content.footer.note} tagline={content.brand.tagline} />
    </>
  );
}
