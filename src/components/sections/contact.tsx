import { ContactForm } from "@/components/contact-form";
import type { SiteContent } from "@/lib/content/types";

export function Contact({
  content,
  contacts,
}: {
  content: SiteContent["contact"];
  contacts: SiteContent["contacts"];
}) {
  return (
    <section id="contact" className="section-pad bg-surface border-t border-line">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-muted">{content.intro}</p>
        </div>
        <div className="mt-12">
          <ContactForm contacts={contacts} labels={content} />
        </div>
      </div>
    </section>
  );
}
