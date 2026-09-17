import type { SiteContent } from "@/lib/content/types";

export function Services({ content }: { content: SiteContent["services"] }) {
  return (
    <section id="services" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={content.image}
          alt=""
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className="section-pad mx-auto max-w-7xl">
        <p className="eyebrow">What we deliver</p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-6xl">
          {content.title}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {content.items.map((service) => (
            <article
              key={service.id}
              className="border border-line bg-background/70 p-8 backdrop-blur-sm transition hover:border-accent"
            >
              <h3 className="font-[family-name:var(--font-display)] text-3xl text-accent">
                {service.title}
              </h3>
              <p className="mt-5 max-w-md text-muted">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
