import type { SiteContent } from "@/lib/content/types";

export function WhoWeAre({ content }: { content: SiteContent["whoWeAre"] }) {
  return (
    <section id="who-we-are" className="section-pad border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
        </div>
        <div>
          <p className="text-lg leading-relaxed text-muted md:text-xl">
            {content.body}
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {content.credentials.map((item) => (
              <li
                key={item}
                className="border-l-2 border-accent bg-surface/60 px-4 py-3 text-sm text-foreground"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
