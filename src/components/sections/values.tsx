import type { SiteContent } from "@/lib/content/types";

export function Values({ content }: { content: SiteContent["values"] }) {
  return (
    <section id="values" className="section-pad">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
            {content.title}
          </h2>
          <p className="mt-4 text-muted">{content.intro}</p>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, index) => (
            <li
              key={item.id}
              className="bg-background p-7 transition duration-300 hover:bg-surface"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <span className="font-[family-name:var(--font-display)] text-sm text-accent">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-xl text-cream">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
