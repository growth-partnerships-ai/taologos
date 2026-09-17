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

export default async function HomePage() {
  const content = await getPageContent();

  return (
    <>
      <SiteHeader brandName={content.brand.name} />
      <main>
        <Hero
          content={content.hero}
          tagline={content.brand.tagline}
          brandName={content.brand.name}
        />
        <WhoWeAre content={content.whoWeAre} />
        <MissionVision mission={content.mission} vision={content.vision} />
        <Values content={content.values} />
        <Services content={content.services} />
        <Projects content={content.projects} />
        <Recognition content={content.recognition} />
        <Contact content={content.contact} contacts={content.contacts} />
      </main>
      <SiteFooter note={content.footer.note} tagline={content.brand.tagline} />
    </>
  );
}
