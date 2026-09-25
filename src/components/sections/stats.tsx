import type { StatsData } from "@/lib/content/types";

export function Stats({ content }: { content: StatsData }) {
  if (!content.items.length) return null;

  return (
    <section className="section-pad border-t border-line bg-surface">
      <div className="mx-auto max-w-7xl">
        {(content.eyebrow || content.title) && (
          <div className="mb-10 max-w-2xl">
            {content.eyebrow ? (
              <p className="eyebrow">{content.eyebrow}</p>
            ) : null}
            {content.title ? (
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight text-cream md:text-5xl">
                {content.title}
              </h2>
            ) : null}
          </div>
        )}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item) => (
            <li key={item.id} className="border border-line bg-background/50 p-6">
              <p className="font-[family-name:var(--font-display)] text-4xl text-accent md:text-5xl">
                {item.number}
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.16em] text-cream">
                {item.label}
              </p>
              {item.detail?.trim() ? (
                <p className="mt-2 text-sm text-muted">{item.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
