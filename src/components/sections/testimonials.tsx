import type { TestimonialsData } from "@/lib/content/types";

export function Testimonials({ content }: { content: TestimonialsData }) {
  if (!content.items.length) return null;

  return (
    <section className="section-pad border-t border-line">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          {content.eyebrow ? <p className="eyebrow">{content.eyebrow}</p> : null}
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
          {content.intro ? (
            <p className="mt-4 text-muted">{content.intro}</p>
          ) : null}
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
            <li
              key={item.id}
              className="border border-line bg-surface/40 p-6"
            >
              {item.photo ? (
                <div className="mb-4 h-14 w-14 overflow-hidden rounded-full bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <blockquote className="text-sm italic leading-relaxed text-cream/90">
                “{item.quote}”
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-cream">{item.name}</p>
              {(item.role || item.company) && (
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-accent">
                  {[item.role, item.company].filter(Boolean).join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
