import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { MissionVision } from "@/components/sections/mission-vision";
import { Projects } from "@/components/sections/projects";
import { Recognition } from "@/components/sections/recognition";
import { Services } from "@/components/sections/services";
import { SiteFooter } from "@/components/sections/footer";
import { Values } from "@/components/sections/values";
import { WhoWeAre } from "@/components/sections/who-we-are";
import { SiteHeader } from "@/components/site-header";
import { getPageContent } from "@/lib/content/get-page-content";
import type { SectionId } from "@/lib/content/sections";
import type { SiteContent } from "@/lib/content/types";

function renderSection(id: SectionId, content: SiteContent) {
  switch (id) {
    case "hero":
      return (
        <Hero
          key={id}
          content={content.hero}
          tagline={content.brand.tagline}
          brandName={content.brand.name}
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
    case "contact":
      return (
        <Contact
          key={id}
          content={content.contact}
          contacts={content.contacts}
        />
      );
    case "team":
      return null;
    default:
      return null;
  }
}

export default async function HomePage() {
  const content = await getPageContent();

  return (
    <>
      <SiteHeader brandName={content.brand.name} />
      <main>
        {content.sectionOrder.map((id) => renderSection(id, content))}
      </main>
      <SiteFooter note={content.footer.note} tagline={content.brand.tagline} />
    </>
  );
}
