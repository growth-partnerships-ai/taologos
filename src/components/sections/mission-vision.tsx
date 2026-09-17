import type { SiteContent } from "@/lib/content/types";

export function MissionVision({
  mission,
  vision,
}: {
  mission: SiteContent["mission"];
  vision: SiteContent["vision"];
}) {
  return (
    <section id="mission" className="section-pad bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
        {[mission, vision].map((block) => (
          <article
            key={block.title}
            className="relative overflow-hidden border border-line bg-background/40 p-8 md:p-10"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/15 blur-2xl"
            />
            <p className="eyebrow">{block.title}</p>
            <p className="mt-6 font-[family-name:var(--font-display)] text-2xl leading-snug text-cream md:text-3xl">
              {block.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
